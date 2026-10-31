import type {
  BookedSessionResponse,
  WeeklyAgendaNextClass,
} from "@/modules/tutor/weekly-schedule/interfaces/responses/weekly-agenda.interface";
import { formatClockTime } from "@/shared/utils/dayTime.utils";

export interface NextSessionInfo {
  subjectName: string;
  dateLabel: string;
  timeLabel: string;
}

const WEEKDAY_LABELS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const FALLBACK_SUBJECT_NAME = "Clase reservada";

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

/**
 * La próxima clase la resuelve el backend (`summary.nextClass`); acá solo se
 * enriquece con la materia que ya viene en las reservas de la semana.
 */
export function buildNextSessionInfo(
  nextClass: WeeklyAgendaNextClass | null,
  sessions: BookedSessionResponse[],
  now: Date = new Date()
): NextSessionInfo | null {
  if (!nextClass) return null;

  const session = sessions.find((item) => item.id === nextClass.bookingId);
  const nextDate = new Date(`${nextClass.date}T${nextClass.startTime}`);

  return {
    subjectName: session?.subjectName ?? FALLBACK_SUBJECT_NAME,
    dateLabel: buildDateLabel(nextDate, now),
    timeLabel: formatClockTime(nextClass.startTime),
  };
}
