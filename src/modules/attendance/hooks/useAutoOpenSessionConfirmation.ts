import { useEffect } from "react";
import { useSessionConfirmationStore } from "@/modules/attendance/hooks/useSessionConfirmationStore";
import { useEligibleConfirmationBooking } from "@/modules/attendance/hooks/useEligibleConfirmationBooking";

/**
 * Abre automáticamente el widget de confirmación del tutor apenas se
 * habilita la ventana de confirmación de una clase.
 */
export function useAutoOpenSessionConfirmation() {
  const eligibleBooking = useEligibleConfirmationBooking("TUTOR");
  const pending = useSessionConfirmationStore((state) => state.pending);
  // `eligibleBooking` sigue viniendo del último fetch cacheado hasta el
  // próximo poll, así que puede seguir marcando como elegible una reserva
  // recién confirmada (o vencida). `resolvedBookingIds` vive en el store
  // global (no en un ref local) para no perderse si este componente se
  // remonta antes del próximo refetch.
  const resolvedBookingIds = useSessionConfirmationStore((state) => state.resolvedBookingIds);
  const openConfirmation = useSessionConfirmationStore((state) => state.openConfirmation);
  const clearConfirmation = useSessionConfirmationStore((state) => state.clearConfirmation);

  useEffect(() => {
    if (!eligibleBooking) {
      if (pending) clearConfirmation();
      return;
    }

    if (resolvedBookingIds.has(eligibleBooking.bookingId)) return;

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
  }, [eligibleBooking, pending, resolvedBookingIds, openConfirmation, clearConfirmation]);
}
