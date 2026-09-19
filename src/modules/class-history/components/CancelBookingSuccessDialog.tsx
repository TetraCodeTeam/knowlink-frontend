import { Dialog, DialogActions, DialogContent, Box, Typography } from "@mui/material";
import { CalendarCheck2 } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import { cancelDialogIconWrapperSx } from "@/modules/class-history/styles/classHistoryStyles";

interface CancelBookingSuccessDialogProps {
  open: boolean;
  otherPartyFullName: string;
  onClose: () => void;
}

export default function CancelBookingSuccessDialog({
  open,
  otherPartyFullName,
  onClose,
}: CancelBookingSuccessDialogProps) {
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
        <Box sx={cancelDialogIconWrapperSx("#EEEDFE")}>
          <CalendarCheck2 size={32} color="#5865C8" />
        </Box>

        <Typography variant="h6" fontWeight={700} mb={1}>
          Clase cancelada
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Le avisamos a {otherPartyFullName} que la clase fue cancelada.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", px: 4, pb: 3 }}>
        <AppButton appVariant="primary" onClick={onClose} fullWidth>
          Volver a Mis clases
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
