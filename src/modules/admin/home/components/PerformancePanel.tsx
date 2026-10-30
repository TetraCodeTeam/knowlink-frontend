import { Box, CircularProgress, Typography } from "@mui/material";
import MetricTile from "@/modules/admin/home/components/MetricTile";
import RangeToggle from "@/modules/admin/home/components/RangeToggle";
import VolumeDistributionBar from "@/modules/admin/home/components/VolumeDistributionBar";
import { ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";
import { getUnresolvedStatus } from "@/modules/admin/home/constants/performance-status.constants";
import type { PerformanceSummary } from "@/modules/admin/home/interfaces/responses/performance-summary.response";
import type { DashboardRange } from "@/modules/admin/types/dashboard-range.type";
import {
  buildResolutionDeltaCopy,
  type ResolutionDeltaTone,
} from "@/modules/admin/home/utils/performance-delta";
import {
  formatPercentValue,
  formatResolutionHours,
} from "@/modules/admin/home/utils/format-metrics";
import {
  metricsGridSx,
  panelControlsSx,
  panelHeaderSx,
  panelSx,
  panelSubtitleSx,
  panelTitleSx,
} from "@/modules/admin/home/styles/admin-home.styles";

const DELTA_TONE_COLOR: Record<ResolutionDeltaTone, string> = {
  positive: ADMIN_TOKENS.emerald600,
  negative: ADMIN_TOKENS.rose700,
  neutral: ADMIN_TOKENS.slate500,
};

interface PerformancePanelProps {
  performance: PerformanceSummary;
  range: DashboardRange;
  onRangeChange: (range: DashboardRange) => void;
  isFetching?: boolean;
}

export default function PerformancePanel({
  performance,
  range,
  onRangeChange,
  isFetching = false,
}: PerformancePanelProps) {
  const delta = buildResolutionDeltaCopy(performance.avgResolutionDeltaPct);
  const status = getUnresolvedStatus(performance.unresolvedLevel);

  return (
    <Box component="section" aria-labelledby="performance-panel-title" sx={panelSx}>
      <Box sx={panelHeaderSx}>
        <Box sx={{ minWidth: 0 }}>
          <Typography id="performance-panel-title" component="h2" sx={panelTitleSx}>
            Rendimiento y Salud del Servicio
          </Typography>
          <Typography sx={panelSubtitleSx}>Eficiencia operativa y tiempos de respuesta</Typography>
        </Box>

        <Box sx={panelControlsSx}>
          {isFetching ? <CircularProgress size={16} aria-label="Actualizando rendimiento" /> : null}
          <RangeToggle value={range} onChange={onRangeChange} />
        </Box>
      </Box>

      <Box sx={metricsGridSx}>
        <MetricTile
          label="Tiempo promedio (TTR)"
          value={formatResolutionHours(performance.avgResolutionHours)}
          hint={delta ? { text: delta.text, color: DELTA_TONE_COLOR[delta.tone] } : null}
        />
        <MetricTile
          label="Tareas sin resolver"
          value={formatPercentValue(performance.unresolvedPct)}
          hint={{ text: status.label, color: status.color }}
        />
      </Box>

      <VolumeDistributionBar split={performance.volumeSplit} />
    </Box>
  );
}
