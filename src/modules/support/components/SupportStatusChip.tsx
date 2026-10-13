import { Box } from "@mui/material";
import {
  getStatusChipSx,
  statusDotSx,
  type StatusTone,
} from "@/modules/support/styles/support.styles";

interface SupportStatusChipProps {
  label: string;
  tone: StatusTone;
}

export function SupportStatusChip({ label, tone }: SupportStatusChipProps) {
  return (
    <Box component="span" sx={getStatusChipSx(tone)}>
      <Box component="span" sx={statusDotSx} />
      {label}
    </Box>
  );
}
