import type { SxProps, Theme } from "@mui/material/styles";

export const composerContainerSx = {
  p: 1.5,
  pt: 1,
  borderTop: "1px solid #E9EAF0",
  bgcolor: "background.paper",
} satisfies SxProps<Theme>;

export const composerActionsSx = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 1,
  mt: 1,
} satisfies SxProps<Theme>;

export const composerCancelButtonSx = {
  textTransform: "none",
  fontSize: 14,
} satisfies SxProps<Theme>;

export const composerSubmitButtonSx = {
  bgcolor: "#293E9D",
  textTransform: "none",
  fontSize: 14,
} satisfies SxProps<Theme>;

export const composerOpenButtonSx = {
  bgcolor: "#293E9D",
  borderRadius: 1.5,
  textTransform: "none",
  fontSize: 14,
} satisfies SxProps<Theme>;
