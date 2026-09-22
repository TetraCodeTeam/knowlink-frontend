// API de asistencia (US-41): el tutor confirma la sesión con el código de 4
// dígitos que le dicta el alumno, y el alumno consulta ese código vigente.
import { httpClient, rawHttpClient } from "@/shared/lib/httpClient";
import type { Role } from "@/shared/types/role.type";

interface ApiErrorPayload {
  message?: string;
  detail?: string;
}

export interface UpcomingConfirmableBooking {
  bookingId: string;
  sessionDate: string; // "yyyy-MM-dd"
  startTime: string; // "HH:mm:ss"
  endTime: string;
  /** null hasta que el backend genera el token (5 min antes del inicio). */
  confirmationTokenExpiresAt: string | null;
}

function extractErrorMessage(error: unknown, fallback: string): string {
  const payload = (error as { response?: { data?: ApiErrorPayload } })?.response?.data;
  return payload?.message ?? payload?.detail ?? fallback;
}

export async function confirmSessionAttendance(bookingId: string, code: string): Promise<void> {
  try {
    await rawHttpClient.patch(`/api/v1/bookings/${bookingId}/confirmation`, { token: code });
  } catch (error) {
    throw new Error(
      extractErrorMessage(
        error,
        "El código ingresado no es válido. Verificalo con tu alumno e intentá de nuevo."
      )
    );
  }
}

export async function getSessionConfirmationToken(bookingId: string): Promise<string> {
  try {
    const { data } = await rawHttpClient.get<{ token: string }>(
      `/api/v1/bookings/${bookingId}/confirmation-token`
    );
    return data.token;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "No se pudo obtener el código de confirmación."));
  }
}

/** Reservas activas (aún no confirmadas/vencidas/canceladas) del usuario, usadas
 * para detectar cuándo se abre la ventana de confirmación de una clase. */
export async function getUpcomingConfirmableBookings(
  role: Role
): Promise<UpcomingConfirmableBooking[]> {
  const { data } = await httpClient.get<{ content: UpcomingConfirmableBooking[] }>(
    "/api/v1/bookings/mine",
    { params: { role, category: "RESERVED", page: 0, size: 50 } }
  );
  return data.content;
}
