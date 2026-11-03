import type { SxProps, Theme } from "@mui/material/styles";
import { cardBase } from "@/modules/support/styles/supportShared.styles";

export const pageLayoutSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "minmax(0, 1fr) minmax(250px, 0.85fr)",
    lg: "minmax(0, 1fr) 320px",
  },
  gap: 2,
  alignItems: "stretch",
  px: 4,
  py: 2.5,
} satisfies SxProps<Theme>;

export const mainCardSx = {
  ...cardBase,
  p: { xs: 2, md: 3 },
  minHeight: { xs: 400, lg: 460 },
  display: "flex",
  flexDirection: "column",
} satisfies SxProps<Theme>;

export const pageTitleSx = {
  fontSize: { xs: 22, md: 26 },
  fontWeight: 500,
  color: "text.primary",
  mb: 1,
} satisfies SxProps<Theme>;

export const tabsSx = {
  borderBottom: 1,
  borderColor: "divider",
  mb: 2.5,
  minHeight: 42,
  "& .MuiTab-root": {
    textTransform: "none",
    minHeight: 42,
    py: 0.5,
    fontSize: 15,
    fontWeight: 500,
    flex: 1,
    maxWidth: "none",
    position: "relative",
    // La línea de la pestaña activa es CSS puro: el indicador de MUI se mide con JS y se descoloca si la página tiene zoom.
    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 3,
      borderRadius: 3,
      bgcolor: "transparent",
    },
    "&.Mui-selected::after": { bgcolor: "primary.main" },
  },
  "& .MuiTabs-indicator": { display: "none" },
} satisfies SxProps<Theme>;

/** El contenido de la pestaña ocupa el resto de la tarjeta (el estado vacío se centra ahí). */
export const tabPanelSx = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
} satisfies SxProps<Theme>;
