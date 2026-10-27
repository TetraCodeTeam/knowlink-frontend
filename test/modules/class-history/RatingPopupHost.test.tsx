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

function toLocalDateTime(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function futureDeadline(offsetMs = 60 * 60 * 1000): string {
  return toLocalDateTime(new Date(Date.now() + offsetMs));
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
    ratingStatus: "PENDING",
    ratingDeadline: futureDeadline(),
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

function axiosError(status: number, detail?: string): Error {
  return Object.assign(new Error("request failed"), {
    isAxiosError: true,
    response: { status, data: detail ? { detail } : undefined },
  });
}

describe("RatingPopupHost", () => {
  beforeEach(() => {
    mockedGetBookingDetail.mockReset();
    mockedRateBooking.mockReset();
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

  it("abre el dialogo de calificacion cuando el detalle esta pendiente", async () => {
    mockedGetBookingDetail.mockResolvedValue(makeDetail());
    renderHost();
    openPopup();

    expect(await screen.findByText("Calificá tu sesión")).toBeInTheDocument();
    expect(screen.getByText(/Física 1 con María Luz Juárez/)).toBeInTheDocument();
    expect(mockedGetBookingDetail).toHaveBeenCalledWith("b-1");
  });

  it("muestra el dialogo de ya calificaste si el backend informa SUBMITTED", async () => {
    mockedGetBookingDetail.mockResolvedValue(
      makeDetail({ ratingStatus: "SUBMITTED", ratingDeadline: futureDeadline() })
    );
    renderHost();
    openPopup();

    expect(await screen.findByText("Ya calificaste esta sesión")).toBeInTheDocument();
    expect(screen.queryByText("Calificá tu sesión")).not.toBeInTheDocument();
  });

  it("muestra el aviso de plazo vencido si el backend informa EXPIRED", async () => {
    mockedGetBookingDetail.mockResolvedValue(
      makeDetail({ ratingStatus: "EXPIRED", ratingDeadline: futureDeadline() })
    );
    renderHost();
    openPopup();

    expect(await screen.findByText("El plazo para calificar venció")).toBeInTheDocument();
    expect(screen.queryByText("Calificá tu sesión")).not.toBeInTheDocument();
  });

  it("cierra el store cuando la calificacion no esta disponible", async () => {
    mockedGetBookingDetail.mockResolvedValue(
      makeDetail({ ratingStatus: "NOT_AVAILABLE", ratingDeadline: null })
    );
    renderHost();
    openPopup();

    await waitFor(() => {
      expect(useRatingPopupStore.getState().bookingId).toBeNull();
    });
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
    mockedRateBooking.mockRejectedValue(axiosError(409));
    renderHost();
    openPopup();

    await user.click(await screen.findByRole("radio", { name: "5 estrellas" }));
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    await waitFor(() => {
      expect(screen.getByText("Ya calificaste esta sesión")).toBeInTheDocument();
    });
  });

  it("un 422 RATING_WINDOW_EXPIRED muestra el aviso de plazo vencido", async () => {
    const user = userEvent.setup();
    mockedGetBookingDetail.mockResolvedValue(makeDetail());
    mockedRateBooking.mockRejectedValue(axiosError(422, "RATING_WINDOW_EXPIRED"));
    renderHost();
    openPopup();

    await user.click(await screen.findByRole("radio", { name: "5 estrellas" }));
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    await waitFor(() => {
      expect(screen.getByText("El plazo para calificar venció")).toBeInTheDocument();
    });
    expect(screen.queryByText("Ya calificaste esta sesión")).not.toBeInTheDocument();
  });

  it("si el plazo ya vencio al abrir el formulario muestra el aviso", async () => {
    mockedGetBookingDetail.mockResolvedValue(
      makeDetail({ ratingDeadline: futureDeadline(-60_000) })
    );
    renderHost();
    openPopup();

    expect(await screen.findByText("El plazo para calificar venció")).toBeInTheDocument();
  });

  it("si el plazo vence con el formulario abierto muestra el aviso", async () => {
    mockedGetBookingDetail.mockResolvedValue(makeDetail({ ratingDeadline: futureDeadline(1_200) }));
    renderHost();
    openPopup();

    expect(await screen.findByText("Calificá tu sesión")).toBeInTheDocument();
    expect(
      await screen.findByText("El plazo para calificar venció", {}, { timeout: 3000 })
    ).toBeInTheDocument();
  });
});
