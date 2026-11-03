import { Box, Typography } from "@mui/material";
import { AVAILABILITY_LEGEND } from "@/modules/tutor/availability/constants/availabilityLegend.constants";

export default function AvailabilityLegend() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
        mb: 1.5,
      }}
    >
      {AVAILABILITY_LEGEND.map((item) => (
        <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 11,
              height: 11,
              borderRadius: "4px",
              bgcolor: item.color,
              border: item.color === "#f7f7fb" ? "1px solid #e2e2ec" : "none",
            }}
          />
          <Typography fontSize={13} color="text.secondary">
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
