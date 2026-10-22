import type { SxProps, Theme } from "@mui/material/styles";
import { SUPPORT_COLORS } from "@/modules/support/constants/support-colors.constants";

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
  bgcolor: SUPPORT_COLORS.surface,
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
