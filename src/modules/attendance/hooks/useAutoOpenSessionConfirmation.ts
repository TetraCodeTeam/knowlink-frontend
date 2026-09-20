import { useEffect } from "react";
import { useSessionConfirmationStore } from "@/modules/attendance/hooks/useSessionConfirmationStore";
import { useEligibleConfirmationBooking } from "@/modules/attendance/hooks/useEligibleConfirmationBooking";

/**
 * Abre automáticamente el widget de confirmación del tutor apenas se
 * habilita la ventana de confirmación de una clase (sin botón manual).
 * Montar una sola vez en el layout raíz del tutor.
 */
export function useAutoOpenSessionConfirmation() {
  const eligibleBooking = useEligibleConfirmationBooking("TUTOR");
  const pending = useSessionConfirmationStore((state) => state.pending);
  const openConfirmation = useSessionConfirmationStore((state) => state.openConfirmation);
  const clearConfirmation = useSessionConfirmationStore((state) => state.clearConfirmation);

  useEffect(() => {
    if (eligibleBooking && pending?.sessionId !== eligibleBooking.bookingId) {
      openConfirmation({
        sessionId: eligibleBooking.bookingId,
        expiresAt: eligibleBooking.expiresAt,
        deadlineLabel: new Date(eligibleBooking.expiresAt).toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } else if (!eligibleBooking && pending) {
      clearConfirmation();
    }
  }, [eligibleBooking, pending, openConfirmation, clearConfirmation]);
}
