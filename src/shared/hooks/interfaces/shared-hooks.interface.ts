import type { ReactNode } from "react";
import type { FeedbackDialogVariant } from "@/shared/components/interfaces/shared-components.interface";

export interface FeedbackDialogOptions {
  title: string;
  description: string;
  variant?: FeedbackDialogVariant;
  icon?: ReactNode;
  actionLabel?: string;
}
