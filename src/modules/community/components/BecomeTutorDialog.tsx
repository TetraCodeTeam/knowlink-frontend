import { Box, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import { GraduationCap } from "lucide-react";
import AppButton from "@/shared/components/AppButton";

interface BecomeTutorDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function BecomeTutorDialog({ open, onCancel, onConfirm }: BecomeTutorDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px", textAlign: "center" } }}
      aria-labelledby="become-tutor-title"
    >
      <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 4 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: "#EDEBFA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <GraduationCap size={30} color="#5B6ED9" aria-hidden />
        </Box>
        <Typography id="become-tutor-title" sx={{ fontSize: 20, fontWeight: 700, mb: 1 }}>
          Te redirigiremos a tu perfil
        </Typography>
        <Typography sx={{ fontSize: 14.5, color: "#555" }}>
          Desde ahí vas a poder gestionar tu rol de tutor en KnowLink.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 1.5, px: 3, pb: 3 }}>
        <AppButton appVariant="outline" onClick={onCancel} fullWidth>
          Cancelar
        </AppButton>
        <AppButton onClick={onConfirm} fullWidth>
          Ir al perfil
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
