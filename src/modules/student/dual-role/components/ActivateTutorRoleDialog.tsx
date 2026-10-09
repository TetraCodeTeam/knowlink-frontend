import { Box, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import { TriangleAlert } from "lucide-react";
import AppButton from "@/shared/components/AppButton";

interface ActivateTutorRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ActivateTutorRoleDialog({
  open,
  onClose,
  onConfirm,
}: ActivateTutorRoleDialogProps) {
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
          ¿Activar tu perfil de tutor?
        </Typography>
        <Typography sx={{ color: "#666", fontSize: "15px"}}>
          Completarás información adicional para activar tu rol de tutor en la plataforma.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ gap: 1.5, px: 3, pb: 3 }}>
        <AppButton appVariant="outline" onClick={onClose} fullWidth>
          Cancelar
        </AppButton>
        <AppButton appVariant="primary" onClick={onConfirm} fullWidth>
          Continuar
        </AppButton>
      </DialogActions>
    </Dialog>
  );  
}
