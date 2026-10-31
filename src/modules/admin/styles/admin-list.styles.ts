import { alpha } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import type { AdminStatusTone } from "@/modules/admin/constants/admin-status-meta";
import { ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";

const CARD_SHADOW = "0 2px 8px rgba(15, 23, 42, 0.06)";

export const pageSx = {
  p: { xs: 2, md: "40px" },
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  minWidth: 0,
} satisfies SxProps<Theme>;

export const headerSx = {
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
} satisfies SxProps<Theme>;

export const titleSx = {
  fontSize: { xs: 30, md: 40 },
  fontWeight: 700,
  letterSpacing: "-1px",
  lineHeight: 1.1,
  color: ADMIN_TOKENS.ink,
} satisfies SxProps<Theme>;

export const subtitleSx = {
  fontSize: { xs: 15, md: 16 },
  fontWeight: 500,
  color: ADMIN_TOKENS.slate500,
  maxWidth: 860,
} satisfies SxProps<Theme>;

export const filtersBarSx = {
  display: "flex",
  flexDirection: { xs: "column", lg: "row" },
  alignItems: { xs: "stretch", lg: "center" },
  justifyContent: "space-between",
  gap: 2,
  p: 1.5,
  backgroundColor: ADMIN_TOKENS.surface,
  borderRadius: "14px",
  border: `1px solid ${ADMIN_TOKENS.slate200}`,
  boxShadow: CARD_SHADOW,
} satisfies SxProps<Theme>;

export const statusTabsSx = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 1,
} satisfies SxProps<Theme>;

export const statusTabSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.75,
  px: 2,
  py: 1,
  borderRadius: "999px",
  border: `1px solid transparent`,
  backgroundColor: "transparent",
  color: ADMIN_TOKENS.slate600,
  fontSize: 14,
  fontWeight: 600,
  lineHeight: 1.2,
  cursor: "pointer",
  transition: "background-color 0.15s ease, color 0.15s ease",
  "&:hover": { backgroundColor: ADMIN_TOKENS.slate50, color: ADMIN_TOKENS.ink },
  "&:focus-visible": {
    outline: `2px solid ${ADMIN_TOKENS.indigo500}`,
    outlineOffset: 2,
  },
} satisfies SxProps<Theme>;

export const statusTabActiveSx = {
  backgroundColor: ADMIN_TOKENS.indigo600,
  color: ADMIN_TOKENS.surface,
  "&:hover": { backgroundColor: ADMIN_TOKENS.indigo700, color: ADMIN_TOKENS.surface },
} satisfies SxProps<Theme>;

export const statusTabCountSx = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 22,
  height: 20,
  px: 0.5,
  borderRadius: "999px",
  backgroundColor: ADMIN_TOKENS.amber500,
  color: ADMIN_TOKENS.ink,
  fontSize: 12,
  fontWeight: 700,
} satisfies SxProps<Theme>;

export const filtersActionsSx = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 1.5,
} satisfies SxProps<Theme>;

export const scopeToggleSx = {
  display: "inline-flex",
  alignItems: "center",
  alignSelf: { xs: "flex-start", lg: "auto" },
  gap: "2px",
  p: "4px",
  borderRadius: "999px",
  backgroundColor: alpha(ADMIN_TOKENS.slate50, 0.9),
  border: `1px solid ${ADMIN_TOKENS.slate200}`,
  flexShrink: 0,
} satisfies SxProps<Theme>;

export const scopeButtonSx = {
  px: 2,
  py: 0.75,
  borderRadius: "999px",
  border: "none",
  backgroundColor: "transparent",
  color: ADMIN_TOKENS.slate500,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  transition: "background-color 0.15s ease, color 0.15s ease",
  "&:hover": { color: ADMIN_TOKENS.ink },
  "&:focus-visible": { outline: `2px solid ${ADMIN_TOKENS.indigo500}`, outlineOffset: 2 },
} satisfies SxProps<Theme>;

export const scopeButtonActiveSx = {
  backgroundColor: ADMIN_TOKENS.surface,
  color: ADMIN_TOKENS.ink,
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.12)",
} satisfies SxProps<Theme>;

export const contentGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", xl: "minmax(0, 1fr) 360px" },
  gap: 3,
  alignItems: "start",
  minWidth: 0,
} satisfies SxProps<Theme>;

export const listCardSx = {
  display: "flex",
  flexDirection: "column",
  backgroundColor: ADMIN_TOKENS.surface,
  borderRadius: "16px",
  border: `1px solid ${ADMIN_TOKENS.slate200}`,
  boxShadow: CARD_SHADOW,
  overflow: "hidden",
  minWidth: 0,
} satisfies SxProps<Theme>;

export const listHeaderSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
  px: 3,
  py: 2.5,
  borderBottom: `1px solid ${ADMIN_TOKENS.slate200}`,
} satisfies SxProps<Theme>;

