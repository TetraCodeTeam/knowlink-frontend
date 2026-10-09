import { Box, Typography } from "@mui/material";
import type { DayHeaderContentArg } from "@fullcalendar/core";
import { DAY_LABELS } from "@/modules/tutor/availability/constants/availability.constants";

export default function AvailabilityDayHeader({ date }: Pick<DayHeaderContentArg, "date">) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 0.5 }}>
      <Typography variant="body1" fontWeight={600}>
        {DAY_LABELS[date.getDay()]}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {date.getDate()}
      </Typography>
    </Box>
  );
}