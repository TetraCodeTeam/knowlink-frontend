import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAutoOpenSessionConfirmation } from "@/modules/attendance/hooks/useAutoOpenSessionConfirmation";
import { useSessionConfirmationStore } from "@/modules/attendance/hooks/useSessionConfirmationStore";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type { UpcomingConfirmableBooking } from "@/modules/attendance/api/attendance.api";

vi.mock("@/modules/attendance/api/attendance.api", () => ({
  getUpcomingConfirmableBookings: vi.fn(),
}));

import { getUpcomingConfirmableBookings } from "@/modules/attendance/api/attendance.api";

const mockedGetBookings = vi.mocked(getUpcomingConfirmableBookings);

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function localDatePart(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function localTimePart(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function makeBooking(): UpcomingConfirmableBooking {
  const now = new Date();
  const sessionStart = new Date(now.getTime() - 60_000); // la clase ya empezó
  const expiresAt = new Date(now.getTime() + 5 * 60_000); // el código vence en 5 min

  return {
    bookingId: "booking-1",
    sessionDate: localDatePart(sessionStart),
    startTime: localTimePart(sessionStart),
    endTime: localTimePart(sessionStart),
    confirmationTokenExpiresAt: `${localDatePart(expiresAt)}T${localTimePart(expiresAt)}`,
  };
}

function renderWithClient(client: QueryClient) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return renderHook(() => useAutoOpenSessionConfirmation(), { wrapper });
}

describe("useAutoOpenSessionConfirmation — remount tras confirmar (bug de reapertura)", () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: true });
    useSessionConfirmationStore.setState({ pending: null, resolvedBookingIds: new Set() });
    mockedGetBookings.mockReset();
  });

  it("no reabre el popup de una reserva ya confirmada si el layout se remonta antes del próximo poll", async () => {
    mockedGetBookings.mockResolvedValue([makeBooking()]);
    const client = new QueryClient();

    const { unmount } = renderWithClient(client);

    await waitFor(() => {
      expect(useSessionConfirmationStore.getState().pending?.sessionId).toBe("booking-1");
    });

    // El tutor confirma con éxito: el widget limpia `pending` y la reserva
    // queda marcada como resuelta en el store global.
    act(() => {
      useSessionConfirmationStore.getState().clearConfirmation();
    });
    expect(useSessionConfirmationStore.getState().resolvedBookingIds.has("booking-1")).toBe(true);

    // El layout raíz se remonta (ej. cambio de ruta) antes de que llegue
    // el próximo poll: react-query sigue sirviendo la misma data cacheada,
    // donde la reserva todavía figura como elegible.
    unmount();
    renderWithClient(client);

    await waitFor(() => {
      expect(mockedGetBookings).toHaveBeenCalled();
    });

    expect(useSessionConfirmationStore.getState().pending).toBeNull();
  });
});
