import { Dialog, DialogContent, Box, IconButton, Typography } from "@mui/material";
import { BadgeCheck, X } from "lucide-react";
import { cancelDialogIconWrapperSx } from "@/modules/class-history/styles/classHistoryStyles";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";

interface RateBookingSuccessDialogProps {
  open: boolean;
  role: BookingRole;
  onClose: () => void;
}

function getWaitingMessage(role: BookingRole): string {
  const otherPartyLabel = role === "TUTOR" ? "el alumno" : "el tutor";
  return `Podrás ver la calificación que recibiste una vez que ${otherPartyLabel} también envíe la suya. Si no lo hace dentro de las 24 horas correspondientes, no recibirás una calificación por esta sesión.`;
}

export default function RateBookingSuccessDialog({ open, role, onClose }: RateBookingSuccessDialogProps) {
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

      <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 3, px: 4, pb: 4 }}>
        <Box sx={cancelDialogIconWrapperSx("#EEEDFE")}>
          <BadgeCheck size={32} color="#2255C4" />
        </Box>

        <Typography variant="h6" fontWeight={700} mb={1}>
          Calificación enviada
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {getWaitingMessage(role)}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
