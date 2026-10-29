import type { SxProps, Theme } from "@mui/material";

export const COMMUNITY_COLORS = {
  primary: "#5B6ED9",
  primaryDark: "#3F4CAE",
  text: "#1A1A2E",
  muted: "#6B6B80",
  subtle: "#8A8AA3",
  border: "#ECEAF8",
  lavender: "#EDEBFA",
  panel: "#F1F3FD",
  success: "#166B45",
  successBg: "#D9F5E5",
  warning: "#A8480E",
  warningBg: "#FDE4D6",
  star: "#B45309",
} as const;

export const pageSx: SxProps<Theme> = {
  px: { xs: 2, md: 4 },
  py: 3,
  display: "flex",
  flexDirection: "column",
};

/** El contenido usa todo el ancho y alto de la página, sin márgenes laterales vacíos. */
export const pageContentSx: SxProps<Theme> = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export const cardSx: SxProps<Theme> = {
  bgcolor: "#FFFFFF",
  borderRadius: "14px",
  border: `1px solid ${COMMUNITY_COLORS.border}`,
  boxShadow: "0 1px 2px rgba(63, 76, 174, 0.06)",
  p: { xs: 2, md: 2.5 },
};

export const chipSx: SxProps<Theme> = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.5,
  px: 1,
  py: 0.25,
  borderRadius: "6px",
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.6,
  whiteSpace: "nowrap",
};

export const pageTitleSx: SxProps<Theme> = {
  fontSize: { xs: 22, md: 26 },
  fontWeight: 700,
  color: COMMUNITY_COLORS.text,
  lineHeight: 1.25,
};

export const sectionTitleSx: SxProps<Theme> = {
  fontSize: 20,
  fontWeight: 700,
  color: COMMUNITY_COLORS.text,
};

export const backLinkSx: SxProps<Theme> = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.75,
  alignSelf: "flex-start",
  color: COMMUNITY_COLORS.primaryDark,
  fontSize: 14,
  fontWeight: 600,
  textDecoration: "none",
  cursor: "pointer",
  "&:hover": { textDecoration: "underline" },
};

export const linkSx: SxProps<Theme> = {
  color: "inherit",
  textDecoration: "none",
  "&:hover": { textDecoration: "underline" },
};

export const twoColumnSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) 340px" },
  gap: 3,
  alignItems: "stretch",
  flex: 1,
};
