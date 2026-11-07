import type { SxProps, Theme } from "@mui/material";

export const minNoticePanelSx: SxProps<Theme> = {
  border: "1px solid #e2e8f0",
  borderRadius: 3,
  p: { xs: 2, md: 2.5 },
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  bgcolor: "#fff",
};

export const minNoticeChipSx: SxProps<Theme> = {
  fontWeight: 500,
  fontSize: "0.8rem",
  px: 0.5,
  py: 1.75,
  borderRadius: 2,
};
