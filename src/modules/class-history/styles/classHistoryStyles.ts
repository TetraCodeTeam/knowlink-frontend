import type { SxProps, Theme } from "@mui/material";

export const categoryTabsContainerSx: SxProps<Theme> = {
    display: "flex",
    gap: "18px",
    bgcolor: "#ffffff4d",
    borderRadius: 3,
    px: 2,
    py: 2,
    mb: "20px",
};

export const categoryTabSx = (active: boolean): SxProps<Theme> => ({
    borderRadius: "10px",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "1rem",
    py: "7px",
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
    gap: "12px",
    mb: "12px",
};

export const dateBadgeSx: SxProps<Theme> = {
    flexShrink: 0,
    backgroundColor: "#C7C8FF",
    color: "#FFFFFF",
    fontWeight: 600,
    borderRadius: "20px",
    px: "16px",
    py: "6px",
    whiteSpace: "nowrap",
};

export const cardContainerSx: SxProps<Theme> = {
    backgroundColor: "#FFFFFF",
    borderRadius: "14px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
    p: "20px 24px",
    mb: "16px",
};

export const timeColumnSx: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "56px",
    mr: "20px",
};

export const timeTickSx: SxProps<Theme> = {
    width: "2px",
    flex: 1,
    minHeight: "18px",
    backgroundColor: "#D8D8E8",
    my: "4px",
};

export const virtualLinkBoxSx = (editable: boolean): SxProps<Theme> => ({
    mt: "16px",
    borderRadius: "10px",
    p: "16px 18px",
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