import type { SxProps, Theme } from "@mui/material/styles";
import { cardBase } from "@/modules/support/styles/supportShared.styles";

export const pageLayoutSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "minmax(0, 1fr) minmax(250px, 0.85fr)",
    lg: "minmax(0, 1fr) 340px",
  },
  gap: 3,
  alignItems: "stretch",
  p: 4,
} satisfies SxProps<Theme>;

export const mainCardSx = {
  ...cardBase,
  p: { xs: 2.5, md: 4 },
  minHeight: { xs: 480, lg: 580 },
} satisfies SxProps<Theme>;

export const pageTitleSx = {
  fontSize: { xs: 26, md: 32 },
  fontWeight: 500,
  color: "text.primary",
  mb: 2,
} satisfies SxProps<Theme>;

export const tabsSx = {
  borderBottom: 1,
  borderColor: "divider",
  mb: 4,
  "& .MuiTab-root": {
    textTransform: "none",
    fontSize: 18,
    fontWeight: 500,
    flex: 1,
    maxWidth: "none",
  },
  "& .MuiTabs-indicator": { height: 3, borderRadius: 3 },
} satisfies SxProps<Theme>;
