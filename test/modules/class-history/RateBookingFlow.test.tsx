import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RateBookingFlow from "@/modules/class-history/components/RateBookingFlow";
import type { BookingHistoryDetail } from "@/modules/class-history/interfaces/responses/booking-history-detail.interface";
import type { RatingStatus } from "@/modules/class-history/types/rating-status.type";

vi.mock("@/modules/class-history/api/classHistory.api", () => ({
  rateBooking: vi.fn(),
}));

import { rateBooking } from "@/modules/class-history/api/classHistory.api";

const mockedRateBooking = vi.mocked(rateBooking);

function makeDetail(overrides: Partial<BookingHistoryDetail> = {}): BookingHistoryDetail {
  return {
    bookingId: "b-1",
    otherPartyFullName: "María Luz Juárez",
    otherPartyProfilePictureUrl: null,
    subjectName: "Física 1",
    sessionDate: new Date().toISOString().slice(0, 10),
    startTime: "10:00:00",
    endTime: "11:00:00",
    modality: "VIRTUAL",
    status: "COMPLETED",
    amount: 15000,
    topic: "Repaso",
    virtualSessionLink: "https://meet.example.com/abc",
    address: null,
    createdAt: "2026-10-15T10:00:00",
    ratingStatus: "PENDING",
    ...overrides,
  };
}

function renderFlow(detail = makeDetail()) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  render(<RateBookingFlow detail={detail} role="STUDENT" />, { wrapper });
}

function axiosError(status: number, detail?: string): Error {
  return Object.assign(new Error("request failed"), {
    isAxiosError: true,
    response: { status, data: detail ? { detail } : undefined },
  });
}

describe("RateBookingFlow", () => {
  beforeEach(() => {
    mockedRateBooking.mockReset();
  });

  it("muestra el boton Calificar cuando el estado es PENDING", () => {
    renderFlow();
    expect(screen.getByRole("button", { name: "Calificar" })).toBeInTheDocument();
  });

  it.each<RatingStatus>(["SUBMITTED", "NOT_AVAILABLE"])(
    "no muestra el boton cuando el estado es %s",
    (ratingStatus) => {
      renderFlow(makeDetail({ ratingStatus }));
      expect(screen.queryByRole("button", { name: "Calificar" })).not.toBeInTheDocument();
    }
  );

  it("abre el formulario y envia la calificacion", async () => {
    const user = userEvent.setup();
    mockedRateBooking.mockResolvedValue({} as never);
    renderFlow();

    await user.click(screen.getByRole("button", { name: "Calificar" }));
    await user.click(await screen.findByRole("radio", { name: "4 estrellas" }));
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByText("Calificación enviada")).toBeInTheDocument();
    expect(mockedRateBooking).toHaveBeenCalledWith("b-1", { score: 4, comment: null });
  });

  it("un 409 muestra el dialogo de ya calificaste", async () => {
    const user = userEvent.setup();
    mockedRateBooking.mockRejectedValue(axiosError(409));
    renderFlow();

    await user.click(screen.getByRole("button", { name: "Calificar" }));
    await user.click(await screen.findByRole("radio", { name: "4 estrellas" }));
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByText("Ya calificaste esta sesión")).toBeInTheDocument();
  });

  it("ante un error de red mantiene el formulario abierto para reintentar", async () => {
    const user = userEvent.setup();
    mockedRateBooking.mockRejectedValue(axiosError(500));
    renderFlow();

    await user.click(screen.getByRole("button", { name: "Calificar" }));
    await user.click(await screen.findByRole("radio", { name: "4 estrellas" }));
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    await waitFor(() => {
      expect(screen.getByText("Calificá tu sesión")).toBeInTheDocument();
    });
    expect(screen.queryByText("Ya calificaste esta sesión")).not.toBeInTheDocument();
  });
});
