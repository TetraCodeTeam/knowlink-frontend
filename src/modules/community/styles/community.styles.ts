import type { SxProps, Theme } from "@mui/material";
import { PAGE_TITLE_BASE_SX } from "@/shared/styles/typography.styles";

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
  py: 2,
  display: "flex",
  flexDirection: "column",
};

/** El contenido usa todo el ancho y alto de la página, sin márgenes laterales vacíos. */
export const pageContentSx: SxProps<Theme> = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 2.5,
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
  fontSize: 11.5,
  fontWeight: 600,
  lineHeight: 1.6,
  whiteSpace: "nowrap",
};

export const pageTitleSx: SxProps<Theme> = {
  ...PAGE_TITLE_BASE_SX,
  color: COMMUNITY_COLORS.text,
};

export const sectionTitleSx: SxProps<Theme> = {
  fontSize: 18,
  fontWeight: 700,
  color: COMMUNITY_COLORS.text,
};

export const backLinkSx: SxProps<Theme> = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.75,
  alignSelf: "flex-start",
  color: COMMUNITY_COLORS.primaryDark,
  fontSize: 13,
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

/**
 * Paneles de la columna derecha que acompañan el scroll del feed, debajo del topbar fijo. Solo con dos
 * columnas (`lg`): en pantallas chicas todo va en una columna y no hay nada que mantener a la vista.
 * Si la ventana es baja, el propio panel hace scroll en vez de quedar cortado.
 */
export const stickyPanelsSx = (topbarHeight: number): SxProps<Theme> => ({
  display: "flex",
  flexDirection: "column",
  gap: 2.5,
  position: { lg: "sticky" },
  top: { lg: topbarHeight + 20 },
  maxHeight: { lg: `calc(100vh - ${topbarHeight + 40}px)` },
  overflowY: { lg: "auto" },
  // El margen negativo compensa el relleno para que `overflow` no recorte la sombra de las tarjetas.
  p: { lg: "3px" },
  m: { lg: "-3px" },
});

export const twoColumnSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) 340px" },
  gap: 3,
  alignItems: "stretch",
  flex: 1,
};
