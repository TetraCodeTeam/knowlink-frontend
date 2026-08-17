import { Box, Typography } from "@mui/material";
import type { PricingRowProps } from "@/modules/student/booking/interfaces/bookingComponentPropsType";

export default function BookingPricingRow({
  label,
  value,
  formatter,
  emphasized = false,
}: PricingRowProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography
        variant="h6"
        sx={{
          color: emphasized ? "text.primary" : "text.secondary",
          fontWeight: emphasized ? 700 : 400,
        }}
      >
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: emphasized ? 700 : 500 }}>
        {value !== undefined ? formatter.format(value) : "-"}
      </Typography>
    </Box>
  );
}
