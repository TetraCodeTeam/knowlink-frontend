import type { SxProps, Theme } from "@mui/material/styles";
import { SUPPORT_COLORS } from "@/modules/support/constants/support-colors.constants";

export type StatusTone = "warning" | "info" | "neutral";

export const TONE_COLORS: Record<StatusTone, { bg: string; fg: string }> = {
  warning: { bg: SUPPORT_COLORS.orangeSoft, fg: SUPPORT_COLORS.orange },
  info: { bg: SUPPORT_COLORS.indigoSoft, fg: SUPPORT_COLORS.indigo },
  neutral: { bg: SUPPORT_COLORS.slateTone, fg: SUPPORT_COLORS.slate },
};

export const cardBase = {
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: "0 1px 4px rgba(20, 20, 60, 0.18)",
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
