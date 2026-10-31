import type { SxProps, Theme } from "@mui/material/styles";
import { STATISTICS_COLORS } from "@/modules/tutor/statistics/constants/statistics-colors.constants";

export const pageSx = {
  p: { xs: 2, md: 4 },
  display: "flex",
  flexDirection: "column",
  gap: 3,
} satisfies SxProps<Theme>;

export const headerSx = {
  display: "flex",
  flexDirection: { xs: "column", lg: "row" },
  alignItems: { xs: "flex-start", lg: "flex-start" },
  justifyContent: "space-between",
  gap: 2,
} satisfies SxProps<Theme>;

export const pageTitleSx = {
  fontSize: { xs: 26, md: 32 },
  fontWeight: 600,
  color: STATISTICS_COLORS.textStrong,
  lineHeight: 1.2,
} satisfies SxProps<Theme>;

export const pageSubtitleSx = {
  fontSize: 15,
  color: STATISTICS_COLORS.textMuted,
  mt: 0.5,
} satisfies SxProps<Theme>;

export const periodCaptionSx = {
  fontSize: 13,
  color: STATISTICS_COLORS.textMuted,
  mt: 1,
} satisfies SxProps<Theme>;

export const cardSx = {
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: "0 1px 4px rgba(20, 20, 60, 0.12)",
  p: 3,
  minWidth: 0,
} satisfies SxProps<Theme>;

export const cardTitleSx = {
  fontSize: 18,
  fontWeight: 600,
  color: STATISTICS_COLORS.textStrong,
} satisfies SxProps<Theme>;

export const cardHeaderSx = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 2,
  mb: 2,
} satisfies SxProps<Theme>;

export const mutedTextSx = {
  fontSize: 13,
  color: STATISTICS_COLORS.textMuted,
} satisfies SxProps<Theme>;

export const rowGridSx = (columns: { md: number; lg: number }): SxProps<Theme> => ({
  display: "grid",
  gap: 3,
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    md: `repeat(${columns.md}, minmax(0, 1fr))`,
    lg: `repeat(${columns.lg}, minmax(0, 1fr))`,
  },
});

export const insetTileSx = {
  bgcolor: STATISTICS_COLORS.surface,
  borderRadius: 2,
  px: 2,
  py: 1.5,
} satisfies SxProps<Theme>;
