import { Box, Typography } from "@mui/material";
import { ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";
import type { QueueSummary } from "@/modules/admin/home/interfaces/responses/queue-summary.response";
import { formatSignedPercent } from "@/modules/admin/home/utils/format-metrics";
import {
  kpiDeltaSx,
  kpiDividerSx,
  kpiLabelSx,
  kpiPairSx,
  kpiSuffixSx,
  kpiSx,
  kpiValueRowSx,
  kpiValueSx,
} from "@/modules/admin/home/styles/admin-home.styles";

function getDeltaColor(deltaPct: number): string {
  if (deltaPct > 0) {
    return ADMIN_TOKENS.emerald600;
  }

  if (deltaPct < 0) {
    return ADMIN_TOKENS.rose700;
  }

  return ADMIN_TOKENS.slate500;
}

interface QueueKpiPairProps {
  summary: QueueSummary;
}

export default function QueueKpiPair({ summary }: QueueKpiPairProps) {
  const deltaText =
    summary.resolvedDeltaPct === null ? null : formatSignedPercent(summary.resolvedDeltaPct);
  const deltaColor =
    summary.resolvedDeltaPct === null ? undefined : getDeltaColor(summary.resolvedDeltaPct);

  return (
    <Box sx={kpiPairSx}>
      <Box sx={kpiSx}>
        <Typography sx={kpiLabelSx}>Resueltas esta semana</Typography>
        <Box sx={kpiValueRowSx}>
          <Typography sx={kpiValueSx}>{summary.resolvedThisWeek}</Typography>
          {deltaText ? (
            <Typography sx={{ ...kpiDeltaSx, color: deltaColor }}>{deltaText}</Typography>
          ) : null}
        </Box>
      </Box>

      <Box aria-hidden sx={kpiDividerSx} />

      <Box sx={kpiSx}>
        <Typography sx={kpiLabelSx}>Nuevas esta semana</Typography>
        <Box sx={kpiValueRowSx}>
          <Typography sx={kpiValueSx}>{summary.newThisWeek}</Typography>
          <Typography sx={kpiSuffixSx}>pendientes</Typography>
        </Box>
      </Box>
    </Box>
  );
}
