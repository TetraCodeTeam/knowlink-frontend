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
          gap: 0.75,
          py: 1.5,
          px: 1,
          borderRadius: 2,
          bgcolor: "#EEEDFE",
          textAlign: "center",
        }}
      >
        <CalendarArrowDown size={22} color="#494949" />
        <Typography sx={{ fontSize: 13, color: "text.secondary", px: 2 }}>
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
        gap: 1.25,
        py: 1,
        px: 1.75,
        borderRadius: 2,
        bgcolor: "#eef2ff",
      }}
    >
      <CalendarArrowDown size={24} color="#3A48AD" />
      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 600, textTransform: "capitalize" }}>
          {slot.date}
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          {slot.startTime} - {slot.endTime}
        </Typography>
      </Box>
    </Box>
  );
}
