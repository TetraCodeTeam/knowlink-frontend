import type { SxProps, Theme } from "@mui/material/styles";

export type StatusTone = "warning" | "info" | "neutral";
export type SummaryTone = "neutral" | "info";

export const TONE_COLORS: Record<StatusTone, { bg: string; fg: string }> = {
  warning: { bg: "#FDE7D6", fg: "#B4531A" },
  info: { bg: "#E6E8FB", fg: "#3F4BC4" },
  neutral: { bg: "#E9EAEF", fg: "#4B4F5C" },
};

const cardBase = {
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: "0 1px 4px rgba(20, 20, 60, 0.18)",
} satisfies SxProps<Theme>;

// ---------- Layout de página ----------

export const pageLayoutSx = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) 340px" },
  gap: 3,
  alignItems: "start",
  p:4
} satisfies SxProps<Theme>;

export const mainCardSx = {
  ...cardBase,
  p: { xs: 2.5, md: 4 },
  minHeight: 480,
} satisfies SxProps<Theme>;

export const sideColumnSx = {
  display: "flex",
  flexDirection: "column",
  gap: 2.5,
} satisfies SxProps<Theme>;

export const pageTitleSx = {
  fontSize: { xs: 26, md: 32 },
  fontWeight: 500,
  color: "text.primary",
  mb: 2,
} satisfies SxProps<Theme>;

export const tabsSx = {
  borderBottom: 1,
  borderColor: "divider",
  mb: 4,
  "& .MuiTab-root": {
    textTransform: "none",
    fontSize: 18,
    fontWeight: 500,
    flex: 1,
    maxWidth: "none",
  },
  "& .MuiTabs-indicator": { height: 3, borderRadius: 3 },
} satisfies SxProps<Theme>;

// ---------- Listas ----------

export const listHeaderSx = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 2,
} satisfies SxProps<Theme>;

export const listTitleSx = { fontSize: 20, fontWeight: 600 } satisfies SxProps<Theme>;

export const listCountSx = {
  fontSize: 14,
  fontWeight: 550,
  letterSpacing: 0.6,
  textTransform: "uppercase",
  color: "text.secondary",
} satisfies SxProps<Theme>;

export const listSubtitleSx = {
  fontSize: 16,
  color: "text.secondary",
  mt: 0.5,
} satisfies SxProps<Theme>;

export const listSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
  mt: 2.5,
  p: 0,
  listStyle: "none",
} satisfies SxProps<Theme>;

export const listItemSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  px: 2,
  py: 1.5,
  bgcolor: "#F3F4F8",
  borderRadius: 2,
} satisfies SxProps<Theme>;

export const getIconBoxSx = (bg: string, fg: string): SxProps<Theme> => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: 45,
  height: 45,
  borderRadius: 2,
  bgcolor: bg,
  color: fg,
});

export const itemBodySx = { flex: 1, minWidth: 0 } satisfies SxProps<Theme>;

export const itemTitleRowSx = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 1,
} satisfies SxProps<Theme>;

export const itemTitleSx = { fontSize: 17, fontWeight: 600 } satisfies SxProps<Theme>;

export const itemMetaSx = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 0.75,
  mt: 0.5,
  fontSize: 15,
  color: "text.secondary",
  "& svg": { flexShrink: 0 },
} satisfies SxProps<Theme>;

export const itemReasonSx = {
  fontSize: 15,
  color: "text.secondary",
  mt: 0.5,
} satisfies SxProps<Theme>;

export const detailButtonSx = {
  flexShrink: 0,
  minWidth: "auto",
  whiteSpace: "nowrap",
  fontSize: 14,
  fontWeight: 600,
  textTransform: "none",
} satisfies SxProps<Theme>;

export const metaSeparatorSx = { color: "text.disabled" } satisfies SxProps<Theme>;

// ---------- Chip de estado ----------

export const getStatusChipSx = (tone: StatusTone): SxProps<Theme> => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 1,
  px: 1,
  height: 20,
  borderRadius: 10,
  fontSize: 14,
  fontWeight: 600,
  lineHeight: 2,
  whiteSpace: "nowrap",
  bgcolor: TONE_COLORS[tone].bg,
  color: TONE_COLORS[tone].fg,
});

export const statusDotSx = {
  width: 6,
  height: 6,
  borderRadius: "50%",
  bgcolor: "currentColor",
} satisfies SxProps<Theme>;

// ---------- Columna lateral ----------

export const sideCardSx = { ...cardBase, p: 2.5 } satisfies SxProps<Theme>;

export const sideCardHeaderSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.25,
  mb: 1.5,
} satisfies SxProps<Theme>;

export const sideCardTitleSx = { fontSize: 13, fontWeight: 600 } satisfies SxProps<Theme>;

export const sideCardBodySx = {
  fontSize: 12.5,
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
  bgcolor: tone === "info" ? "#F1F2FD" : "#F3F4F8",
});

export const summaryValueSx = (tone: SummaryTone): SxProps<Theme> => ({
  fontSize: 26,
  fontWeight: 600,
  lineHeight: 1.1,
  color: tone === "info" ? "primary.main" : "text.primary",
});

export const summaryLabelSx = {
  fontSize: 11.5,
  color: "text.secondary",
  mt: 0.5,
} satisfies SxProps<Theme>;

export const summaryCaptionSx = {
  fontSize: 10.5,
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

// ---------- Estado vacío ----------

export const emptyStateSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: 2,
  py: 2,
} satisfies SxProps<Theme>;

export const emptyIllustrationSx = {
  width: "min(100%, 360px)",
  height: "auto",
} satisfies SxProps<Theme>;

export const emptyTitleSx = { fontSize: 22, fontWeight: 500 } satisfies SxProps<Theme>;

export const emptyDescriptionSx = {
  fontSize: 16,
  color: "text.secondary",
  maxWidth: 360,
} satisfies SxProps<Theme>;

// ---------- Diálogo de normativa ----------

export const dialogPaperSx = {
  borderRadius: 3,
  width: "100%",
  maxWidth: 520,
} satisfies SxProps<Theme>;

export const dialogHeaderSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  pr: 6,
} satisfies SxProps<Theme>;

export const dialogCloseSx = {
  position: "absolute",
  top: 12,
  right: 12,
} satisfies SxProps<Theme>;

export const ruleSectionSx = { mb: 2.5 } satisfies SxProps<Theme>;

export const ruleHighlightSx = {
  p: 1.75,
  borderRadius: 2,
  bgcolor: "#F3F4F8",
} satisfies SxProps<Theme>;

export const ruleTitleSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.75,
  mb: 0.75,
  fontSize: 13,
  fontWeight: 600,
} satisfies SxProps<Theme>;

export const ruleBodySx = {
  fontSize: 12,
  lineHeight: 1.55,
  color: "text.secondary",
} satisfies SxProps<Theme>;

export const ruleItemSx = {
  display: "flex",
  alignItems: "flex-start",
  gap: 1,
  mt: 1.25,
  "& svg": { flexShrink: 0, mt: "2px" },
} satisfies SxProps<Theme>;

export const ruleFormatsSx = {
  display: "flex",
  gap: 1,
  mt: 1,
} satisfies SxProps<Theme>;

export const getFormatChipSx = (bg: string, fg: string): SxProps<Theme> => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 0.5,
  px: 1,
  height: 22,
  borderRadius: 1,
  fontSize: 10,
  fontWeight: 700,
  bgcolor: bg,
  color: fg,
});
