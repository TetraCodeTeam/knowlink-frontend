import type { SxProps, Theme } from "@mui/material";

export const categoryTabsContainerSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "nowrap",
  gap: "10px",
  overflowX: "auto",
  bgcolor: "#ffffff4d",
  borderRadius: 3,
  px: 1.5,
  py: 1.25,
  mb: "14px",
};

export const categoryTabSx = (active: boolean): SxProps<Theme> => ({
  flex: "1 1 0",
  minWidth: "max-content",
  whiteSpace: "nowrap",
  borderRadius: "10px",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.875rem",
  py: "5px",
  border: `1.5px solid ${active ? "#5865C8" : "#C1BFE7"}`,
  backgroundColor: active ? "#5865C8" : "#FFFFFF",
  color: active ? "#FFFFFF" : "#5865C8",
  "&:hover": {
    backgroundColor: active ? "#4954B5" : "#EEEDFE",
  },
});

export const dateHeaderSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  mb: "8px",
};

export const dateBadgeSx: SxProps<Theme> = {
  flexShrink: 0,
  backgroundColor: "#C7C8FF",
  color: "#FFFFFF",
  fontWeight: 600,
  borderRadius: "20px",
  fontSize: "13px",
  px: "12px",
  py: "3px",
  whiteSpace: "nowrap",
};

export const cardContainerSx: SxProps<Theme> = {
  backgroundColor: "#FFFFFF",
  borderRadius: "14px",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
  p: { xs: "12px 14px", md: "14px 20px" },
  mb: "10px",
};

export const timeColumnSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minWidth: "46px",
  mr: { xs: "10px", md: "16px" },
};

export const timeTickSx: SxProps<Theme> = {
  width: "2px",
  flex: 1,
  minHeight: "14px",
  backgroundColor: "#D8D8E8",
  my: "3px",
};

export const virtualLinkBoxSx = (editable: boolean): SxProps<Theme> => ({
  mt: "10px",
  borderRadius: "10px",
  p: "12px 14px",
  overflow: "hidden",
  backgroundColor: editable ? "#EEEDFE" : "#F7F7FB",
  border: `1px solid ${editable ? "#C1BFE7" : "#E5E5F0"}`,
});

export const cancelDialogIconWrapperSx = (bgColor: string): SxProps<Theme> => ({
  width: 60,
  height: 60,
  borderRadius: "50%",
  bgcolor: bgColor,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  mb: 2,
});

export const cancelBookingSummaryBoxSx: SxProps<Theme> = {
  mt: "16px",
  mb: "8px",
  width: "100%",
  borderRadius: "10px",
  p: "14px 16px",
  backgroundColor: "#F7F7FB",
  border: "1px solid #E5E5F0",
  textAlign: "left",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

export const cancelBookingSummaryRowSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};
