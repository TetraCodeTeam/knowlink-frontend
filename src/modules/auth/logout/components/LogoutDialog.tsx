import { Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import AppButton from "@/shared/components/AppButton";

interface LogoutDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function LogoutDialog({ open, onClose, onConfirm, isPending }: LogoutDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, textAlign: "center", py: 1 } }}
    >
      <DialogContent sx={{ px: 4, pt: 3, pb: 2 }}>
        <Typography variant="h6" fontWeight={700} mb={1}>
          ¿Cerrar sesión?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Vas a tener que iniciar sesión nuevamente para acceder a tu cuenta.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 1.5, px: 4, pb: 3 }}>
        <AppButton appVariant="outline" onClick={onClose} disabled={isPending} fullWidth>
          Cancelar
        </AppButton>
        <AppButton appVariant="soft-danger" onClick={onConfirm} loading={isPending} fullWidth>
          Salir
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
