import { IconButton, Stack, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useWeeklyAgenda } from "@/modules/tutor/weekly-schedule/hooks/useWeeklyAgenda";
import { AgendaSummaryCards } from "@/modules/tutor/weekly-schedule/components/AgendaSummaryCards";
import { AgendaLegend } from "@/modules/tutor/weekly-schedule/components/AgendaLegend";
import { WeeklyAgendaCalendar } from "@/modules/tutor/weekly-schedule/components/WeeklyAgendaCalendar";
import {
  countConfirmedBookings,
  countFreeBlocks,
  findNextSession,
} from "@/modules/tutor/weekly-schedule/utils/weekly-agenda.utils";
import { agendaToolbarChipSx } from "@/modules/tutor/weekly-schedule/styles/WeeklyAgenda.styles";

const MONTH_LABELS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function buildWeekRangeLabel(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return `${weekStart.getDate()} - ${weekEnd.getDate()} ${MONTH_LABELS[weekEnd.getMonth()].slice(0, 3)}`;
}

export function WeeklyAgendaPage() {
  const { data, isLoading, isError, weekStart, goToPreviousWeek, goToNextWeek } = useWeeklyAgenda();

  if (isLoading) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ p: 4 }}>
        Cargando agenda...
      </Typography>
    );
  }

  if (isError || !data) {
    return (
      <Typography variant="body2" color="error" sx={{ p: 4 }}>
        No pudimos cargar tu agenda. Intentá de nuevo más tarde.
      </Typography>
    );
  }

  const confirmedBookings = countConfirmedBookings(data.bookedSessions);
  const freeBlocks = countFreeBlocks(data.availabilityBlocks, weekStart);
  const nextSession = findNextSession(data.bookedSessions);

  return (
    <Stack spacing={3} sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="overline" color="text.secondary">
        Mi agenda → semana
      </Typography>

      <AgendaSummaryCards
        confirmedBookings={confirmedBookings}
        freeBlocks={freeBlocks}
        nextSession={nextSession}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={agendaToolbarChipSx}>
          <Typography variant="h6" fontWeight={700}>
            {MONTH_LABELS[weekStart.getMonth()]} {weekStart.getFullYear()}
          </Typography>
          <IconButton size="small" onClick={goToPreviousWeek} aria-label="Semana anterior">
            <ChevronLeft size={18} />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {buildWeekRangeLabel(weekStart)}
          </Typography>
          <IconButton size="small" onClick={goToNextWeek} aria-label="Semana siguiente">
            <ChevronRight size={18} />
          </IconButton>
        </Stack>

        <AgendaLegend />
      </Stack>

      <WeeklyAgendaCalendar
        weekStart={weekStart}
        availabilityBlocks={data.availabilityBlocks}
        bookedSessions={data.bookedSessions}
      />
    </Stack>
  );
}