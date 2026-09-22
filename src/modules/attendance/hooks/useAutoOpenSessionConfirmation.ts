import { useEffect, useRef } from "react";
import { useSessionConfirmationStore } from "@/modules/attendance/hooks/useSessionConfirmationStore";
import { useEligibleConfirmationBooking } from "@/modules/attendance/hooks/useEligibleConfirmationBooking";

/**
 * Abre automáticamente el widget de confirmación del tutor apenas se
 * habilita la ventana de confirmación de una clase.
 */
export function useAutoOpenSessionConfirmation() {
  const eligibleBooking = useEligibleConfirmationBooking("TUTOR");
  const pending = useSessionConfirmationStore((state) => state.pending);
  const openConfirmation = useSessionConfirmationStore((state) => state.openConfirmation);
  const clearConfirmation = useSessionConfirmationStore((state) => state.clearConfirmation);

  // `eligibleBooking` sigue viniendo del último fetch cacheado hasta el
  // próximo poll, así que puede seguir marcando como elegible una reserva
  // recién confirmada (o vencida). Guardamos acá las que ya se resolvieron
  // para no reabrir el popup con esos datos stale.
  const resolvedBookingIdsRef = useRef<Set<string>>(new Set());
  const previousPendingSessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (pending) {
      previousPendingSessionIdRef.current = pending.sessionId;
    } else if (previousPendingSessionIdRef.current) {
      resolvedBookingIdsRef.current.add(previousPendingSessionIdRef.current);
      previousPendingSessionIdRef.current = null;
    }
  }, [pending]);

  useEffect(() => {
    if (!eligibleBooking) {
      if (pending) clearConfirmation();
      return;
    }

    if (resolvedBookingIdsRef.current.has(eligibleBooking.bookingId)) return;

    if (pending?.sessionId !== eligibleBooking.bookingId) {
      openConfirmation({
        sessionId: eligibleBooking.bookingId,
        expiresAt: eligibleBooking.expiresAt,
        deadlineLabel: new Date(eligibleBooking.expiresAt).toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }
  }, [eligibleBooking, pending, openConfirmation, clearConfirmation]);
}
