import type { SxProps, Theme } from "@mui/material/styles";

export type StatusTone = "warning" | "info" | "neutral";

export const TONE_COLORS: Record<StatusTone, { bg: string; fg: string }> = {
  warning: { bg: "#FDE7D6", fg: "#B4531A" },
  info: { bg: "#E6E8FB", fg: "#3F4BC4" },
  neutral: { bg: "#E9EAEF", fg: "#4B4F5C" },
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
