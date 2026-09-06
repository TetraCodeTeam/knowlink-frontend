import { Button, CircularProgress } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import {
  primaryButtonSx,
  softButtonSx,
  softDangerButtonSx,
  outlineButtonSx,
} from "@/shared/styles/buttonSx";
import type { AppButtonProps, AppButtonVariant } from "./interfaces/shared-components.interface";

export type { AppButtonProps, AppButtonVariant } from "./interfaces/shared-components.interface";

const variantStyles: Record<AppButtonVariant, SxProps<Theme>> = {
  primary: primaryButtonSx,
  soft: softButtonSx,
  "soft-danger": softDangerButtonSx,
  outline: outlineButtonSx,
};

export default function AppButton({
  appVariant = "primary",
  loading = false,
  disabled,
  children,
  sx,
  ...props
}: AppButtonProps) {
  return (
    <Button
      variant="contained"
      disableElevation
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : props.startIcon}
      sx={[
        variantStyles[appVariant],
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    >
      {children}
    </Button>
  );
}