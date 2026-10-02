import type { ButtonProps } from "@mui/material";
import type { ReactNode } from "react";

export type AppButtonVariant = "primary" | "soft" | "soft-danger" | "outline";

export interface AppButtonProps extends Omit<ButtonProps, "variant" | "color"> {
  appVariant?: AppButtonVariant;
  loading?: boolean;
  children: ReactNode;
}

export type FeedbackDialogVariant = "success" | "error" | "warning" | "info";

export interface FeedbackDialogProps {
  open: boolean;
  title: string;
  icon?: ReactNode;
  description: string;
  onClose: () => void;
  variant?: FeedbackDialogVariant;
  actionLabel?: string;
}

export type ConfirmDialogSeverity = "warning" | "danger";

export interface AppConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  severity?: ConfirmDialogSeverity;
  confirmLabel?: string;
  cancelLabel?: string;
  requireCheckbox?: boolean;
  checkboxLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export interface EmptyStateProps {
  image?: string;
  imageAlt?: string;
  icon?: ReactNode;
  message: string;
}
