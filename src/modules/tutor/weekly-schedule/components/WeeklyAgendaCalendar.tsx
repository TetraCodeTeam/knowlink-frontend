import { useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import type { DayCellContentArg, EventContentArg, EventInput } from "@fullcalendar/core";

import type {
  AvailabilityBlockResponse,
  BookedSessionResponse,
} from "@/modules/tutor/weekly-schedule/interfaces/responses/weekly-agenda.interface";
import {
  mapAvailabilityBlocksToEvents,
  mapBookedSessionsToEvents,
  buildPastTimeShadingEvent,
} from "@/modules/tutor/weekly-schedule/utils/weekly-agenda.utils";
import { WEEKLY_AGENDA_CALENDAR_CONFIG } from "@/modules/tutor/weekly-schedule/WeeklyAgendaCalendar.config";
import { weeklyAgendaCalendarSx } from "@/modules/tutor/weekly-schedule/styles/WeeklyAgenda.styles";
import { isBeforeToday } from "@/shared/utils/calendarDateUtils";

interface WeeklyAgendaCalendarProps {
  weekStart: Date;
  availabilityBlocks: AvailabilityBlockResponse[];
  bookedSessions: BookedSessionResponse[];
}

/**
 * Contenido custom del evento: hora arriba, título/materia abajo. Se usa
 * eventContent en vez de un "title" con \n porque FullCalendar no
 * respeta saltos de línea dentro del title plano.
 */
function renderEventContent(arg: EventContentArg) {
  const timeRangeLabel = arg.event.extendedProps.timeRangeLabel as string | undefined;

  return (
    <div className="agenda-event-content">
      {timeRangeLabel && <span className="agenda-event-time">{timeRangeLabel}</span>}
      <span className="agenda-event-title">{arg.event.title}</span>
    </div>
  );
}

export function WeeklyAgendaCalendar({
  weekStart,
  availabilityBlocks,
  bookedSessions,
}: WeeklyAgendaCalendarProps) {
  const events = useMemo<EventInput[]>(() => {
    const shading = buildPastTimeShadingEvent(weekStart);
    return [
      ...mapAvailabilityBlocksToEvents(availabilityBlocks, weekStart),
      ...mapBookedSessionsToEvents(bookedSessions),
      ...(shading ? [shading] : []),
    ];
  }, [availabilityBlocks, bookedSessions, weekStart]);

  const dayCellClassNames = useCallback(
    (arg: DayCellContentArg) => (isBeforeToday(arg.date) ? ["fc-past-day"] : []),
    []
  );

  return (
    <Box sx={weeklyAgendaCalendarSx}>
      <FullCalendar
        {...WEEKLY_AGENDA_CALENDAR_CONFIG}
        initialDate={weekStart}
        events={events}
        eventContent={renderEventContent}
        dayCellClassNames={dayCellClassNames}
      />
    </Box>
  );
}