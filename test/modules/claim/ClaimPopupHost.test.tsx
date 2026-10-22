import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ClaimPopupHost from "@/modules/claim/components/ClaimPopupHost";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useClaimPopupStore } from "@/modules/claim/hooks/useClaimPopupStore";
import type { ClaimEligibility } from "@/modules/claim/interfaces/claimInterfaces";
import type { BookingHistoryDetail } from "@/modules/class-history/interfaces/responses/booking-history-detail.interface";

vi.mock("@/modules/claim/api/claim.api", () => ({
  getClaimEligibility: vi.fn(),
  createClaim: vi.fn(),
}));
vi.mock("@/modules/class-history/api/classHistory.api", () => ({
  getBookingDetail: vi.fn(),
}));

import { getClaimEligibility, createClaim } from "@/modules/claim/api/claim.api";
import { getBookingDetail } from "@/modules/class-history/api/classHistory.api";

const mockedGetEligibility = vi.mocked(getClaimEligibility);
const mockedCreateClaim = vi.mocked(createClaim);
const mockedGetBookingDetail = vi.mocked(getBookingDetail);

function makeEligibility(overrides: Partial<ClaimEligibility> = {}): ClaimEligibility {
  return {
    canClaim: true,
    claimableUntil: null,
    blockReason: null,
    allowedReasons: ["I_COULD_NOT_ATTEND"],
    ...overrides,
  };
}

function makeDetail(overrides: Partial<BookingHistoryDetail> = {}): BookingHistoryDetail {
  return {
    bookingId: "b-1",
    otherPartyFullName: "María Luz Juárez",
    otherPartyProfilePictureUrl: null,
    subjectName: "Física 1",
    sessionDate: new Date().toISOString().slice(0, 10),
    startTime: "10:00:00",
    endTime: "23:59:00",
    modality: "VIRTUAL",
    status: "COMPLETED",
    amount: 15000,
    topic: "Repaso",
    virtualSessionLink: "https://meet.example.com/abc",
    address: null,
    createdAt: "2026-10-15T10:00:00",
    ...overrides,
  };
}

function renderHost() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  render(<ClaimPopupHost />, { wrapper });
}

function openPopup(bookingId = "b-1") {
  act(() => {
    useClaimPopupStore.getState().open(bookingId);
  });
}

describe("ClaimPopupHost", () => {
  beforeEach(() => {
    mockedGetEligibility.mockReset();
    mockedCreateClaim.mockReset();
    mockedGetBookingDetail.mockReset();
    useAuthStore.setState({
      isAuthenticated: true,
      authResponse: {
        userId: "u-1",
        email: "alumno@test.com",
        token: "token",
        role: "STUDENT",
      } as never,
    });
    useClaimPopupStore.setState({ bookingId: null });
  });

  it("no renderiza nada cuando el store esta vacio", () => {
    mockedGetEligibility.mockResolvedValue(makeEligibility());
    renderHost();

    expect(screen.queryByText("Iniciar reclamo")).not.toBeInTheDocument();
  });

  it("abre el dialogo de reclamo cuando la sesion es elegible", async () => {
    mockedGetEligibility.mockResolvedValue(makeEligibility());
    mockedGetBookingDetail.mockResolvedValue(makeDetail());
    renderHost();
    openPopup();

    expect(await screen.findByText("Iniciar reclamo")).toBeInTheDocument();
    expect(screen.getByText(/Física 1 con María Luz Juárez/)).toBeInTheDocument();
    expect(mockedGetEligibility).toHaveBeenCalledWith("b-1");
  });

  it("muestra el dialogo de bloqueo cuando no puede reclamar", async () => {
    mockedGetEligibility.mockResolvedValue(
      makeEligibility({ canClaim: false, blockReason: "ACTIVE_CLAIM_EXISTS", allowedReasons: [] })
    );
    renderHost();
    openPopup();

    expect(await screen.findByText("No podés iniciar un reclamo")).toBeInTheDocument();
    expect(screen.getByText("Ya tenés un reclamo abierto para esta sesión.")).toBeInTheDocument();
  });

  it("al cancelar cierra el store", async () => {
    const user = userEvent.setup();
    mockedGetEligibility.mockResolvedValue(makeEligibility());
    mockedGetBookingDetail.mockResolvedValue(makeDetail());
    renderHost();
    openPopup();

    await user.click(await screen.findByRole("button", { name: "Cancelar" }));

    expect(useClaimPopupStore.getState().bookingId).toBeNull();
  });

  it("al enviar el reclamo cierra el store", async () => {
    const user = userEvent.setup();
    mockedGetEligibility.mockResolvedValue(makeEligibility());
    mockedGetBookingDetail.mockResolvedValue(makeDetail());
    mockedCreateClaim.mockResolvedValue({} as never);
    renderHost();
    openPopup();

    await user.click(await screen.findByText("Yo no pude asistir"));
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    await waitFor(() => {
      expect(useClaimPopupStore.getState().bookingId).toBeNull();
    });
    expect(mockedCreateClaim).toHaveBeenCalledWith(
      "b-1",
      { reason: "I_COULD_NOT_ATTEND", comment: undefined },
      []
    );
  });

  it("un 409 al crear el reclamo cierra el store", async () => {
    const user = userEvent.setup();
    mockedGetEligibility.mockResolvedValue(makeEligibility());
    mockedGetBookingDetail.mockResolvedValue(makeDetail());
    mockedCreateClaim.mockRejectedValue(
      Object.assign(new Error("conflict"), {
        isAxiosError: true,
        response: { status: 409 },
      })
    );
    renderHost();
    openPopup();

    await user.click(await screen.findByText("Yo no pude asistir"));
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    await waitFor(() => {
      expect(useClaimPopupStore.getState().bookingId).toBeNull();
    });
  });
});
