import type { SxProps, Theme } from "@mui/material/styles";
import { TONE_COLORS, type StatusTone } from "@/modules/support/styles/supportShared.styles";

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
