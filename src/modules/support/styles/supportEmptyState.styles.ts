import type { SxProps, Theme } from "@mui/material/styles";

export const emptyStateSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: 2,
  py: 2,
} satisfies SxProps<Theme>;

export const emptyIllustrationSx = {
  width: "min(100%, 360px)",
  height: "auto",
} satisfies SxProps<Theme>;

export const emptyTitleSx = { fontSize: 22, fontWeight: 500 } satisfies SxProps<Theme>;

export const emptyDescriptionSx = {
  fontSize: 16,
  color: "text.secondary",
  maxWidth: 360,
} satisfies SxProps<Theme>;
