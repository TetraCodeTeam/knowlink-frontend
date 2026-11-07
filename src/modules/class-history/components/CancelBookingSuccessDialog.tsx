import { Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import AppButton from "@/shared/components/AppButton";
import type { BookingCancellationResponse } from "@/modules/class-history/interfaces/responses/booking-cancellation-response.interface";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";
import type { RefundPolicy } from "@/modules/class-history/types/refund-policy.type";
import FrankieHero from "@/shared/frankie/FrankieHero";

interface CancelBookingSuccessDialogProps {
  open: boolean;
  otherPartyFullName: string;
  role: BookingRole;
  cancellationResult: BookingCancellationResponse | undefined;
  onClose: () => void;
}

function getRefundResultMessage(role: BookingRole, refundPolicy: RefundPolicy): string {
  switch (refundPolicy) {
    case "REFUND_TOTAL_STUDENT":
      return role === "TUTOR"
        ? "El importe abonado fue reintegrado automáticamente al alumno."
        : "El importe abonado te fue reintegrado automáticamente.";
    case "TRANSFER_TOTAL_TUTOR":
      return "El importe abonado no fue reintegrado, ya que la clase se canceló con poca anticipación.";
  }
}

export default function CancelBookingSuccessDialog({
  open,
  otherPartyFullName,
  role,
  cancellationResult,
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
        <FrankieHero mood="happy" accessories={[]} />

        <Typography variant="h6" fontWeight={700} mb={1}>
          Clase cancelada
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Le avisamos a {otherPartyFullName} que la clase fue cancelada.
        </Typography>

        {cancellationResult && cancellationResult.amount > 0 && (
          <Typography variant="body2" color="text.secondary" mt={1}>
            {getRefundResultMessage(role, cancellationResult.refundPolicy)}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", px: 4, pb: 3 }}>
        <AppButton appVariant="primary" onClick={onClose} fullWidth>
          Volver al historial de clases
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
