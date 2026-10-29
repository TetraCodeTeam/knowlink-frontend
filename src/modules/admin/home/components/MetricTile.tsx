import { Box, Typography } from "@mui/material";
import {
  metricTileHintSx,
  metricTileLabelSx,
  metricTileSx,
  metricTileValueSx,
} from "@/modules/admin/home/styles/admin-home.styles";

export interface MetricTileHint {
  text: string;
  color: string;
}

interface MetricTileProps {
  label: string;
  value: string;
  hint?: MetricTileHint | null;
}

export default function MetricTile({ label, value, hint = null }: MetricTileProps) {
  return (
    <Box sx={metricTileSx}>
      <Typography sx={metricTileLabelSx}>{label}</Typography>
      <Typography sx={metricTileValueSx}>{value}</Typography>
      {hint ? (
        <Typography sx={{ ...metricTileHintSx, color: hint.color }}>{hint.text}</Typography>
      ) : null}
    </Box>
  );
}
