import type { SxProps, Theme } from "@mui/material/styles";
import { ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";

// Estilos compartidos con Admin 04 (filtros, lista, panel, paginación y guía).
export * from "@/modules/admin/styles/admin-list.styles";

export const fileIconWrapperSx = {
  position: "relative",
  flexShrink: 0,
  mt: 0.25,
} satisfies SxProps<Theme>;

export const fileIconBoxSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  borderRadius: "12px",
} satisfies SxProps<Theme>;

export const reportsBadgeSx = {
  position: "absolute",
  right: -6,
  bottom: -6,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 22,
  height: 22,
  px: 0.5,
  borderRadius: "999px",
  border: `2px solid ${ADMIN_TOKENS.surface}`,
  color: ADMIN_TOKENS.surface,
  fontSize: 11,
  fontWeight: 700,
  lineHeight: 1,
} satisfies SxProps<Theme>;

export const reportsBadgeOpenSx = {
  backgroundColor: ADMIN_TOKENS.rose500,
} satisfies SxProps<Theme>;

export const reportsBadgeClosedSx = {
  backgroundColor: ADMIN_TOKENS.slate400,
} satisfies SxProps<Theme>;

export const itemTitleRemovedSx = {
  textDecoration: "line-through",
} satisfies SxProps<Theme>;

export const itemDangerMetaSx = {
  color: ADMIN_TOKENS.rose700,
  fontWeight: 600,
} satisfies SxProps<Theme>;

export const tutorCardSx = {
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
  p: 2,
  borderRadius: "12px",
  backgroundColor: ADMIN_TOKENS.slate50,
  border: `1px solid ${ADMIN_TOKENS.slate200}`,
} satisfies SxProps<Theme>;

export const tutorNameSx = {
  fontSize: 16,
  fontWeight: 700,
  color: ADMIN_TOKENS.ink,
} satisfies SxProps<Theme>;

export const tutorMetaSx = {
  fontSize: 13,
  fontWeight: 500,
  color: ADMIN_TOKENS.slate500,
} satisfies SxProps<Theme>;

export const reportListSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
  m: 0,
  p: 0,
  listStyle: "none",
} satisfies SxProps<Theme>;

export const reportItemSx = {
  p: 1.5,
  borderRadius: "10px",
  backgroundColor: ADMIN_TOKENS.slate50,
  border: `1px solid ${ADMIN_TOKENS.slate200}`,
} satisfies SxProps<Theme>;

export const reportHeaderSx = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 1,
} satisfies SxProps<Theme>;

export const reportReasonSx = {
  fontSize: 14,
  fontWeight: 700,
  color: ADMIN_TOKENS.rose700,
} satisfies SxProps<Theme>;

export const reportDateSx = {
  fontSize: 12,
  fontWeight: 500,
  color: ADMIN_TOKENS.slate500,
  flexShrink: 0,
  whiteSpace: "nowrap",
} satisfies SxProps<Theme>;

export const reportCommentSx = {
  mt: 0.5,
  fontSize: 13,
  color: ADMIN_TOKENS.slate600,
  lineHeight: 1.5,
} satisfies SxProps<Theme>;

export const reportCommentMutedSx = {
  fontStyle: "italic",
  color: ADMIN_TOKENS.slate400,
} satisfies SxProps<Theme>;

export const resolutionActionsSx = {
  display: "flex",
  gap: 1.5,
} satisfies SxProps<Theme>;

export const resolutionNoteSx = {
  p: 1.5,
  borderRadius: "10px",
  backgroundColor: ADMIN_TOKENS.emerald50,
  border: `1px solid ${ADMIN_TOKENS.emerald100}`,
} satisfies SxProps<Theme>;

export const resolutionNoteLabelSx = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  color: ADMIN_TOKENS.emerald700,
} satisfies SxProps<Theme>;

export const resolutionNoteTextSx = {
  mt: 0.5,
  fontSize: 14,
  color: ADMIN_TOKENS.slate600,
  lineHeight: 1.5,
} satisfies SxProps<Theme>;
