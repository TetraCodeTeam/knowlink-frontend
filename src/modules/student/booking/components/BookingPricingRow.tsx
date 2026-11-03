import { Box, Typography } from "@mui/material";
import type { PricingRowProps } from "@/modules/student/booking/interfaces/bookingComponentPropsType";

export default function BookingPricingRow({
  label,
  value,
  formatter,
  emphasized = false,
  valueColor,
}: PricingRowProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography
        sx={{
          fontSize: 14,
          color: emphasized ? "text.primary" : "text.secondary",
          fontWeight: emphasized ? 700 : 400,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontSize: 14, color: valueColor, fontWeight: emphasized ? 700 : 500 }}>
        {typeof value === "number" ? formatter.format(value) : (value ?? "-")}
      </Typography>
    </Box>
  );
}