export const listHeaderTitleSx = {
  fontSize: 20,
  fontWeight: 700,
  color: ADMIN_TOKENS.ink,
} satisfies SxProps<Theme>;

export const listHeaderCountSx = {
  fontSize: 14,
  fontWeight: 600,
  color: ADMIN_TOKENS.slate500,
  whiteSpace: "nowrap",
} satisfies SxProps<Theme>;

export const listSx = {
  display: "flex",
  flexDirection: "column",
  m: 0,
  p: 0,
  listStyle: "none",
} satisfies SxProps<Theme>;

export const listItemSx = {
  position: "relative",
  display: "flex",
  alignItems: "flex-start",
  gap: 2,
  px: 3,
  py: 2.5,
  backgroundColor: ADMIN_TOKENS.surface,
  borderBottom: `1px solid ${ADMIN_TOKENS.slate200}`,
  "&:last-of-type": { borderBottom: "none" },
} satisfies SxProps<Theme>;

export const listItemSelectedSx = {
  backgroundColor: ADMIN_TOKENS.indigo50,
  boxShadow: `inset 0 0 0 1px ${ADMIN_TOKENS.indigo600}`,
} satisfies SxProps<Theme>;

export const itemStripeSx = {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  width: 4,
} satisfies SxProps<Theme>;

export const itemBodySx = {
  flex: 1,
  minWidth: 0,
} satisfies SxProps<Theme>;

export const itemTitleRowSx = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 1,
  minWidth: 0,
} satisfies SxProps<Theme>;

export const itemTitleSx = {
  minWidth: 0,
  maxWidth: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: 17,
  fontWeight: 700,
  color: ADMIN_TOKENS.ink,
} satisfies SxProps<Theme>;

export const itemMetaSx = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 0.75,
  mt: 0.5,
  fontSize: 14,
  fontWeight: 500,
  color: ADMIN_TOKENS.slate500,
  "& svg": { flexShrink: 0 },
} satisfies SxProps<Theme>;

export const itemMetaStrongSx = {
  color: ADMIN_TOKENS.slate600,
  fontWeight: 600,
} satisfies SxProps<Theme>;

export const itemSeparatorSx = {
  color: ADMIN_TOKENS.slate400,
} satisfies SxProps<Theme>;

export const justificationSx = {
  mt: 1.5,
  p: 1.5,
  borderRadius: "10px",
  backgroundColor: ADMIN_TOKENS.slate50,
  border: `1px solid ${ADMIN_TOKENS.slate200}`,
} satisfies SxProps<Theme>;

export const justificationLabelSx = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  color: ADMIN_TOKENS.slate500,
} satisfies SxProps<Theme>;

export const justificationTextSx = {
  mt: 0.5,
  fontSize: 14,
  color: ADMIN_TOKENS.slate600,
  lineHeight: 1.5,
} satisfies SxProps<Theme>;

export const itemActionSx = {
  flexShrink: 0,
  alignSelf: "center",
  whiteSpace: "nowrap",
} satisfies SxProps<Theme>;

export const listEmptySx = {
  px: 3,
  py: 4,
} satisfies SxProps<Theme>;

export const paginationSx = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "flex-start", sm: "center" },
  justifyContent: "space-between",
  gap: 1.5,
  px: 3,
  py: 2,
  borderTop: `1px solid ${ADMIN_TOKENS.slate200}`,
} satisfies SxProps<Theme>;

export const paginationTextSx = {
  fontSize: 14,
  fontWeight: 500,
  color: ADMIN_TOKENS.slate500,
} satisfies SxProps<Theme>;

export const paginationControlsSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
} satisfies SxProps<Theme>;

export const paginationButtonSx = {
  minWidth: 32,
  height: 32,
  px: 1,
  borderRadius: "8px",
  border: `1px solid ${ADMIN_TOKENS.slate200}`,
  backgroundColor: ADMIN_TOKENS.surface,
  color: ADMIN_TOKENS.slate600,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  "&:hover": { backgroundColor: ADMIN_TOKENS.slate50 },
  "&:disabled": { opacity: 0.45, cursor: "default" },
  "&:focus-visible": { outline: `2px solid ${ADMIN_TOKENS.indigo500}`, outlineOffset: 2 },
} satisfies SxProps<Theme>;

export const paginationButtonActiveSx = {
  backgroundColor: ADMIN_TOKENS.indigo600,
  borderColor: ADMIN_TOKENS.indigo600,
  color: ADMIN_TOKENS.surface,
  "&:hover": { backgroundColor: ADMIN_TOKENS.indigo700 },
} satisfies SxProps<Theme>;

