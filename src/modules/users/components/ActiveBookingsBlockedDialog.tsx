import { Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import AppButton from "@/shared/components/AppButton";

interface ActiveBookingsBlockedDialogProps {
  open: boolean;
  message: string;
  onClose: () => void;
  onGoToClasses: () => void;
}

export default function ActiveBookingsBlockedDialog({
  open,
  message,
  onClose,
  onGoToClasses,
}: ActiveBookingsBlockedDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, textAlign: "center", py: 1 } }}
    >
      <DialogContent sx={{ px: 4, pt: 3, pb: 2 }}>
        <Typography variant="h6" fontWeight={700} mb={1}>
          No se puede desactivar la cuenta
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Cancelá tus reservas pendientes o esperá a que se completen para poder desactivar tu
          cuenta.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 1.5, px: 4, pb: 3 }}>
        <AppButton appVariant="outline" onClick={onClose} fullWidth>
          Cerrar
        </AppButton>
        <AppButton onClick={onGoToClasses} fullWidth>
          Ir a mis clases
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
