import { useCallback, useMemo } from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import type {
  DayCellContentArg,
  DayHeaderContentArg,
  EventContentArg,
  EventInput,
} from "@fullcalendar/core";

import type {
  AvailabilityBlockResponse,
  BookedSessionResponse,
} from "@/modules/tutor/weekly-schedule/interfaces/responses/weekly-agenda.interface";
import {
  mapAvailabilityBlocksToEvents,
  mapBookedSessionsToEvents,
  buildPastTimeShadingEvent,
} from "@/modules/tutor/weekly-schedule/utils/weeklyAgendaEvents.utils";
import { WEEKLY_AGENDA_CALENDAR_CONFIG } from "@/modules/tutor/weekly-schedule/WeeklyAgendaCalendar.config";
import { weeklyAgendaCalendarSx } from "@/modules/tutor/weekly-schedule/styles/weeklyAgendaCalendar.styles";
import { AgendaLegend } from "@/modules/tutor/weekly-schedule/components/AgendaLegend";
import { isBeforeToday } from "@/shared/utils/calendarDateUtils";

const MONTH_LABELS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DAY_LABELS = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

function buildWeekRangeLabel(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return `${weekStart.getDate()} - ${weekEnd.getDate()} ${MONTH_LABELS[weekEnd.getMonth()].slice(0, 3)}`;
}

function renderEventContent(arg: EventContentArg) {
  const timeRangeLabel = arg.event.extendedProps.timeRangeLabel as string | undefined;
  return (
    <div className="agenda-event-content">
      {timeRangeLabel && <span className="agenda-event-time">{timeRangeLabel}</span>}
      <span className="agenda-event-title">{arg.event.title}</span>
    </div>
  );
}

interface WeeklyAgendaCalendarProps {
  weekStart: Date;
  availabilityBlocks: AvailabilityBlockResponse[];
  bookedSessions: BookedSessionResponse[];
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

export function WeeklyAgendaCalendar({
  weekStart,
  availabilityBlocks,
  bookedSessions,
  onPreviousWeek,
  onNextWeek,
}: WeeklyAgendaCalendarProps) {
  const events = useMemo<EventInput[]>(() => {
    const shading = buildPastTimeShadingEvent(weekStart);
    return [
      ...mapAvailabilityBlocksToEvents(availabilityBlocks, weekStart),
      ...mapBookedSessionsToEvents(bookedSessions),
      ...(shading ? [shading] : []),
    ];
  }, [availabilityBlocks, bookedSessions, weekStart]);

  const dayHeaderContent = useCallback(
    ({ date, isToday }: DayHeaderContentArg) => (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
        <Typography variant="caption" fontWeight={700} color={isToday ? "#5B6ED9" : "#4A4B5E"}>
          {DAY_LABELS[date.getDay()]}
        </Typography>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
            bgcolor: isToday ? "#5B6ED9" : "transparent",
            color: isToday ? "#fff" : "#1A1A2E",
            boxShadow: isToday ? "0 4px 10px rgba(91, 110, 217, 0.35)" : "none",
          }}
        >
          {date.getDate()}
        </Box>
      </Box>
    ),
    []
  );

  const dayCellClassNames = useCallback(
    (arg: DayCellContentArg) => (isBeforeToday(arg.date) ? ["fc-agenda-past-day"] : []),
    []
  );

  return (
    <Box sx={weeklyAgendaCalendarSx}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
        sx={{ mb: 4 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{
          bgcolor: "#F4F2FF",
          border: "1px solid #c6c5d43b",
          borderRadius: 3,
          px: 2,
          py: 1,
        }}>
          <Typography variant="h5" fontWeight={500}>
            {MONTH_LABELS[weekStart.getMonth()]} {weekStart.getFullYear()}
          </Typography>
          <IconButton size="small" onClick={onPreviousWeek} aria-label="Semana anterior">
            <ChevronLeft size={20} />
          </IconButton>
          <Typography variant="body1" color="text.secondary">
            {buildWeekRangeLabel(weekStart)}
          </Typography>
          <IconButton size="small" onClick={onNextWeek} aria-label="Semana siguiente">
            <ChevronRight size={20} />
          </IconButton>
        </Stack>

        <AgendaLegend />
      </Stack>

      <FullCalendar
        key={weekStart.toISOString()}
        {...WEEKLY_AGENDA_CALENDAR_CONFIG}
        initialDate={weekStart}
        events={events}
        eventContent={renderEventContent}
        dayHeaderContent={dayHeaderContent}
        dayCellClassNames={dayCellClassNames}
      />
    </Box>
  );
}