import type { SxProps, Theme } from "@mui/material";
import { UPLOAD_BUTTON_COLORS, DROP_AREA_COLORS } from "@/modules/tutor/materials/constants/materials.constants";

export const uploadButtonSx: SxProps<Theme> = {
  backgroundColor: UPLOAD_BUTTON_COLORS.background,
  color: UPLOAD_BUTTON_COLORS.text,
  border: `1.5px solid ${UPLOAD_BUTTON_COLORS.border}`,
  borderRadius: "8px",
  padding: "6px 14px",
  textTransform: "none",
  fontWeight: 500,
  fontSize: "13px",
  whiteSpace: "nowrap",
  flexShrink: 0,
  "&:hover": {
    backgroundColor: "#E0DEFE",
  },
};

export const dropAreaSx: SxProps<Theme> = {
  border: `2px dashed ${DROP_AREA_COLORS.border}`,
  borderRadius: "10px",
  padding: "28px 20px",
  backgroundColor: DROP_AREA_COLORS.background,
  textAlign: "center",
  cursor: "pointer",
  transition: "border-color 0.2s ease, background-color 0.2s ease",
  position: "relative",
  "&:hover": {
    borderColor: "#9597E4",
    backgroundColor: "#EEEDFE",
  },
};

export const allowedFormatsSx: SxProps<Theme> = {
  fontSize: "12px",
  color: DROP_AREA_COLORS.formats,
  textAlign: "center",
  mt: 0.5,
};

export const fileIconContainerSx = (bgColor: string): SxProps<Theme> => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "8px",
  backgroundColor: bgColor,
  flexShrink: 0,
});

export const materialRowSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "10px 0",
  borderBottom: "1px solid #EEEEF6",
  "&:last-child": {
    borderBottom: "none",
  },
};

export const emptyStateSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 24px",
  textAlign: "center",
  gap: "16px",
};
