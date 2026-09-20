import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import {
  getUpcomingConfirmableBookings,
  type UpcomingConfirmableBooking,
} from "@/modules/attendance/api/attendance.api";
import type { Role } from "@/shared/types/role.type";

const CONFIRMATION_LEAD_TIME_MS = 5 * 60 * 1000;
// A partir de acá empezamos a pollear rápido, para no perdernos el momento
// exacto en que se abre la ventana de confirmación (5 min antes del inicio).
const NEAR_WINDOW_MS = 15 * 60 * 1000;
const FAST_POLL_MS = 15_000;
const SLOW_POLL_MS = 5 * 60 * 1000;

export interface EligibleConfirmationBooking {
  bookingId: string;
  expiresAt: string;
}

function getSessionStartMs(booking: UpcomingConfirmableBooking): number {
  return new Date(`${booking.sessionDate}T${booking.startTime}`).getTime();
}

/** Pollea rápido solo si hay alguna reserva por entrar en su ventana de
 * confirmación; si no, espacía los refetch para no pegarle al backend en vano. */
function computeRefetchInterval(bookings: UpcomingConfirmableBooking[] | undefined): number {
  if (!bookings || bookings.length === 0) return SLOW_POLL_MS;

  const now = Date.now();
  const hasNearBooking = bookings.some(
    (booking) => getSessionStartMs(booking) - now <= NEAR_WINDOW_MS
  );

  return hasNearBooking ? FAST_POLL_MS : SLOW_POLL_MS;
}

/**
 * De las reservas activas del usuario, devuelve la primera cuya ventana de
 * confirmación por token ya está abierta: desde 5 minutos antes del inicio
 * de la clase (mismo lead time que usa el backend para generar el token)
 * hasta que el código vence del lado del servidor.
 */
export function useEligibleConfirmationBooking(role: Role): EligibleConfirmationBooking | null {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data } = useQuery({
    queryKey: ["attendance-upcoming-bookings", role],
    queryFn: () => getUpcomingConfirmableBookings(role),
    enabled: isAuthenticated,
    refetchInterval: (query) => computeRefetchInterval(query.state.data),
    staleTime: 0,
  });

  // Necesitamos re-evaluar la ventana de tiempo entre polls, no solo cuando
  // cambian los datos del backend.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return useMemo(() => {
    if (!data) return null;

    for (const booking of data) {
      if (!booking.confirmationTokenExpiresAt) continue;

      const sessionStart = getSessionStartMs(booking);
      const expiresAt = new Date(booking.confirmationTokenExpiresAt).getTime();

      if (now >= sessionStart - CONFIRMATION_LEAD_TIME_MS && now < expiresAt) {
        return { bookingId: booking.bookingId, expiresAt: booking.confirmationTokenExpiresAt };
      }
    }
    return null;
  }, [data, now]);
}
