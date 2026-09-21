import type { SxProps, Theme } from "@mui/material";

export const agendaSummaryCardSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
  border: "1px solid #F4F2FF",
  borderRadius: 4,
  px: 2.5,
  py: 2,
  bgcolor: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  flex: 1,
};

export const agendaStatChipSx = (chipBg: string): SxProps<Theme> => ({
  bgcolor: chipBg,
  color: "text.secondary",
  fontWeight: 500,
  border: "none",
  "& .MuiChip-label": { px: 1.25, fontSize: "14px" },
});

export const agendaStatIconBoxSx = (iconBg: string): SxProps<Theme> => ({
  width: 36,
  height: 36,
  borderRadius: 2,
  bgcolor: iconBg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});