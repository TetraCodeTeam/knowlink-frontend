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
        variant="subtitle1"
        sx={{
          color: emphasized ? "text.primary" : "text.secondary",
          fontWeight: emphasized ? 700 : 400,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ color: valueColor, fontWeight: emphasized ? 700 : 500 }}
      >
        {typeof value === "number" ? formatter.format(value) : value ?? "-"}
      </Typography>
    </Box>
  );
}
