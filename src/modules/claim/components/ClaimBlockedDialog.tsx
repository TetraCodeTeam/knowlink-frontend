import { Dialog, DialogActions, DialogContent, Box, IconButton, Typography } from "@mui/material";
import { CircleAlert, X } from "lucide-react";
import AppButton from "@/shared/components/AppButton";

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
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            bgcolor: "#FBF3DE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <CircleAlert size={30} color="#B8860B" />
        </Box>

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
