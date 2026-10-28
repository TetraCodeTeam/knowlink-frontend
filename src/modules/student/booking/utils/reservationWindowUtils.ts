import type { ReservationWindow } from "@/modules/student/booking/interfaces/reservationWindowType";

const RESERVATION_WINDOW_MS = 60 * 60 * 1000; // franja base de 1 hora
const STEP_MS = 30 * 60 * 1000; // paso de 30 minutos entre franjas posibles

/** Duración mínima y máxima de una reserva, siempre en horas completas. */
export const MIN_RESERVATION_HOURS = 1;
export const MAX_RESERVATION_HOURS = 3;

/**
 * Dado un bloque de disponibilidad (start-end), devuelve todas las franjas
 * de 1 hora que el alumno puede usar como punto de partida o de llegada al
 * arrastrar, en pasos de 30 minutos.
 *
 * Ej: bloque de 15:00 a 17:00 (2h) → [15:00-16:00, 15:30-16:30, 16:00-17:00]
 *
 * El alumno puede combinar varias franjas contiguas para reservar 1, 2 o 3
 * horas completas; esa regla de duración se valida al interpretar el arrastre
 * (useAvailabilityBlockInteraction), no acá.
 *
 * Asume que la duración del bloque es múltiplo de 30 min y de al menos 60
 * min (garantizado por cómo el tutor configura su disponibilidad). No hace
 * ningún tipo de validación defensiva de tramos sobrantes: un bloque de
 * duración menor a 60 min simplemente no genera ninguna ventana.
 */
export function getReservationWindows(blockStart: Date, blockEnd: Date): ReservationWindow[] {
  const windows: ReservationWindow[] = [];
  let windowStart = blockStart.getTime();

  while (windowStart + RESERVATION_WINDOW_MS <= blockEnd.getTime()) {
    windows.push({
      start: new Date(windowStart),
      end: new Date(windowStart + RESERVATION_WINDOW_MS),
    });
    windowStart += STEP_MS;
  }

  return windows;
}

/**
 * Una reserva válida dura 1, 2 o 3 horas completas. El backend aplica la
 * misma regla al crear el hold, así que el frontend la valida antes de enviar.
 */
export function hasValidReservationDuration(selection: ReservationWindow): boolean {
  const durationMinutes = (selection.end.getTime() - selection.start.getTime()) / (60 * 1000);

  return (
    durationMinutes >= MIN_RESERVATION_HOURS * 60 &&
    durationMinutes <= MAX_RESERVATION_HOURS * 60 &&
    durationMinutes % 60 === 0
  );
}

/**
 * Dada la posición del mouse relativa a la altura total de un bloque
 * renderizado (0 = arriba del todo, 1 = abajo del todo), devuelve la
 * ventana de 1h correspondiente según en qué "franja de 30 min" cae.
 */
export function getWindowAtRelativePosition(
  windows: ReservationWindow[],
  relativeY: number
): ReservationWindow | null {
  if (windows.length === 0) return null;

  const clampedY = Math.min(Math.max(relativeY, 0), 0.999);
  const index = Math.floor(clampedY * windows.length);
  return windows[index] ?? windows[windows.length - 1];
}
