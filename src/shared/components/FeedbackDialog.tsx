import { ReactNode } from "react";
import { Button, Dialog, DialogContent, IconButton, Stack, Typography } from "@mui/material";
import { X } from "lucide-react";
import FrankieHero from "@/shared/frankie/FrankieHero";
import { MOOD_BY_KIND } from "@/shared/frankie/frankie.copy";

export type FeedbackDialogVariant = "success" | "error" | "warning" | "info";

interface FeedbackDialogProps {
  open: boolean;
  title: string;
  /** Reemplaza a Frankie por otro elemento. Normalmente no hace falta. */
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

/** Frankie reacciona según el tipo de mensaje: celebra, se compadece, avisa o cuenta. */
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
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogContent sx={{ position: "relative", px: { xs: 3, sm: 6 }, py: 4 }}>
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          sx={{ position: "absolute", top: 12, right: 12 }}
        >
          <X size={24} />
        </IconButton>

        <Stack spacing={3} alignItems="center" textAlign="center">
          {icon ?? <FrankieHero mood={MOOD_BY_KIND[variant]} size={190} />}

          <Typography variant="h4" component="h2" fontWeight={700} sx={{ color: "#1A1A2E" }}>
            {title}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480 }}>
            {description}
          </Typography>

          <Button
            variant="contained"
            color={buttonColorByVariant[variant]}
            size="large"
            onClick={onClose}
            sx={{ borderRadius: 3, px: 5 }}
          >
            {actionLabel}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
