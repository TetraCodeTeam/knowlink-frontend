import type { SxProps, Theme } from "@mui/material";

const base: SxProps<Theme> = {
  borderRadius: 3,
  py: 1.25,
  px: 3,
  textTransform: "none",
  fontWeight: 600,
  fontSize: 15,
  "&:active": { transform: "scale(0.98)" },
};

export const primaryButtonSx: SxProps<Theme> = {
  ...base,
  bgcolor: "#5B6ED9",
  color: "#fff",
  border: "none",
  "&:hover": { bgcolor: "#3451d1" },
  "&.Mui-disabled": { bgcolor: "#a5b4fc", color: "#fff" },
};

export const softButtonSx: SxProps<Theme> = {
  ...base,
  bgcolor: "#eef2ff",
  color: "#5B6ED9",
  border: "1px solid #c7d2fe",
  "&:hover": { bgcolor: "#e0e7ff" },
};

export const softDangerButtonSx: SxProps<Theme> = {
  ...base,
  bgcolor: "#fce8e8",
  color: "#b91c1c",
  border: "1px solid #fca5a5",
  "&:hover": { bgcolor: "#fee2e2" },
};

export const outlineButtonSx: SxProps<Theme> = {
  ...base,
  bgcolor: "transparent",
  color: "text.primary",
  border: "1px solid #e2e8f0",
  "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" },
};