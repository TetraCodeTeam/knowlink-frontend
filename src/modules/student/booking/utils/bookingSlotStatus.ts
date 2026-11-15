import { toDateStr, toLocalDateTimeStr } from "@/shared/utils/calendarDateUtils";
import type { BookingSlotEvent } from "@/modules/student/booking/interfaces/bookingSlotEventType";
import type { SlotDisplayStatus } from "@/modules/student/booking/interfaces/slotDisplayStatusType";

/**
 * Estado con el que se dibuja un bloque. "Pasado" no viene del backend: depende de la hora actual,
 * por eso `nowMs` se recibe de afuera y el calendario puede recalcularlo a medida que pasa el tiempo.
 */
export function getSlotDisplayStatus(slot: BookingSlotEvent, nowMs: number): SlotDisplayStatus {
  if (new Date(slot.end).getTime() < nowMs) return "PAST";
  if (slot.status === "BLOCKED") return "BLOCKED";
  if (slot.status === "RESERVED") return "RESERVED";
  return "AVAILABLE";
}

/**
 * Franja de fondo que sombrea desde la medianoche de hoy hasta `nowMs`, para orientar al alumno
 * sobre "dónde está parado" en la semana. Solo existe si la semana visible incluye el día de hoy.
 */
export function buildNowOverlayEvent(nowMs: number, viewedRange: { start: string; end: string }) {
  const now = new Date(nowMs);
  const todayStr = toDateStr(now);
  const isViewingToday = todayStr >= viewedRange.start && todayStr <= viewedRange.end;
  if (!isViewingToday) return null;

  return {
    start: `${todayStr}T00:00:00`,
    end: toLocalDateTimeStr(now),
    display: "background" as const,
    classNames: ["fc-past-now"],
  };
}
