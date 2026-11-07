import { Dialog, DialogActions, DialogContent, IconButton, Typography } from "@mui/material";
import { X } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import FrankieHero from "@/shared/frankie/FrankieHero";

interface ClaimBlockedDialogProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export default function ClaimBlockedDialog({ open, message, onClose }: ClaimBlockedDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, textAlign: "center", pt: 1, position: "relative" } }}
    >
      <IconButton
        onClick={onClose}
        size="small"
        aria-label="Cerrar"
        sx={{ position: "absolute", top: "12px", right: "12px" }}
      >
        <X size={20} />
      </IconButton>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 3,
          px: 4,
          pb: 4,
        }}
      >
        <FrankieHero mood="worried" style={{ marginInline: "auto" }} />

        <Typography variant="h6" fontWeight={700} mb={1}>
          No podés iniciar un reclamo
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", px: 4, pb: 3 }}>
        <AppButton appVariant="outline" onClick={onClose} fullWidth>
          Volver
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
