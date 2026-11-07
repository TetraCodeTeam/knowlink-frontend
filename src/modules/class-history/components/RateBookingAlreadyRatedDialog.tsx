import { Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import AppButton from "@/shared/components/AppButton";
import FrankieHero from "@/shared/frankie/FrankieHero";

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
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 2, px: 4 }}
      >
        <FrankieHero mood="happy" accessories={["sparkles"]} />

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
