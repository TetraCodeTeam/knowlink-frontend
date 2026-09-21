import type { SxProps, Theme } from "@mui/material";

export const agendaToolbarChipSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  bgcolor: "#fff",
  border: "1px solid #ececf4",
  borderRadius: 3,
  px: 1.5,
  py: 0.75,
  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
};

export const agendaLegendDotSx = (color: string): SxProps<Theme> => ({
  width: 15,
  height: 15,
  borderRadius: "30%",
  bgcolor: color,
  display: "inline-block",
});