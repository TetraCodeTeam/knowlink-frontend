import { Box, Typography } from "@mui/material";
import type { DayHeaderContentArg } from "@fullcalendar/core";
import { DAY_LABELS } from "@/modules/tutor/availability/constants/availability.constants";

export default function AvailabilityDayHeader({ date }: Pick<DayHeaderContentArg, "date">) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 0.25 }}>
      <Typography fontSize={13} fontWeight={600}>
        {DAY_LABELS[date.getDay()]}
      </Typography>
      <Typography fontSize={13} color="text.secondary">
        {date.getDate()}
      </Typography>
    </Box>
  );
}
