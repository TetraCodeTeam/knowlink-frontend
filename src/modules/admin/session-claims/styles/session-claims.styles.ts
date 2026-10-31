import type { SxProps, Theme } from "@mui/material/styles";
import { ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";

export const partiesListSx = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
} satisfies SxProps<Theme>;

export const partyCardSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
} satisfies SxProps<Theme>;

export const partyHeaderSx = {
  display: "flex",
  alignItems: "baseline",
  flexWrap: "wrap",
  gap: 0.75,
} satisfies SxProps<Theme>;

export const partyNameSx = {
  fontSize: 14,
  fontWeight: 700,
  color: ADMIN_TOKENS.ink,
} satisfies SxProps<Theme>;

export const partyRoleSx = {
  fontSize: 12,
  fontWeight: 500,
  color: ADMIN_TOKENS.slate500,
} satisfies SxProps<Theme>;

export const partyMessageSx = {
  p: 1.5,
  borderRadius: "10px",
  backgroundColor: ADMIN_TOKENS.slate50,
  border: `1px solid ${ADMIN_TOKENS.slate200}`,
  fontSize: 13,
  color: ADMIN_TOKENS.slate600,
  lineHeight: 1.55,
} satisfies SxProps<Theme>;

export const partyNoMessageSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  p: 1.5,
  borderRadius: "10px",
  border: `1px dashed ${ADMIN_TOKENS.slate200}`,
  color: ADMIN_TOKENS.slate400,
  fontSize: 13,
  fontWeight: 500,
} satisfies SxProps<Theme>;

export const resolutionFormSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
} satisfies SxProps<Theme>;

export const fieldLabelSx = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.4px",
  textTransform: "uppercase",
  color: ADMIN_TOKENS.slate500,
} satisfies SxProps<Theme>;

export const fieldErrorSx = {
  fontSize: 12,
  fontWeight: 600,
  color: ADMIN_TOKENS.rose700,
} satisfies SxProps<Theme>;

export const favoredToggleSx = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 1,
} satisfies SxProps<Theme>;

export const favoredButtonSx = {
  py: 1.25,
  borderRadius: "10px",
  border: `1px solid ${ADMIN_TOKENS.slate200}`,
  backgroundColor: ADMIN_TOKENS.surface,
  color: ADMIN_TOKENS.slate600,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  transition: "background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease",
  "&:hover": { backgroundColor: ADMIN_TOKENS.slate50, color: ADMIN_TOKENS.ink },
  "&:focus-visible": { outline: `2px solid ${ADMIN_TOKENS.indigo500}`, outlineOffset: 2 },
} satisfies SxProps<Theme>;

export const favoredButtonActiveSx = {
  backgroundColor: ADMIN_TOKENS.indigo600,
  borderColor: ADMIN_TOKENS.indigo600,
  color: ADMIN_TOKENS.surface,
  "&:hover": { backgroundColor: ADMIN_TOKENS.indigo700, color: ADMIN_TOKENS.surface },
} satisfies SxProps<Theme>;

export const resolvedNoteSx = {
  p: 1.5,
  borderRadius: "10px",
  backgroundColor: ADMIN_TOKENS.emerald50,
  border: `1px solid ${ADMIN_TOKENS.emerald100}`,
} satisfies SxProps<Theme>;

export const resolvedNoteLabelSx = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  color: ADMIN_TOKENS.emerald700,
} satisfies SxProps<Theme>;

export const resolvedNoteTextSx = {
  mt: 0.5,
  fontSize: 14,
  color: ADMIN_TOKENS.slate600,
  lineHeight: 1.5,
} satisfies SxProps<Theme>;

export const contactCardsSx = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  mt: 1.5,
} satisfies SxProps<Theme>;

export const contactCardSx = {
  p: 2,
  borderRadius: "12px",
  border: `1px solid ${ADMIN_TOKENS.slate200}`,
  backgroundColor: ADMIN_TOKENS.slate50,
} satisfies SxProps<Theme>;

export const contactHeaderSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
} satisfies SxProps<Theme>;

export const contactAvatarSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: 44,
  height: 44,
  borderRadius: "50%",
  backgroundColor: ADMIN_TOKENS.indigo100,
  color: ADMIN_TOKENS.indigo700,
  fontSize: 14,
  fontWeight: 700,
} satisfies SxProps<Theme>;

export const contactNameSx = {
  fontSize: 15,
  fontWeight: 700,
  color: ADMIN_TOKENS.ink,
} satisfies SxProps<Theme>;

export const contactRoleSx = {
  fontSize: 12,
  fontWeight: 600,
  color: ADMIN_TOKENS.slate500,
} satisfies SxProps<Theme>;

export const contactGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
  gap: 1.5,
  mt: 1.5,
} satisfies SxProps<Theme>;

export const contactFieldLabelSx = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.4px",
  textTransform: "uppercase",
  color: ADMIN_TOKENS.slate500,
} satisfies SxProps<Theme>;

export const contactFieldValueSx = {
  fontSize: 13,
  fontWeight: 600,
  color: ADMIN_TOKENS.ink,
  wordBreak: "break-word",
} satisfies SxProps<Theme>;

export const dialogTitleSx = {
  fontSize: 20,
  fontWeight: 700,
  color: ADMIN_TOKENS.ink,
} satisfies SxProps<Theme>;

export const dialogSubtitleSx = {
  fontSize: 13,
  fontWeight: 600,
  color: ADMIN_TOKENS.indigo700,
} satisfies SxProps<Theme>;

export const dialogTextSx = {
  mt: 0.5,
  fontSize: 13,
  color: ADMIN_TOKENS.slate600,
  lineHeight: 1.55,
} satisfies SxProps<Theme>;

export const contactLoadingSx = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
} satisfies SxProps<Theme>;

export const contactErrorSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 1.5,
  py: 2,
  textAlign: "center",
} satisfies SxProps<Theme>;
