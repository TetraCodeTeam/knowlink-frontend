import { useEffect } from "react";
import { useSessionConfirmationStore } from "@/modules/attendance/hooks/useSessionConfirmationStore";
import { useEligibleConfirmationBooking } from "@/modules/attendance/hooks/useEligibleConfirmationBooking";

/**
 * Abre automáticamente el widget de confirmación del tutor apenas se
 * habilita la ventana de confirmación de una clase.
 */
export function useAutoOpenSessionConfirmation() {
  // `isResolved` se lee antes porque va como criterio de salteo a
  // useEligibleConfirmationBooking: así una reserva resuelta no tapa a la
  // siguiente que ya tenga su ventana abierta (clases pegadas).
  const isResolved = useSessionConfirmationStore((state) => state.isResolved);
  const eligibleBooking = useEligibleConfirmationBooking("TUTOR", { skip: isResolved });
  const pending = useSessionConfirmationStore((state) => state.pending);
  // `eligibleBooking` sigue viniendo del último fetch cacheado hasta el
  // próximo poll, así que puede seguir marcando como elegible una reserva
  // recién confirmada (o vencida). `isResolved` consulta el Map con TTL
  // del store global (no un ref local) para no perderse si este
  // componente se remonta antes del próximo refetch.
  const openConfirmation = useSessionConfirmationStore((state) => state.openConfirmation);
  // Cerrar sin resolver: acá no hubo confirmación ni vencimiento, solo
  // dejó de haber reserva elegible (p. ej. logout, que vacía la caché de
  // queries). Usar clearConfirmation acá marcaría la clase como resuelta
  // y bloquearía el popup durante el TTL de 6 min.
  const closeConfirmation = useSessionConfirmationStore((state) => state.closeConfirmation);

  useEffect(() => {
    if (!eligibleBooking) {
      if (pending) closeConfirmation();
      return;
    }

    // Defensa ante datos stale entre el filtrado del hook y este efecto.
    if (isResolved(eligibleBooking.bookingId)) return;

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
  }, [eligibleBooking, pending, isResolved, openConfirmation, closeConfirmation]);
}
