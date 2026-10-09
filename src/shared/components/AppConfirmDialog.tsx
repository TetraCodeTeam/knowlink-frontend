import { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { OctagonAlert } from "lucide-react";
import AppButton from "@/shared/components/AppButton";

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
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

const SEVERITY_STYLES: Record<
  ConfirmDialogSeverity,
  { iconColor: string; iconBg: string; confirmVariant: "primary" | "soft-danger" }
> = {
  warning: { iconColor: "#e8890c", iconBg: "#fff4e5", confirmVariant: "primary" },
  danger: { iconColor: "#b91c1c", iconBg: "#fce8e8", confirmVariant: "soft-danger" },
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
  onConfirm,
  onCancel,
  isPending,
}: AppConfirmDialogProps) {
  const [checked, setChecked] = useState(false);
  const { iconColor, iconBg, confirmVariant } = SEVERITY_STYLES[severity];

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
      

      <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 2, px: 4 }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            bgcolor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <OctagonAlert size={32} color={iconColor} />
        </Box>

        <Typography variant="h6" fontWeight={700} mb={1}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>

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