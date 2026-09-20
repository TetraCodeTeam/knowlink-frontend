import { useEffect } from "react";
import { useStudentTokenStore } from "@/modules/attendance/hooks/useStudentTokenStore";
import { useEligibleConfirmationBooking } from "@/modules/attendance/hooks/useEligibleConfirmationBooking";
import { getSessionConfirmationToken } from "@/modules/attendance/api/attendance.api";

/**
 * Muestra automáticamente el widget de token del alumno apenas se habilita
 * la ventana de confirmación de una clase (sin botón manual). Montar una
 * sola vez en el layout raíz del alumno.
 */
export function useAutoShowStudentToken() {
  const eligibleBooking = useEligibleConfirmationBooking("STUDENT");
  const active = useStudentTokenStore((state) => state.active);
  const showToken = useStudentTokenStore((state) => state.showToken);
  const hideToken = useStudentTokenStore((state) => state.hideToken);

  useEffect(() => {
    if (!eligibleBooking) {
      if (active) hideToken();
      return;
    }
    if (active?.sessionId === eligibleBooking.bookingId) return;

    let cancelled = false;
    getSessionConfirmationToken(eligibleBooking.bookingId)
      .then((code) => {
        if (!cancelled) showToken({ sessionId: eligibleBooking.bookingId, code });
      })
      .catch(() => undefined); // el próximo poll reintenta

    return () => {
      cancelled = true;
    };
  }, [eligibleBooking, active, showToken, hideToken]);
}
