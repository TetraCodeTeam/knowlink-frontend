import type { SxProps, Theme } from "@mui/material/styles";
import { SUPPORT_COLORS } from "@/modules/support/constants/support-colors.constants";

export const composerContainerSx = {
  p: 1.5,
  pt: 1,
  borderTop: `1px solid ${SUPPORT_COLORS.borderSoft}`,
  bgcolor: "background.paper",
} satisfies SxProps<Theme>;

export const composerActionsSx = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 1,
  mt: 1,
} satisfies SxProps<Theme>;

export const composerButtonSx = {
  py: 0.5,
  px: 1.5,
  borderRadius: 2,
  fontSize: 14,
} satisfies SxProps<Theme>;

export const composerOpenButtonSx = {
  py: 1,
  borderRadius: 1.5,
  fontSize: 14,
} satisfies SxProps<Theme>;
