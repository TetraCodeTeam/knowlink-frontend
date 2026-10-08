import type { SxProps, Theme } from "@mui/material";

export const reportIconWrapperSx = (bgColor: string): SxProps<Theme> => ({
  width: 60,
  height: 60,
  borderRadius: "50%",
  bgcolor: bgColor,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  mb: 2,
});

export const reportInfoBoxSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  width: "100%",
  borderRadius: "10px",
  p: "12px 14px",
  mt: "4px",
  mb: "16px",
  backgroundColor: "#FFBA7F",
};

export const reportReasonCardSx = (selected: boolean): SxProps<Theme> => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
  borderRadius: "10px",
  p: "10px 14px",
  cursor: "pointer",
  border: `1.5px solid ${selected ? "#5865C8" : "#E0E0E0"}`,
  backgroundColor: selected ? "#F4F3FB" : "#FFFFFF",
  transition: "border-color 0.15s ease, background-color 0.15s ease",
});

export const reportLinkButtonSx: SxProps<Theme> = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#C97B84",
  fontWeight: 600,
  fontSize: "0.85rem",
  p: 0,
};

export const reportedLabelSx: SxProps<Theme> = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  color: "#9E9E9E",
  fontWeight: 600,
  fontSize: "0.85rem",
};
