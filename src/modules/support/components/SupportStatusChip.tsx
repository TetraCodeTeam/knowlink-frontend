import { Box } from "@mui/material";
import type { StatusTone } from "@/modules/support/styles/supportShared.styles";
import { getStatusChipSx, statusDotSx } from "@/modules/support/styles/supportStatusChip.styles";

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
