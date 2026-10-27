import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RatingPopupHost from "@/modules/class-history/components/RatingPopupHost";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useRatingPopupStore } from "@/modules/class-history/hooks/useRatingPopupStore";
import type { BookingHistoryDetail } from "@/modules/class-history/interfaces/responses/booking-history-detail.interface";

vi.mock("@/modules/class-history/api/classHistory.api", () => ({
  getBookingDetail: vi.fn(),
  rateBooking: vi.fn(),
}));

import { getBookingDetail, rateBooking } from "@/modules/class-history/api/classHistory.api";

const mockedGetBookingDetail = vi.mocked(getBookingDetail);
const mockedRateBooking = vi.mocked(rateBooking);

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
  render(<RatingPopupHost />, { wrapper });
}

function openPopup(bookingId = "b-1") {
  act(() => {
    useRatingPopupStore.getState().open(bookingId);
  });
}

describe("RatingPopupHost", () => {
  beforeEach(() => {
    mockedGetBookingDetail.mockReset();
    mockedRateBooking.mockReset();
    localStorage.clear();
    useAuthStore.setState({
      isAuthenticated: true,
      authResponse: {
        userId: "u-1",
        email: "alumno@test.com",
        token: "token",
        role: "STUDENT",
      } as never,
    });
    useRatingPopupStore.setState({ bookingId: null });
  });

  it("no renderiza nada cuando el store esta vacio", () => {
    mockedGetBookingDetail.mockResolvedValue(makeDetail());
    renderHost();

    expect(screen.queryByText("Calificá tu sesión")).not.toBeInTheDocument();
  });

  it("abre el dialogo de calificacion cuando el detalle carga", async () => {
    mockedGetBookingDetail.mockResolvedValue(makeDetail());
    renderHost();
    openPopup();

    expect(await screen.findByText("Calificá tu sesión")).toBeInTheDocument();
    expect(screen.getByText(/Física 1 con María Luz Juárez/)).toBeInTheDocument();
    expect(mockedGetBookingDetail).toHaveBeenCalledWith("b-1");
  });

  it("muestra el dialogo de ya calificaste si el storage local lo indica", async () => {
    localStorage.setItem("knowlink:ratedBookingIds:u-1", JSON.stringify(["b-1"]));
    mockedGetBookingDetail.mockResolvedValue(makeDetail());
    renderHost();
    openPopup();

    expect(await screen.findByText("Ya calificaste esta sesión")).toBeInTheDocument();
  });

  it("al cancelar cierra el store", async () => {
    const user = userEvent.setup();
    mockedGetBookingDetail.mockResolvedValue(makeDetail());
    renderHost();
    openPopup();

    await user.click(await screen.findByRole("button", { name: "Cancelar" }));

    expect(useRatingPopupStore.getState().bookingId).toBeNull();
  });

  it("al calificar con exito muestra el dialogo de exito", async () => {
    const user = userEvent.setup();
    mockedGetBookingDetail.mockResolvedValue(makeDetail());
    mockedRateBooking.mockResolvedValue({} as never);
    renderHost();
    openPopup();

    await user.click(await screen.findByRole("radio", { name: "5 estrellas" }));
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByText("Calificación enviada")).toBeInTheDocument();
    expect(mockedRateBooking).toHaveBeenCalledWith("b-1", { score: 5, comment: null });
    expect(useRatingPopupStore.getState().bookingId).toBe("b-1");
  });

  it("el dialogo de exito cierra el store al confirmar", async () => {
    const user = userEvent.setup();
    mockedGetBookingDetail.mockResolvedValue(makeDetail());
    mockedRateBooking.mockResolvedValue({} as never);
    renderHost();
    openPopup();

    await user.click(await screen.findByRole("radio", { name: "5 estrellas" }));
    await user.click(screen.getByRole("button", { name: "Enviar" }));
    await screen.findByText("Calificación enviada");
    await user.click(screen.getByRole("button", { name: "Cerrar" }));

    expect(useRatingPopupStore.getState().bookingId).toBeNull();
  });

  it("un 409 muestra el dialogo de ya calificaste", async () => {
    const user = userEvent.setup();
    mockedGetBookingDetail.mockResolvedValue(makeDetail());
    mockedRateBooking.mockRejectedValue(
      Object.assign(new Error("conflict"), {
        isAxiosError: true,
        response: { status: 409 },
      })
    );
    renderHost();
    openPopup();

    await user.click(await screen.findByRole("radio", { name: "5 estrellas" }));
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    await waitFor(() => {
      expect(screen.getByText("Ya calificaste esta sesión")).toBeInTheDocument();
    });
  });

  it("cierra el store si la ventana de calificacion ya vencio", async () => {
    mockedGetBookingDetail.mockResolvedValue(
      makeDetail({ sessionDate: "2020-01-01", endTime: "10:00:00" })
    );
    renderHost();
    openPopup();

    await waitFor(() => {
      expect(useRatingPopupStore.getState().bookingId).toBeNull();
    });
    expect(screen.queryByText("Calificá tu sesión")).not.toBeInTheDocument();
  });
});
