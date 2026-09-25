import { useStudentTokenStore } from "@/modules/attendance/hooks/useStudentTokenStore";
import { getSessionConfirmationToken } from "@/modules/attendance/api/attendance.api";

/**
 * Trae del backend el código de confirmación vigente de una reserva y lo
 * muestra en el widget flotante del alumno (StudentTokenWidget).
 */
export function useShowSessionToken() {
  const showToken = useStudentTokenStore((state) => state.showToken);

  return async (bookingId: string) => {
    const code = await getSessionConfirmationToken(bookingId);
    showToken({ sessionId: bookingId, code });
  };
}
