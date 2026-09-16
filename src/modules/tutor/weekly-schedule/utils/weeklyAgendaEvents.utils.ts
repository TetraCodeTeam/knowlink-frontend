import type { EventInput } from "@fullcalendar/core";

import type {
  AvailabilityBlockResponse,
  BookedSessionResponse,
} from "@/modules/tutor/weekly-schedule/interfaces/responses/weekly-agenda.interface";
import {
  isBeforeNowAtTime,
  resolveDateForDayOfWeek,
  toDateStr,
} from "@/shared/utils/calendarDateUtils";

export function mapAvailabilityBlocksToEvents(
  blocks: AvailabilityBlockResponse[],
  weekStart: Date
): EventInput[] {
  return blocks.map((block) => {
    const blockDate = resolveDateForDayOfWeek(weekStart, block.dayOfWeek);
    const isPast = isBeforeNowAtTime(blockDate, block.endTime);
    const isoDate = toDateStr(blockDate);

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

export function mapBookedSessionsToEvents(sessions: BookedSessionResponse[]): EventInput[] {
  return sessions.map((session) => {
    const sessionDate = new Date(session.date);
    const isPast = isBeforeNowAtTime(sessionDate, session.endTime);

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

export function buildPastTimeShadingEvent(weekStart: Date): EventInput | null {
  const now = new Date();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  if (now.getTime() < weekStart.getTime() || now.getTime() >= weekEnd.getTime()) {
    return null;
  }

  const todayIso = toDateStr(now);
  return {
    id: "past-time-shading",
    display: "background",
    start: `${todayIso}T00:00:00`,
    end: now.toISOString(),
    classNames: ["fc-unavailable-now"],
  };
}