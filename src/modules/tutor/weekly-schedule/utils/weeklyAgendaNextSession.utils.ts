import type { BookedSessionResponse } from "@/modules/tutor/weekly-schedule/interfaces/responses/weekly-agenda.interface";

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