export const detailPanelSx = {
  position: { xl: "sticky" },
  top: { xl: 24 },
  display: "flex",
  flexDirection: "column",
  gap: 2.5,
  backgroundColor: ADMIN_TOKENS.surface,
  borderRadius: "16px",
  border: `1px solid ${ADMIN_TOKENS.slate200}`,
  boxShadow: CARD_SHADOW,
  p: 3,
  minWidth: 0,
} satisfies SxProps<Theme>;

export const detailHeaderSx = {
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
} satisfies SxProps<Theme>;

export const detailTitleRowSx = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 1.5,
} satisfies SxProps<Theme>;

export const detailTitleSx = {
  fontSize: 20,
  fontWeight: 700,
  lineHeight: 1.25,
  color: ADMIN_TOKENS.ink,
} satisfies SxProps<Theme>;

export const detailSubtitleSx = {
  fontSize: 13,
  fontWeight: 500,
  color: ADMIN_TOKENS.slate500,
} satisfies SxProps<Theme>;

export const sectionSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
} satisfies SxProps<Theme>;

export const sectionTitleSx = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  color: ADMIN_TOKENS.slate500,
} satisfies SxProps<Theme>;

export const infoRowSx = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 2,
  py: 0.75,
  borderBottom: `1px solid ${ADMIN_TOKENS.slate200}`,
  "&:last-of-type": { borderBottom: "none" },
} satisfies SxProps<Theme>;

export const infoLabelSx = {
  fontSize: 13,
  fontWeight: 500,
  color: ADMIN_TOKENS.slate500,
  flexShrink: 0,
} satisfies SxProps<Theme>;

export const infoValueSx = {
  fontSize: 14,
  fontWeight: 600,
  color: ADMIN_TOKENS.ink,
  textAlign: "right",
  wordBreak: "break-word",
} satisfies SxProps<Theme>;

export const guideSx = {
  p: 2.5,
  borderRadius: "12px",
  backgroundColor: ADMIN_TOKENS.indigo50,
  border: `1px solid ${ADMIN_TOKENS.indigo100}`,
} satisfies SxProps<Theme>;

export const guideTitleSx = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  color: ADMIN_TOKENS.indigo700,
  mb: 1.5,
} satisfies SxProps<Theme>;

export const guideListSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
  m: 0,
  p: 0,
  listStyle: "none",
} satisfies SxProps<Theme>;

export const guideItemSx = {
  display: "flex",
  alignItems: "flex-start",
  gap: 1.25,
} satisfies SxProps<Theme>;

export const guideNumberSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: 22,
  height: 22,
  borderRadius: "50%",
  backgroundColor: ADMIN_TOKENS.indigo600,
  color: ADMIN_TOKENS.surface,
  fontSize: 12,
  fontWeight: 700,
} satisfies SxProps<Theme>;

export const guideTextSx = {
  fontSize: 13,
  fontWeight: 500,
  color: ADMIN_TOKENS.slate600,
  lineHeight: 1.55,
} satisfies SxProps<Theme>;

export const detailNoteSx = {
  p: 1.5,
  borderRadius: "10px",
  backgroundColor: ADMIN_TOKENS.slate50,
  fontSize: 13,
  fontWeight: 500,
  color: ADMIN_TOKENS.slate500,
  lineHeight: 1.5,
} satisfies SxProps<Theme>;

export const detailErrorSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 1.5,
  py: 3,
  textAlign: "center",
} satisfies SxProps<Theme>;

export const detailErrorTitleSx = {
  fontSize: 16,
  fontWeight: 700,
  color: ADMIN_TOKENS.ink,
} satisfies SxProps<Theme>;

export const detailErrorTextSx = {
  fontSize: 13,
  color: ADMIN_TOKENS.slate500,
} satisfies SxProps<Theme>;

export const skeletonStackSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
  p: 3,
} satisfies SxProps<Theme>;

export const statusChipBaseSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.75,
  px: 1,
  height: 22,
  borderRadius: "999px",
  fontSize: 12,
  fontWeight: 700,
  lineHeight: 1,
  whiteSpace: "nowrap",
} satisfies SxProps<Theme>;

export const statusChipDotSx = {
  width: 6,
  height: 6,
  borderRadius: "50%",
  backgroundColor: "currentColor",
} satisfies SxProps<Theme>;

export const STATUS_CHIP_COLORS: Record<AdminStatusTone, { bg: string; fg: string }> = {
  warning: { bg: ADMIN_TOKENS.amber50, fg: ADMIN_TOKENS.amber700 },
  info: { bg: ADMIN_TOKENS.indigo50, fg: ADMIN_TOKENS.indigo700 },
  success: { bg: ADMIN_TOKENS.emerald50, fg: ADMIN_TOKENS.emerald700 },
  danger: { bg: ADMIN_TOKENS.rose50, fg: ADMIN_TOKENS.rose700 },
};

export const dialogFieldSx = {
  width: "100%",
  mt: 0.5,
} satisfies SxProps<Theme>;
