import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RateBookingFlow from "@/modules/class-history/components/RateBookingFlow";
import type { BookingHistoryDetail } from "@/modules/class-history/interfaces/responses/booking-history-detail.interface";

vi.mock("@/modules/class-history/api/classHistory.api", () => ({
  rateBooking: vi.fn(),
}));

import { rateBooking } from "@/modules/class-history/api/classHistory.api";

const mockedRateBooking = vi.mocked(rateBooking);

function toLocalDateTime(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

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
    ratingDeadline: toLocalDateTime(new Date(Date.now() + 60 * 60 * 1000)),
    ...overrides,
  };
}

function renderFlow(detail: BookingHistoryDetail) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return render(<RateBookingFlow detail={detail} role="STUDENT" />, { wrapper });
}

function axiosError(status: number, detail?: string): Error {
  return Object.assign(new Error("request failed"), {
    isAxiosError: true,
    response: { status, data: detail ? { detail } : undefined },
  });
}

async function submitRating() {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Calificar" }));
  await user.click(await screen.findByRole("radio", { name: "4 estrellas" }));
  await user.click(screen.getByRole("button", { name: "Enviar" }));
}

describe("RateBookingFlow con refetch del detalle", () => {
  beforeEach(() => {
    mockedRateBooking.mockReset();
  });

  it("mantiene el aviso de ya calificaste cuando el refetch devuelve SUBMITTED", async () => {
    mockedRateBooking.mockRejectedValue(axiosError(409));
    const detail = makeDetail();
    const { rerender } = renderFlow(detail);

    await submitRating();
    expect(await screen.findByText("Ya calificaste esta sesión")).toBeInTheDocument();

    rerender(
      <RateBookingFlow
        detail={{ ...detail, ratingStatus: "SUBMITTED", ratingDeadline: null }}
        role="STUDENT"
      />
    );

    expect(screen.getByText("Ya calificaste esta sesión")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Calificar" })).not.toBeInTheDocument();
  });

  it("mantiene el aviso de plazo vencido cuando el refetch devuelve EXPIRED", async () => {
    mockedRateBooking.mockRejectedValue(axiosError(422, "RATING_WINDOW_EXPIRED"));
    const detail = makeDetail();
    const { rerender } = renderFlow(detail);

    await submitRating();
    expect(await screen.findByText("El plazo para calificar venció")).toBeInTheDocument();

    rerender(
      <RateBookingFlow
        detail={{ ...detail, ratingStatus: "EXPIRED", ratingDeadline: null }}
        role="STUDENT"
      />
    );

    expect(screen.getByText("El plazo para calificar venció")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Calificar" })).not.toBeInTheDocument();
  });

  it("muestra el aviso si el plazo vence con el formulario abierto", async () => {
    const user = userEvent.setup();
    renderFlow(makeDetail({ ratingDeadline: toLocalDateTime(new Date(Date.now() + 1_500)) }));

    await user.click(screen.getByRole("button", { name: "Calificar" }));
    expect(await screen.findByText("Calificá tu sesión")).toBeInTheDocument();

    expect(
      await screen.findByText("El plazo para calificar venció", {}, { timeout: 3000 })
    ).toBeInTheDocument();
  });
});
