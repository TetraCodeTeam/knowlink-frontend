import type { EventInput } from "@fullcalendar/core";

import type {
  AvailabilityBlockResponse,
  BookedSessionResponse,
} from "@/modules/tutor/weekly-schedule/interfaces/responses/weekly-agenda.interface";
import { AGENDA_BLOCK_COLOR } from "@/modules/tutor/weekly-schedule/constants/weekly-agenda.constants";

/** Devuelve la fecha concreta (dentro de la semana visible) para un dayOfWeek recurrente. */
function resolveDateForDayOfWeek(weekStart: Date, dayOfWeek: number): Date {
  const monday = new Date(weekStart);
  const mondayDow = monday.getDay() === 0 ? 7 : monday.getDay();
  const targetDow = dayOfWeek === 0 ? 7 : dayOfWeek;
  const diff = targetDow - mondayDow;
  const result = new Date(monday);
  result.setDate(monday.getDate() + diff);
  return result;
}

function isBeforeNow(date: Date, time: string): boolean {
  const [hours, minutes] = time.split(":").map(Number);
  const candidate = new Date(date);
  candidate.setHours(hours, minutes, 0, 0);
  return candidate.getTime() < Date.now();
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Convierte los bloques de disponibilidad libres en eventos de FullCalendar. */
export function mapAvailabilityBlocksToEvents(
  blocks: AvailabilityBlockResponse[],
  weekStart: Date
): EventInput[] {
  return blocks.map((block) => {
    const blockDate = resolveDateForDayOfWeek(weekStart, block.dayOfWeek);
    const isPast = isBeforeNow(blockDate, block.endTime);
    const isoDate = toIsoDate(blockDate);

    return {
      id: `availability-${block.id}`,
      title: "Libre",
      start: `${isoDate}T${block.startTime}`,
      end: `${isoDate}T${block.endTime}`,
      classNames: [isPast ? "fc-block-available-past" : "fc-block-available-current"],
      extendedProps: {
        kind: "available",
        isPast,
        timeRangeLabel: `${block.startTime} - ${block.endTime}`,
      },
    };
  });
}

/** Convierte las sesiones reservadas en eventos de FullCalendar. */
export function mapBookedSessionsToEvents(sessions: BookedSessionResponse[]): EventInput[] {
  return sessions.map((session) => {
    const sessionDate = new Date(session.date);
    const isPast = isBeforeNow(sessionDate, session.endTime);

    return {
      id: `booked-${session.id}`,
      title: session.subjectName,
      start: `${session.date}T${session.startTime}`,
      end: `${session.date}T${session.endTime}`,
      classNames: [isPast ? "fc-block-booked-past" : "fc-block-booked-current"],
      extendedProps: {
        kind: "booked",
        isPast,
        studentName: session.studentName,
        timeRangeLabel: `${session.startTime} - ${session.endTime}`,
      },
    };
  });
}

/**
 * Background event que sombrea desde la medianoche de hoy hasta el instante
 * actual, con la línea de "ahora" dibujada como borde inferior (mismo
 * patrón que useAvailabilityDraft/BookingCalendar, vía la clase compartida
 * "fc-unavailable-now" de calendarBaseSx). Si "ahora" no cae dentro de la
 * semana visible, no se genera nada.
 */
export function buildPastTimeShadingEvent(weekStart: Date): EventInput | null {
  const now = new Date();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  if (now.getTime() < weekStart.getTime() || now.getTime() >= weekEnd.getTime()) {
    return null;
  }

  const todayIso = toIsoDate(now);
  return {
    id: "past-time-shading",
    display: "background",
    start: `${todayIso}T00:00:00`,
    end: now.toISOString(),
    classNames: ["fc-unavailable-now"],
  };
}

/** Cantidad de reservas confirmadas en la semana visible. */
export function countConfirmedBookings(sessions: BookedSessionResponse[]): number {
  return sessions.length;
}

/** Cantidad de bloques de disponibilidad que aún no vencieron. */
export function countFreeBlocks(blocks: AvailabilityBlockResponse[], weekStart: Date): number {
  return blocks.filter((block) => {
    const blockDate = resolveDateForDayOfWeek(weekStart, block.dayOfWeek);
    return !isBeforeNow(blockDate, block.endTime);
  }).length;
}

export interface NextSessionInfo {
  subjectName: string;
  dateLabel: string;
  timeLabel: string;
}

const WEEKDAY_LABELS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildDateLabel(sessionDate: Date, now: Date): string {
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  if (isSameCalendarDay(sessionDate, now)) return "Hoy";
  if (isSameCalendarDay(sessionDate, tomorrow)) return "Mañana";

  const weekday = WEEKDAY_LABELS[sessionDate.getDay()];
  return `${weekday}, ${sessionDate.getDate()}/${sessionDate.getMonth() + 1}`;
}

/** Encuentra la próxima sesión reservada (fecha/hora más cercana en el futuro). */
export function findNextSession(
  sessions: BookedSessionResponse[],
  now: Date = new Date()
): NextSessionInfo | null {
  const upcoming = sessions
    .map((session) => ({
      session,
      datetime: new Date(`${session.date}T${session.startTime}`),
    }))
    .filter(({ datetime }) => datetime.getTime() >= now.getTime())
    .sort((a, b) => a.datetime.getTime() - b.datetime.getTime());

  if (upcoming.length === 0) return null;

  const next = upcoming[0];
  return {
    subjectName: next.session.subjectName,
    dateLabel: buildDateLabel(next.datetime, now),
    timeLabel: next.session.startTime,
  };
}