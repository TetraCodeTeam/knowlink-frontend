import { useEffect, useState, type ReactNode } from "react";
import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Typography,
} from "@mui/material";
import AppButton from "@/shared/components/AppButton";
import FrankieHero from "@/shared/frankie/FrankieHero";
import type { FrankieMood } from "@/shared/frankie/frankie.types";

type ConfirmDialogSeverity = "warning" | "danger";

interface AppConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  severity?: ConfirmDialogSeverity;
  confirmLabel?: string;
  cancelLabel?: string;
  requireCheckbox?: boolean;
  checkboxLabel?: string;
  /** Contenido adicional entre el mensaje y las acciones (ej. un campo de texto). */
  content?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

/**
 * Frankie acompaña la decisión: ante una acción corriente duda ("¿seguro?") y ante una
 * irreversible se preocupa, para que el usuario frene un segundo antes de confirmar.
 */
const SEVERITY_STYLES: Record<
  ConfirmDialogSeverity,
  { mood: FrankieMood; confirmVariant: "primary" | "soft-danger" }
> = {
  warning: { mood: "thinking", confirmVariant: "primary" },
  danger: { mood: "worried", confirmVariant: "soft-danger" },
};

export default function AppConfirmDialog({
  open,
  title,
  message,
  severity = "warning",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  requireCheckbox = false,
  checkboxLabel = "Entiendo que esta acción es permanente y no se puede revertir",
  content,
  onConfirm,
  onCancel,
  isPending,
}: AppConfirmDialogProps) {
  const [checked, setChecked] = useState(false);
  const { mood, confirmVariant } = SEVERITY_STYLES[severity];

  useEffect(() => {
    if (open) setChecked(false);
  }, [open]);

  const confirmDisabled = requireCheckbox && !checked;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, textAlign: "center", pt: 1 } }}
    >
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 2, px: 4 }}
      >
        <FrankieHero mood={mood} />

        <Typography variant="h6" fontWeight={700} mb={1}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>

        {content && <Box sx={{ width: "100%", mt: 2, textAlign: "left" }}>{content}</Box>}

        {requireCheckbox && (
          <FormControlLabel
            sx={{ mt: 2, textAlign: "left" }}
            control={
              <Checkbox
                checked={checked}
                onChange={(_, val) => setChecked(val)}
                disabled={isPending}
                size="small"
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                {checkboxLabel}
              </Typography>
            }
          />
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 1.5, px: 4, pb: 3 }}>
        <AppButton appVariant="outline" onClick={onCancel} disabled={isPending} fullWidth>
          {cancelLabel}
        </AppButton>
        <AppButton
          appVariant={confirmVariant}
          onClick={onConfirm}
          loading={isPending}
          disabled={confirmDisabled}
          fullWidth
        >
          {confirmLabel}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
