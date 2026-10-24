import type { SxProps, Theme } from "@mui/material/styles";
import { SUPPORT_COLORS } from "@/modules/support/constants/support-colors.constants";

export const supportTitleTextSx = {
  fontSize: 16,
  fontWeight: 600,
  color: SUPPORT_COLORS.textStrong,
} satisfies SxProps<Theme>;

export const supportBodyTextSx = {
  fontSize: 14,
  color: SUPPORT_COLORS.textSecondary,
} satisfies SxProps<Theme>;

export const supportMutedTextSx = {
  fontSize: 14,
  color: SUPPORT_COLORS.textMuted,
} satisfies SxProps<Theme>;

export const supportMutedLabelSx = {
  fontSize: 14,
  fontWeight: 600,
  color: SUPPORT_COLORS.textMuted,
} satisfies SxProps<Theme>;

export const supportStrongLabelSx = {
  fontSize: 14,
  fontWeight: 700,
  color: SUPPORT_COLORS.textMuted,
} satisfies SxProps<Theme>;

export const supportQuoteTextSx = {
  fontSize: 14,
  color: SUPPORT_COLORS.textQuote,
  fontStyle: "italic",
  lineHeight: 1.5,
} satisfies SxProps<Theme>;

export const supportAccentTextSx = {
  fontSize: 14,
  fontWeight: 700,
  color: SUPPORT_COLORS.primary,
} satisfies SxProps<Theme>;

export const supportDangerTextSx = {
  fontSize: 14,
  fontWeight: 600,
  color: SUPPORT_COLORS.danger,
} satisfies SxProps<Theme>;
