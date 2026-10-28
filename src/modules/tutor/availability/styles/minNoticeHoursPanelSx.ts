import type { SxProps, Theme } from "@mui/material";

export const minNoticePanelSx: SxProps<Theme> = {
  border: "1px solid #e2e8f0",
  borderRadius: 3,
  p: 4,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  bgcolor: "#fff",
};

export const minNoticeChipSx: SxProps<Theme> = {
  fontWeight: 500,
  fontSize: "0.9rem",
  px: 1.5,
  py: 2.5,
  borderRadius: 2.5,
};