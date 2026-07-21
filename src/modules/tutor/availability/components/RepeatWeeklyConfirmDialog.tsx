import { Box, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import { OctagonAlert } from "lucide-react";
import AppButton from "@/shared/components/AppButton";

interface RepeatWeeklyConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
  weeksAhead: number;
}

export default function RepeatWeeklyConfirmDialog({
  open,
  onConfirm,
  onCancel,
  isPending,
  weeksAhead,
}: RepeatWeeklyConfirmDialogProps) {
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
        <Box
          sx={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            bgcolor: "#fff4e5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <OctagonAlert size={38} color="#e8890c" />
        </Box>

        <Typography variant="h6" fontWeight={700} mb={1}>
          Confirmar repetición semanal
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Activaste "Repetir horarios semanalmente". Este horario se va a repetir automáticamente
          durante las próximas {weeksAhead} semanas. ¿Querés continuar?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 1.5, px: 4, pb: 3 }}>
        <AppButton appVariant="outline" onClick={onCancel} disabled={isPending} fullWidth>
          Cancelar
        </AppButton>
        <AppButton appVariant="primary" onClick={onConfirm} loading={isPending} fullWidth>
          Confirmar
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
