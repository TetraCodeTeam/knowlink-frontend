import { Box, Chip, Stack, Typography } from "@mui/material";
import { CircleCheckBig, Clock,CalendarClock } from "lucide-react";

import {
  agendaSummaryCardSx,
  agendaStatChipSx,
  agendaStatIconBoxSx,
} from "@/modules/tutor/weekly-schedule/styles/WeeklyAgenda.styles";
import { AGENDA_STAT_COLOR } from "@/modules/tutor/weekly-schedule/constants/statics.constants";
import type { NextSessionInfo } from "@/modules/tutor/weekly-schedule/utils/weekly-agenda.utils";

interface AgendaSummaryCardsProps {
  confirmedBookings: number;
  freeBlocks: number;
  nextSession: NextSessionInfo | null;
}

function StatChip({ label, dotColor, chipBg }: { label: string; dotColor: string; chipBg: string }) {
  return (
    <Chip
      size="small"
      sx={agendaStatChipSx(chipBg)}
      icon={
        <Box
          component="span"
          sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: dotColor, ml: "8px !important" }}
        />
      }
      label={label}
    />
  );
}

export function AgendaSummaryCards({
  confirmedBookings,
  freeBlocks,
  nextSession,
}: AgendaSummaryCardsProps) {
  const bookingsColor = AGENDA_STAT_COLOR.confirmedBookings;
  const availabilityColor = AGENDA_STAT_COLOR.availability;
  const nextSessionColor = AGENDA_STAT_COLOR.nextSession;

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
      <Box sx={agendaSummaryCardSx}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <StatChip label="Esta semana" dotColor={bookingsColor.dot} chipBg={bookingsColor.chipBg} />
          <Box sx={agendaStatIconBoxSx(bookingsColor.iconBg)}>
            <CircleCheckBig size={23} color={bookingsColor.iconColor} />
          </Box>
        </Stack>
        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography variant="h4" fontWeight={700}>
            {confirmedBookings}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Reservas confirmadas
          </Typography>
        </Stack>
      </Box>

      <Box sx={agendaSummaryCardSx}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <StatChip
            label="Disponibilidad"
            dotColor={availabilityColor.dot}
            chipBg={availabilityColor.chipBg}
          />
          <Box sx={agendaStatIconBoxSx(availabilityColor.iconBg)}>
            <Clock size={23} color={availabilityColor.iconColor} />
          </Box>
        </Stack>
        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography variant="h4" fontWeight={700}>
            {freeBlocks}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bloques libres
          </Typography>
        </Stack>
      </Box>

      <Box sx={agendaSummaryCardSx}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <StatChip
            label="Próxima clase"
            dotColor={nextSessionColor.dot}
            chipBg={nextSessionColor.chipBg}
          />
          <Box sx={agendaStatIconBoxSx(nextSessionColor.iconBg)}>
            <CalendarClock size={23} color={nextSessionColor.iconColor} />
          </Box>
        </Stack>
        {nextSession ? (
          <Box>
            <Typography variant="body1" fontWeight={700} lineHeight={1.3}>
              {nextSession.subjectName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {nextSession.dateLabel} • {nextSession.timeLabel}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Sin próximas clases
          </Typography>
        )}
      </Box>
    </Stack>
  );
}