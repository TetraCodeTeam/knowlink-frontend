import type { SxProps, Theme } from "@mui/material";

export const agendaSummaryCardSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 0.25,
  border: "1px solid #F4F2FF",
  borderRadius: 3,
  px: 2,
  py: 1.25,
  bgcolor: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  flex: 1,
};

export const agendaStatChipSx = (chipBg: string): SxProps<Theme> => ({
  bgcolor: chipBg,
  color: "text.secondary",
  fontWeight: 500,
  border: "none",
  "& .MuiChip-label": { px: 1, fontSize: "12.5px" },
});

export const agendaStatIconBoxSx = (iconBg: string): SxProps<Theme> => ({
  width: 30,
  height: 30,
  borderRadius: 2,
  bgcolor: iconBg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});
