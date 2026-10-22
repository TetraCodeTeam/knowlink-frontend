import { SUPPORT_COLORS } from "@/modules/support/constants/support-colors.constants";

export const detailCardSx = {
  p: 1.25,
  borderRadius: 2,
  bgcolor: SUPPORT_COLORS.surface,
};

export const detailTileSx = {
  ...detailCardSx,
  minWidth: 0,
  flex: 1,
};

export const detailTileTitleSx = {
  fontSize: 12,
  color: SUPPORT_COLORS.textMuted,
  mb: 0.4,
};

export const sectionLabelSx = {
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: 0.55,
  color: SUPPORT_COLORS.textLabel,
  mb: 0.75,
  mt: 1.5,
};

export const supportDetailPanelSx = {
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  minHeight: { xs: 500, lg: 580 },
  maxHeight: { xs: "none", lg: "calc(100vh - 64px)" },
  overflow: "hidden",
  borderRadius: 3,
  boxShadow: "0 1px 4px rgba(20, 20, 60, 0.18)",
  bgcolor: "background.paper",
} as const;

export const supportDetailHeaderSx = {
  p: 2,
  bgcolor: SUPPORT_COLORS.surface,
  borderBottom: `1px solid ${SUPPORT_COLORS.border}`,
};

export const supportDetailBodySx = {
  p: 1.5,
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
  flex: 1,
  overflowY: "auto",
};

export const supportDetailTitleSx = {
  fontSize: 20,
  fontWeight: 700,
  color: SUPPORT_COLORS.primary,
  letterSpacing: 0.55,
};

export const supportDetailSubtitleSx = {
  mt: 0.25,
  fontSize: 14,
  fontWeight: 700,
  color: SUPPORT_COLORS.textHeading,
};

export const supportDetailCloseButtonSx = {
  bgcolor: "background.paper",
  color: SUPPORT_COLORS.primary,
  flexShrink: 0,
};

export const attachmentLinkSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.6,
  fontSize: 14,
  color: SUPPORT_COLORS.primary,
  textDecoration: "none",
  "&:hover": { textDecoration: "underline" },
};

export const detailAvatarSx = {
  width: 34,
  height: 34,
  bgcolor: SUPPORT_COLORS.avatarBg,
  color: SUPPORT_COLORS.avatarFg,
};

export const detailFundsNoteSx = {
  display: "flex",
  gap: 0.6,
  mt: 1,
  p: 0.75,
  bgcolor: "background.paper",
  borderRadius: 1,
};

export const detailPhaseCardSx = {
  ...detailCardSx,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 0.8,
};

export const detailSmallButtonSx = {
  py: 0.5,
  px: 1.5,
  borderRadius: 2,
  fontSize: 14,
};

export const supportLinkButtonSx = {
  fontSize: 14,
  textTransform: "none",
};
