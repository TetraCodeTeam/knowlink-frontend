import type { ReservationWindow } from "@/modules/student/booking/interfaces/reservationWindowType";

const RESERVATION_DURATION_MS = 60 * 60 * 1000; // 1 hora, fija para esta versión
const STEP_MS = 30 * 60 * 1000; // paso de 30 minutos entre ventanas posibles

/**
 * Dado un bloque de disponibilidad (start-end), devuelve todas las ventanas
 * de 1 hora reservables dentro de ese rango, en pasos de 30 minutos.
 *
 * Ej: bloque de 15:00 a 17:00 (2h) → [15:00-16:00, 15:30-16:30, 16:00-17:00]
 *
 * Asume que la duración del bloque es múltiplo de 30 min y de al menos 60
 * min (garantizado por cómo el tutor configura su disponibilidad). No hace
 * ningún tipo de validación defensiva de tramos sobrantes: un bloque de
 * duración menor a 60 min simplemente no genera ninguna ventana.
 */
export function getReservationWindows(blockStart: Date, blockEnd: Date): ReservationWindow[] {
  const windows: ReservationWindow[] = [];
  let windowStart = blockStart.getTime();

  while (windowStart + RESERVATION_DURATION_MS <= blockEnd.getTime()) {
    windows.push({
      start: new Date(windowStart),
      end: new Date(windowStart + RESERVATION_DURATION_MS),
    });
    windowStart += STEP_MS;
  }

  return windows;
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
