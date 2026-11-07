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
