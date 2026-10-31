import { alpha } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import { ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";

export const pageSx = {
  p: { xs: 2, md: "40px" },
  display: "flex",
  flexDirection: "column",
  gap: "30px",
  minWidth: 0,
} satisfies SxProps<Theme>;

export const topBarSx = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "flex-start", sm: "center" },
  justifyContent: "space-between",
  gap: 2,
  p: { xs: 2.5, md: 3.5 },
  borderRadius: "12px",
  backgroundColor: alpha(ADMIN_TOKENS.surface, 0.8),
  backdropFilter: "blur(12px)",
  borderBottom: `1px solid ${ADMIN_TOKENS.celeste}`,
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
} satisfies SxProps<Theme>;

export const topBarTitleSx = {
  fontSize: { xs: 30, md: 40 },
  fontWeight: 700,
  letterSpacing: "-1px",
  lineHeight: 1.1,
  color: ADMIN_TOKENS.ink,
} satisfies SxProps<Theme>;

export const topBarSubtitleSx = {
  fontSize: { xs: 15, md: 20 },
  fontWeight: 500,
  color: ADMIN_TOKENS.slate500,
  mt: 0.5,
} satisfies SxProps<Theme>;

export const dateChipSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 1,
  px: 2,
  py: 0.75,
  borderRadius: "999px",
  backgroundColor: alpha(ADMIN_TOKENS.slate50, 0.8),
  border: `1px solid ${alpha(ADMIN_TOKENS.slate200, 0.6)}`,
  color: ADMIN_TOKENS.slate600,
  flexShrink: 0,
} satisfies SxProps<Theme>;

export const dateChipTextSx = {
  fontSize: 14,
  fontWeight: 500,
  color: ADMIN_TOKENS.slate600,
  whiteSpace: "nowrap",
} satisfies SxProps<Theme>;

export const cardsGridSx = {
  display: "grid",
  gap: "30px",
  gridTemplateColumns: "minmax(0, 1fr)",
  "@media (min-width:1100px)": {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
} satisfies SxProps<Theme>;

export const queueCardSx = {
  display: "flex",
  flexDirection: "column",
  backgroundColor: ADMIN_TOKENS.surface,
  borderRadius: "16px",
  border: `1px solid ${ADMIN_TOKENS.slate200}`,
  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
  overflow: "hidden",
  minWidth: 0,
} satisfies SxProps<Theme>;

export const queueCardStripeSx = {
  height: "6px",
  flexShrink: 0,
} satisfies SxProps<Theme>;

export const queueCardBodySx = {
  display: "flex",
  flexDirection: "column",
  gap: 2.5,
  p: { xs: 2.5, md: 3 },
  flex: 1,
  minWidth: 0,
} satisfies SxProps<Theme>;

export const queueCardHeaderSx = {
  display: "flex",
  alignItems: "center",
  gap: 2,
} satisfies SxProps<Theme>;

export const queueIconChipSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 48,
  height: 48,
  borderRadius: "12px",
  border: "1px solid",
  flexShrink: 0,
} satisfies SxProps<Theme>;

export const queueCardTitleSx = {
  fontSize: 20,
  fontWeight: 700,
  lineHeight: 1.2,
  color: ADMIN_TOKENS.ink,
} satisfies SxProps<Theme>;

export const queueCardSubtitleSx = {
  fontSize: 14,
  fontWeight: 500,
  color: ADMIN_TOKENS.slate500,
  mt: 0.25,
} satisfies SxProps<Theme>;

export const queuePillSx = {
  display: "inline-block",
  alignSelf: "flex-start",
  px: 1.5,
  py: 1,
  borderRadius: "999px",
  border: "1px solid",
  fontSize: 13,
  lineHeight: 1.5,
} satisfies SxProps<Theme>;

export const kpiPairSx = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
  gap: 2,
  alignItems: "stretch",
} satisfies SxProps<Theme>;

export const kpiSx = {
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
  minWidth: 0,
} satisfies SxProps<Theme>;

export const kpiDividerSx = {
  width: "1px",
  backgroundColor: ADMIN_TOKENS.slate200,
} satisfies SxProps<Theme>;

export const kpiLabelSx = {
  fontSize: 13,
  fontWeight: 500,
  color: ADMIN_TOKENS.slate500,
} satisfies SxProps<Theme>;

export const kpiValueRowSx = {
  display: "flex",
  alignItems: "baseline",
  flexWrap: "wrap",
  gap: 1,
} satisfies SxProps<Theme>;

export const kpiValueSx = {
  fontSize: 30,
  fontWeight: 800,
  lineHeight: 1,
  color: ADMIN_TOKENS.ink,
} satisfies SxProps<Theme>;

export const kpiDeltaSx = {
  fontSize: 13,
  fontWeight: 600,
} satisfies SxProps<Theme>;

export const kpiSuffixSx = {
  fontSize: 12,
  fontWeight: 500,
  color: ADMIN_TOKENS.slate400,
} satisfies SxProps<Theme>;

export const queueCtaSx = {
  borderRadius: "15px",
  py: 1.5,
  mt: "auto",
} satisfies SxProps<Theme>;

