import { ReactNode } from "react";
import { Button, Dialog, DialogContent, IconButton, Stack, Typography } from "@mui/material";
import { X } from "lucide-react";
import { SuccessAnimation } from "./SuccessAnimation";

export type FeedbackDialogVariant = "success" | "error" | "warning" | "info";

interface FeedbackDialogProps {
  open: boolean;
  title: string;
  icon?: ReactNode;
  description: string;
  onClose: () => void;
  variant?: FeedbackDialogVariant;
  actionLabel?: string;
}

const buttonColorByVariant: Record<
  FeedbackDialogVariant,
  "primary" | "error" | "warning" | "info"
> = {
  success: "primary",
  error: "error",
  warning: "warning",
  info: "info",
};

export function FeedbackDialog({
  open,
  title,
  icon,
  description,
  onClose,
  variant = "success",
  actionLabel = "Cerrar",
}: FeedbackDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "rounded-3xl",
      }}
    >
      <DialogContent className="relative px-10 py-8">
        <IconButton aria-label="Close dialog" onClick={onClose} className="!absolute right-4 top-4">
          <X size={28} />
        </IconButton>

        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography variant="h3" component="h2" fontWeight={500}>
            {title}
          </Typography>

          <div className="flex items-center justify-center">
            {icon ?? (variant === "success" && <SuccessAnimation />)}
          </div>

          <Typography
            variant="body1"
            color="text.secondary"
            className="max-w-lg"
            sx={{
              textAlign: "justify",
              textJustify: "inter-word", // opcional
            }}
          >
            {description}
          </Typography>

          <Button
            variant="contained"
            color={buttonColorByVariant[variant]}
            size="large"
            onClick={onClose}
            className="!rounded-xl !px-10"
          >
            {actionLabel}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
