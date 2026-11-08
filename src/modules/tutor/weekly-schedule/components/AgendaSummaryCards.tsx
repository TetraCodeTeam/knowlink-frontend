import { Box, Chip, Stack, Typography } from "@mui/material";
import { CircleCheckBig, Clock, CalendarClock } from "lucide-react";

import {
  agendaSummaryCardSx,
  agendaStatChipSx,
  agendaStatIconBoxSx,
} from "@/modules/tutor/weekly-schedule/styles/weeklyAgendaSummary.styles";
import { AGENDA_STAT_COLOR } from "@/modules/tutor/weekly-schedule/constants/statics.constants";
import type { NextSessionInfo } from "@/modules/tutor/weekly-schedule/utils/weeklyAgendaNextSession.utils";

interface AgendaSummaryCardsProps {
  confirmedBookings: number;
  freeBlocks: number;
  nextSession: NextSessionInfo | null;
}

function StatChip({
  label,
  dotColor,
  chipBg,
}: {
  label: string;
  dotColor: string;
  chipBg: string;
}) {
  return (
    <Chip
      size="small"
      sx={agendaStatChipSx(chipBg)}
      icon={
        <Box
          component="span"
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: dotColor,
            ml: "8px !important",
          }}
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
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 1.5, sm: 2 }}
      sx={{ bgcolor: "#ffffff4d", borderRadius: 3, px: 1.5, py: 1.25 }}
    >
      <Box sx={agendaSummaryCardSx}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <StatChip
            label="Esta semana"
            dotColor={bookingsColor.dot}
            chipBg={bookingsColor.chipBg}
          />
          <Box sx={agendaStatIconBoxSx(bookingsColor.iconBg)}>
            <CircleCheckBig size={18} color={bookingsColor.iconColor} />
          </Box>
        </Stack>
        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography fontSize={26} fontWeight={700} lineHeight={1.1}>
            {confirmedBookings}
          </Typography>
          <Typography fontSize={15} color="text.secondary">
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
            <Clock size={18} color={availabilityColor.iconColor} />
          </Box>
        </Stack>
        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography fontSize={26} fontWeight={700} lineHeight={1.1}>
            {freeBlocks}
          </Typography>
          <Box>
            <Typography fontSize={15} color="text.secondary">
              {freeBlocks === 1 ? "Bloque libre" : "Bloques libres"}
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              de 1 hora
            </Typography>
          </Box>
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
            <CalendarClock size={18} color={nextSessionColor.iconColor} />
          </Box>
        </Stack>
        {nextSession ? (
          <Box>
            <Typography fontSize={16} fontWeight={700} lineHeight={1.3}>
              {nextSession.subjectName}
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              {nextSession.dateLabel} • {nextSession.timeLabel}
            </Typography>
          </Box>
        ) : (
          <Typography fontSize={15} color="text.secondary">
            Aún no hay clases agendadas
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
