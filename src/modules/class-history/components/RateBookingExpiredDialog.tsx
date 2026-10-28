import { Dialog, DialogActions, DialogContent, Box, Typography } from "@mui/material";
import { TimerOff } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import { cancelDialogIconWrapperSx } from "@/modules/class-history/styles/classHistoryStyles";

interface RateBookingExpiredDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function RateBookingExpiredDialog({ open, onClose }: RateBookingExpiredDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, textAlign: "center", pt: 1 } }}
    >
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 2, px: 4 }}
      >
        <Box sx={cancelDialogIconWrapperSx("#FBF3DE")}>
          <TimerOff size={32} color="#B8860B" />
        </Box>

        <Typography variant="h6" fontWeight={700} mb={1}>
          El plazo para calificar venció
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Pasaron más de 24 horas desde que finalizó la sesión, por lo que ya no se puede calificar.
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
