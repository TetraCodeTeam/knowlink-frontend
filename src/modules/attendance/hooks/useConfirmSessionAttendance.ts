import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmSessionAttendance } from "@/modules/attendance/api/attendance.api";

interface ConfirmSessionAttendanceParams {
  sessionId: string;
  code: string;
}

/**
 * Envuelve la llamada a `confirmSessionAttendance` junto con la
 * invalidación de las reservas activas (`attendance-upcoming-bookings`).
 * Se centraliza acá, y no en cada componente que confirma una sesión,
 * para que un futuro entry point (ej. confirmar desde el detalle de la
 * reserva) obtenga la invalidación gratis sin tener que acordarse.
 */
export function useConfirmSessionAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, code }: ConfirmSessionAttendanceParams) =>
      confirmSessionAttendance(sessionId, code),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["attendance-upcoming-bookings"] });
      // The confirmed class now counts as COMPLETED in the tutor's weekly agenda
      // (summary + grid), so it must be refetched too.
      void queryClient.invalidateQueries({ queryKey: ["weekly-agenda"] });
    },
  });
}
