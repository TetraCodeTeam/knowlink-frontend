import { Box, Stack, Typography } from "@mui/material";

import { AGENDA_LEGEND_ITEMS } from "@/modules/tutor/weekly-schedule/constants/weekly-agenda.constants";
import {
  agendaLegendDotSx,
  agendaToolbarChipSx,
} from "@/modules/tutor/weekly-schedule/styles/weeklyAgendaLegend.styles";

export function AgendaLegend() {
  return (
    <Stack direction="row" spacing={2.5} sx={agendaToolbarChipSx}>
      {AGENDA_LEGEND_ITEMS.map((item) => (
        <Stack key={item.label} direction="row" alignItems="center" spacing={0.75}>
          <Box component="span" sx={agendaLegendDotSx(item.color)} />
          <Typography variant="body1" color="text.secondary">
            {item.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}