export const panelSx = {
  backgroundColor: ADMIN_TOKENS.surface,
  borderRadius: "16px",
  border: `1px solid ${ADMIN_TOKENS.slate200}`,
  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
  p: { xs: 2.5, md: 3 },
  display: "flex",
  flexDirection: "column",
  gap: 2.5,
  minWidth: 0,
} satisfies SxProps<Theme>;

export const panelHeaderSx = {
  display: "flex",
  alignItems: { xs: "flex-start", sm: "center" },
  justifyContent: "space-between",
  flexDirection: { xs: "column", sm: "row" },
  gap: 1.5,
} satisfies SxProps<Theme>;

export const panelTitleSx = {
  fontSize: 20,
  fontWeight: 700,
  lineHeight: 1.2,
  color: ADMIN_TOKENS.ink,
} satisfies SxProps<Theme>;

export const panelSubtitleSx = {
  fontSize: 14,
  fontWeight: 500,
  color: ADMIN_TOKENS.slate500,
  mt: 0.25,
} satisfies SxProps<Theme>;

export const panelControlsSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  flexShrink: 0,
} satisfies SxProps<Theme>;

export const metricsGridSx = {
  display: "grid",
  gap: 2,
  gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
} satisfies SxProps<Theme>;

export const metricTileSx = {
  backgroundColor: ADMIN_TOKENS.slate50,
  borderRadius: "12px",
  p: 2,
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
  minWidth: 0,
} satisfies SxProps<Theme>;

export const metricTileLabelSx = {
  fontSize: 13,
  fontWeight: 500,
  color: ADMIN_TOKENS.slate500,
} satisfies SxProps<Theme>;

export const metricTileValueSx = {
  fontSize: 26,
  fontWeight: 800,
  lineHeight: 1.1,
  color: ADMIN_TOKENS.ink,
} satisfies SxProps<Theme>;

export const metricTileHintSx = {
  fontSize: 13,
  fontWeight: 600,
} satisfies SxProps<Theme>;

export const volumeBlockSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
} satisfies SxProps<Theme>;

export const volumeHeaderSx = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 1,
} satisfies SxProps<Theme>;

export const volumeTitleSx = {
  fontSize: 15,
  fontWeight: 700,
  color: ADMIN_TOKENS.ink,
} satisfies SxProps<Theme>;

export const volumeTotalSx = {
  fontSize: 13,
  fontWeight: 500,
  color: ADMIN_TOKENS.slate500,
} satisfies SxProps<Theme>;

export const volumeBarSx = {
  display: "flex",
  height: "10px",
  borderRadius: "999px",
  overflow: "hidden",
  backgroundColor: ADMIN_TOKENS.slate200,
} satisfies SxProps<Theme>;

export const volumeBarSegmentSx = {
  height: "100%",
  transition: "width 0.2s ease",
} satisfies SxProps<Theme>;

export const volumeLegendSx = {
  display: "flex",
  flexWrap: "wrap",
  gap: 3,
  mt: 0.5,
} satisfies SxProps<Theme>;

export const volumeLegendItemSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 1,
} satisfies SxProps<Theme>;

export const volumeLegendDotSx = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  flexShrink: 0,
} satisfies SxProps<Theme>;

export const volumeLegendLabelSx = {
  fontSize: 13,
  fontWeight: 500,
  color: ADMIN_TOKENS.slate600,
} satisfies SxProps<Theme>;

export const volumeLegendValueSx = {
  fontSize: 13,
  fontWeight: 700,
  color: ADMIN_TOKENS.ink,
} satisfies SxProps<Theme>;

export const rangeToggleGroupSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: "2px",
  p: "4px",
  borderRadius: "999px",
  backgroundColor: alpha(ADMIN_TOKENS.slate50, 0.8),
  border: `1px solid ${ADMIN_TOKENS.slate200}`,
  flexShrink: 0,
} satisfies SxProps<Theme>;

export const rangeToggleButtonSx = {
  px: 1.75,
  py: 0.75,
  borderRadius: "999px",
  fontSize: 13,
  fontWeight: 600,
  color: ADMIN_TOKENS.slate500,
  transition: "background-color 0.15s ease, color 0.15s ease",
  "&:hover": { color: ADMIN_TOKENS.ink },
} satisfies SxProps<Theme>;

export const rangeToggleButtonActiveSx = {
  backgroundColor: ADMIN_TOKENS.surface,
  color: ADMIN_TOKENS.ink,
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.12)",
  "&:hover": { backgroundColor: ADMIN_TOKENS.surface },
} satisfies SxProps<Theme>;

export const skeletonStackSx = {
  display: "flex",
  flexDirection: "column",
  gap: "30px",
} satisfies SxProps<Theme>;

export const srOnlySx = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
} satisfies SxProps<Theme>;

export const errorStateSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  minHeight: 320,
  textAlign: "center",
  backgroundColor: ADMIN_TOKENS.surface,
  borderRadius: "16px",
  border: `1px solid ${ADMIN_TOKENS.slate200}`,
  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
  p: { xs: 4, md: 6 },
} satisfies SxProps<Theme>;

export const errorTitleSx = {
  fontSize: 18,
  fontWeight: 700,
  color: ADMIN_TOKENS.ink,
} satisfies SxProps<Theme>;

export const errorTextSx = {
  fontSize: 14,
  fontWeight: 500,
  color: ADMIN_TOKENS.slate500,
  maxWidth: 420,
} satisfies SxProps<Theme>;
