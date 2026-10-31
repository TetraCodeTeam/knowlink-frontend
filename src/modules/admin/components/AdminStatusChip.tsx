import { Box } from "@mui/material";
import type { AdminStatusTone } from "@/modules/admin/constants/admin-status-meta";
import {
  STATUS_CHIP_COLORS,
  statusChipBaseSx,
  statusChipDotSx,
} from "@/modules/admin/styles/admin-list.styles";

interface AdminStatusChipProps {
  label: string;
  tone: AdminStatusTone;
}

export default function AdminStatusChip({ label, tone }: AdminStatusChipProps) {
  const colors = STATUS_CHIP_COLORS[tone];

  return (
    <Box
      component="span"
      sx={{ ...statusChipBaseSx, backgroundColor: colors.bg, color: colors.fg }}
    >
      <Box component="span" sx={statusChipDotSx} aria-hidden="true" />
      {label}
    </Box>
  );
}
