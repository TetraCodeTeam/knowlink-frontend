import { Box, Typography } from "@mui/material";
import { CalendarArrowDown } from "lucide-react";
import type { BookingSlotSelectionSummaryProps } from "@/modules/student/booking/interfaces/bookingComponentPropsType";

export default function BookingSlotSelectionSummary({ slot }: BookingSlotSelectionSummaryProps) {
  if (!slot) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          py: 4,
          px: 2,
          borderRadius: 2,
          bgcolor: "#EEEDFE",
          textAlign: "center",
        }}
      >
        <CalendarArrowDown size={30} color="#494949" />
        <Typography variant="body1" sx={{ color: "text.secondary", px: 5 }}>
          Selecciona un horario en el calendario para continuar
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        py: 1.5,
        px: 2,
        borderRadius: 2,
        bgcolor: "#eef2ff",
      }}
    >
      <CalendarArrowDown size={30} color="#3A48AD" />
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, textTransform: "capitalize" }}>
          {slot.date}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {slot.startTime} - {slot.endTime}
        </Typography>
      </Box>
    </Box>
  );
}
