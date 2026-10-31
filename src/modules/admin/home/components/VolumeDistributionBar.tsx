import { Box, Typography } from "@mui/material";
import { ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";
import type { VolumeSplit } from "@/modules/admin/home/interfaces/responses/volume-split.response";
import { formatPercentValue } from "@/modules/admin/home/utils/format-metrics";
import { normalizeVolumeSplit } from "@/modules/admin/home/utils/volume-split";
import {
  volumeBarSegmentSx,
  volumeBarSx,
  volumeBlockSx,
  volumeHeaderSx,
  volumeLegendDotSx,
  volumeLegendItemSx,
  volumeLegendLabelSx,
  volumeLegendSx,
  volumeLegendValueSx,
  volumeTitleSx,
  volumeTotalSx,
} from "@/modules/admin/home/styles/admin-home.styles";

const CLAIMS_COLOR = ADMIN_TOKENS.indigo600;
const REPORTS_COLOR = ADMIN_TOKENS.rose500;

interface VolumeDistributionBarProps {
  split: VolumeSplit;
}

export default function VolumeDistributionBar({ split }: VolumeDistributionBarProps) {
  const normalized = normalizeVolumeSplit(split);
  const claimsLabel = formatPercentValue(normalized.claimsPct);
  const reportsLabel = formatPercentValue(normalized.reportsPct);

  return (
    <Box sx={volumeBlockSx}>
      <Box sx={volumeHeaderSx}>
        <Typography sx={volumeTitleSx}>Distribución de volumen operativo</Typography>
        <Typography sx={volumeTotalSx}>Total: 100%</Typography>
      </Box>

      <Box
        role="img"
        aria-label={`Distribución de volumen operativo: reclamos de sesiones ${claimsLabel}, denuncias de material ${reportsLabel}`}
        sx={volumeBarSx}
      >
        <Box
          data-testid="volume-claims"
          sx={{
            ...volumeBarSegmentSx,
            width: `${normalized.claimsPct}%`,
            backgroundColor: CLAIMS_COLOR,
          }}
        />
        <Box
          data-testid="volume-reports"
          sx={{
            ...volumeBarSegmentSx,
            width: `${normalized.reportsPct}%`,
            backgroundColor: REPORTS_COLOR,
          }}
        />
      </Box>

      <Box sx={volumeLegendSx}>
        <LegendItem color={CLAIMS_COLOR} label="Reclamos de sesiones" value={claimsLabel} />
        <LegendItem color={REPORTS_COLOR} label="Denuncias de material" value={reportsLabel} />
      </Box>
    </Box>
  );
}

interface LegendItemProps {
  color: string;
  label: string;
  value: string;
}

function LegendItem({ color, label, value }: LegendItemProps) {
  return (
    <Box sx={volumeLegendItemSx}>
      <Box aria-hidden sx={{ ...volumeLegendDotSx, backgroundColor: color }} />
      <Typography sx={volumeLegendLabelSx}>{label}</Typography>
      <Typography sx={volumeLegendValueSx}>{value}</Typography>
    </Box>
  );
}
