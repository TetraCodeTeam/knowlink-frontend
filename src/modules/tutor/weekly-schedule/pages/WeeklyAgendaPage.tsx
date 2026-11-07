import { Box, Stack, Typography } from "@mui/material";

import { useWeeklyAgenda } from "@/modules/tutor/weekly-schedule/hooks/useWeeklyAgenda";
import { AgendaSummaryCards } from "@/modules/tutor/weekly-schedule/components/AgendaSummaryCards";
import { WeeklyAgendaCalendar } from "@/modules/tutor/weekly-schedule/components/WeeklyAgendaCalendar";
import { buildNextSessionInfo } from "@/modules/tutor/weekly-schedule/utils/weeklyAgendaNextSession.utils";

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

  const { confirmedBookingsCount, freeBlocksCount, nextClass } = data.summary;
  const nextSession = buildNextSessionInfo(nextClass, data.bookedSessions);

  return (
    <Stack
      spacing={2}
      sx={{ p: { xs: 1.5, md: 2.5 }, pr: { xs: 1.5, md: 4 }, pl: { xs: 1.5, md: 4 } }}
    >
      <Box>
        <AgendaSummaryCards
          confirmedBookings={confirmedBookingsCount}
          freeBlocks={freeBlocksCount}
          nextSession={nextSession}
        />
      </Box>

      <WeeklyAgendaCalendar
        weekStart={weekStart}
        availabilityBlocks={data.availabilityBlocks}
        bookedSessions={data.bookedSessions}
        onPreviousWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
      />
    </Stack>
  );
}
