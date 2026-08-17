import { Box, Typography } from "@mui/material";
import { Info } from "lucide-react";
import { BOOKING_CALENDAR_LEGEND } from "@/modules/student/booking/constants/bookingLegendConstants";
import InfoTooltip from "@/modules/student/booking/components/InfoTooltip";

export default function BookingCalendarLegend() {
  return (
    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      {BOOKING_CALENDAR_LEGEND.map((item) => (
        <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "4px",
              bgcolor: item.color,
              border: item.color === "#f7f7fb" ? "1px solid #e2e2ec" : "none",
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {item.label}
          </Typography>
          {item.description && (
            <InfoTooltip message={item.description}>
              <Box component="span" sx={{ display: "inline-flex", cursor: "help" }}>
                <Info size={14} color="#8a8aa3" />
              </Box>
            </InfoTooltip>
          )}
        </Box>
      ))}
    </Box>
  );
}
