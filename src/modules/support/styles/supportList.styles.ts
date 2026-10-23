import type { SxProps, Theme } from "@mui/material/styles";
import { SUPPORT_COLORS } from "@/modules/support/constants/support-colors.constants";

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
  bgcolor: SUPPORT_COLORS.surface,
  borderRadius: 2,
} satisfies SxProps<Theme>;

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
