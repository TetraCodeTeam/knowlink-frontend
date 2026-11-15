import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAutoOpenSessionConfirmation } from "@/modules/attendance/hooks/useAutoOpenSessionConfirmation";
import { useSessionConfirmationStore } from "@/modules/attendance/hooks/useSessionConfirmationStore";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { queryClient as sharedQueryClient } from "@/shared/lib/queryClient";
import type { AuthResponse } from "@/modules/auth/interfaces/responses/auth.interface";
import type { UpcomingConfirmableBooking } from "@/modules/attendance/api/attendance.api";

vi.mock("@/modules/attendance/api/attendance.api", () => ({
  getUpcomingConfirmableBookings: vi.fn(),
}));

import { getUpcomingConfirmableBookings } from "@/modules/attendance/api/attendance.api";

const mockedGetBookings = vi.mocked(getUpcomingConfirmableBookings);

const TUTOR_AUTH_RESPONSE: AuthResponse = {
  userId: "tutor-1",
  email: "tutor@test.com",
  fullName: "Tutor de prueba",
  token: "token",
  role: "TUTOR",
};

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function localDatePart(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function localTimePart(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function makeBooking(
  overrides: Partial<UpcomingConfirmableBooking> = {}
): UpcomingConfirmableBooking {
  const now = new Date();
  const sessionStart = new Date(now.getTime() - 60_000); // la clase ya empezó
  const expiresAt = new Date(now.getTime() + 5 * 60_000); // el código vence en 5 min

  return {
    bookingId: "booking-1",
    sessionDate: localDatePart(sessionStart),
    startTime: localTimePart(sessionStart),
    endTime: localTimePart(sessionStart),
    confirmationTokenExpiresAt: `${localDatePart(expiresAt)}T${localTimePart(expiresAt)}`,
    ...overrides,
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
    useSessionConfirmationStore.setState({ pending: null, resolvedBookingIds: new Map() });
    sharedQueryClient.clear();
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
    expect(useSessionConfirmationStore.getState().isResolved("booking-1")).toBe(true);

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

  it("reabre el popup al volver a entrar como tutor tras cerrar sesión sin confirmar (Escenario 1)", async () => {
    mockedGetBookings.mockResolvedValue([makeBooking()]);

    // El layout del tutor se monta sobre el queryClient compartido de la app,
    // el mismo que `logout()` limpia con `queryClient.clear()`.
    renderWithClient(sharedQueryClient);

    await waitFor(() => {
      expect(useSessionConfirmationStore.getState().pending?.sessionId).toBe("booking-1");
    });

    // Cierra sesión con el popup abierto, sin ingresar el token.
    act(() => {
      useAuthStore.getState().logout();
    });

    // La reserva no fue confirmada ni venció: no debe quedar "resuelta".
    expect(useSessionConfirmationStore.getState().isResolved("booking-1")).toBe(false);

    // Vuelve a iniciar sesión como tutor dentro de los 6 min del TTL.
    act(() => {
      useAuthStore.getState().login(TUTOR_AUTH_RESPONSE);
    });

    await waitFor(() => {
      expect(useSessionConfirmationStore.getState().pending?.sessionId).toBe("booking-1");
    });
  });

  it("una reserva resuelta no tapa a la siguiente con la ventana abierta (Escenario 5)", async () => {
    const bookingA = makeBooking({ bookingId: "booking-a" });
    const bookingB = makeBooking({ bookingId: "booking-b" });
    // El backend devuelve las reservas ordenadas por inicio ASC: A primero.
    mockedGetBookings.mockResolvedValue([bookingA, bookingB]);

    // A ya quedó resuelta (confirmada o vencida) mientras el popup la mostraba.
    act(() => {
      useSessionConfirmationStore.setState({
        pending: {
          sessionId: "booking-a",
          expiresAt: bookingA.confirmationTokenExpiresAt ?? "",
          deadlineLabel: "00:00 hs",
        },
      });
      useSessionConfirmationStore.getState().clearConfirmation();
    });
    expect(useSessionConfirmationStore.getState().isResolved("booking-a")).toBe(true);

    renderWithClient(new QueryClient());

    await waitFor(() => {
      expect(useSessionConfirmationStore.getState().pending?.sessionId).toBe("booking-b");
    });
  });
});
