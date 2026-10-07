import { Dialog, DialogActions, DialogContent, Box, Typography } from "@mui/material";
import { CircleAlert } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import { cancelDialogIconWrapperSx } from "@/modules/class-history/styles/classHistoryStyles";

interface RateBookingAlreadyRatedDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function RateBookingAlreadyRatedDialog({
  open,
  onClose,
}: RateBookingAlreadyRatedDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, textAlign: "center", pt: 1 } }}
    >
      <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 2, px: 4 }}>
        <Box sx={cancelDialogIconWrapperSx("#FBF3DE")}>
          <CircleAlert size={32} color="#B8860B" />
        </Box>

        <Typography variant="h6" fontWeight={700} mb={1}>
          Ya calificaste esta sesión
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Tu calificación ya fue registrada de forma definitiva y no se puede volver a enviar ni
          modificar.
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
