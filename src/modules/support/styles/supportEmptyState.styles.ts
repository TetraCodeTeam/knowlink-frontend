import type { SxProps, Theme } from "@mui/material/styles";

export const emptyStateSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  flex: 1,
  gap: 1,
  py: 2,
} satisfies SxProps<Theme>;

export const emptyIllustrationSx = {
  width: "min(100%, 250px)",
  height: "auto",
} satisfies SxProps<Theme>;

export const emptyTitleSx = { fontSize: 18, fontWeight: 500 } satisfies SxProps<Theme>;

export const emptyDescriptionSx = {
  fontSize: 14,
  color: "text.secondary",
  maxWidth: 360,
} satisfies SxProps<Theme>;
