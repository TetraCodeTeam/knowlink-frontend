import { Box, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import { TriangleAlert } from "lucide-react";
import AppButton from "@/shared/components/AppButton";

interface ActivateStudentRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function ActivateStudentRoleDialog({
  open,
  onClose,
  onConfirm,
  isPending,
}: ActivateStudentRoleDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogContent sx={{ textAlign: "center", pt: 4, pb: 2, px: 4 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: "#FFF7ED",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <TriangleAlert size={30} color="#92400E" />
        </Box>
        <Typography variant="h6" fontWeight={600} mb={1}>
          ¿Activar tu perfil de alumno?
        </Typography>
        <Typography sx={{ color: "#666", fontSize: "15px" }}>
          Tu cuenta pasará a modo alumno y serás redirigido al login para continuar.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ gap: 1.5, px: 3, pb: 3 }}>
        <AppButton appVariant="outline" onClick={onClose} disabled={isPending} fullWidth>
          Cancelar
        </AppButton>
        <AppButton appVariant="primary" onClick={onConfirm} loading={isPending} fullWidth>
          Activar
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
