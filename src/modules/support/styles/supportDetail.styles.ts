export const detailCardSx = {
  p: 1.25,
  borderRadius: 2,
  bgcolor: "#F3F4F8",
};

export const detailTileSx = {
  ...detailCardSx,
  minWidth: 0,
  flex: 1,
};

export const detailTileTitleSx = {
  fontSize: 12,
  color: "#73778A",
  mb: 0.4,
};

export const sectionLabelSx = {
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: 0.55,
  color: "#626577",
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
  bgcolor: "#F3F4F8",
  borderBottom: "1px solid #E5E7EF",
};

export const supportDetailBodySx = {
  p: 1.5,
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
  flex: 1,
  overflowY: "auto",
};

export const attachmentLinkSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.6,
  fontSize: 14,
  color: "#3549A5",
  textDecoration: "none",
  "&:hover": { textDecoration: "underline" },
};
