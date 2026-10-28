import type { SxProps, Theme } from "@mui/material/styles";
import { cardBase } from "@/modules/support/styles/supportShared.styles";
import { SUPPORT_COLORS } from "@/modules/support/constants/support-colors.constants";

export type SummaryTone = "neutral" | "info";

export const sideColumnSx = {
  display: "flex",
  flexDirection: "column",
  gap: 2.5,
} satisfies SxProps<Theme>;

export const sideCardSx = { ...cardBase, p: 2.5 } satisfies SxProps<Theme>;

export const sideCardHeaderSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.25,
  mb: 1.5,
} satisfies SxProps<Theme>;

export const sideCardTitleSx = { fontSize: 16, fontWeight: 600 } satisfies SxProps<Theme>;

export const sideCardBodySx = {
  fontSize: 14,
  lineHeight: 1.5,
  color: "text.secondary",
} satisfies SxProps<Theme>;

export const summaryGridSx = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 1.5,
} satisfies SxProps<Theme>;

export const getSummaryTileSx = (tone: SummaryTone): SxProps<Theme> => ({
  position: "relative",
  p: 1.5,
  borderRadius: 2,
  bgcolor: tone === "info" ? SUPPORT_COLORS.surfaceInfo : SUPPORT_COLORS.surface,
});

export const summaryValueSx = (tone: SummaryTone): SxProps<Theme> => ({
  fontSize: 26,
  fontWeight: 600,
  lineHeight: 1.1,
  color: tone === "info" ? "primary.main" : "text.primary",
});

export const summaryLabelSx = {
  fontSize: 15,
  color: "text.secondary",
  mt: 0.5,
} satisfies SxProps<Theme>;

export const summaryCaptionSx = {
  fontSize: 12,
  color: "warning.dark",
  mt: 0.25,
} satisfies SxProps<Theme>;

export const summaryTileIconSx = {
  position: "absolute",
  top: 10,
  right: 10,
  display: "flex",
  color: "text.secondary",
} satisfies SxProps<Theme>;

export const sideLinkSx = {
  display: "flex",
  mt: 1.5,
  p: 0,
  minWidth: "auto",
  fontSize: 12.5,
  fontWeight: 600,
  textTransform: "none",
  justifyContent: "flex-start",
} satisfies SxProps<Theme>;

export const sideBadgeSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.75,
  mt: 1.5,
  px: 1.5,
  py: 0.75,
  borderRadius: 1.5,
  bgcolor: "background.default",
  border: 1,
  borderColor: "divider",
  fontSize: 11,
  fontWeight: 500,
} satisfies SxProps<Theme>;

export const sideBulletListSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
  mt: 1.5,
  p: 0,
  listStyle: "none",
} satisfies SxProps<Theme>;

export const sideBulletSx = {
  display: "flex",
  alignItems: "flex-start",
  gap: 1,
  fontSize: 11.5,
  lineHeight: 1.4,
  color: "text.secondary",
  "& svg": { flexShrink: 0, mt: "2px" },
} satisfies SxProps<Theme>;
