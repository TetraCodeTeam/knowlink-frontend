import { Chip } from "@mui/material";
import type { FundsStatusChipProps } from "./FundsStatusChip.types";
import { fundsStatusLabel, fundsStatusColor } from "@/modules/payments/constants/fundsStatusLabel";

export default function FundsStatusChip({ fundsStatus }: FundsStatusChipProps) {
  return (
    <Chip
      label={fundsStatusLabel[fundsStatus]}
      color={fundsStatusColor[fundsStatus]}
      size="small"
      variant="outlined"
    />
  );
}