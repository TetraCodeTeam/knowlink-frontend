import { Dialog, DialogActions, DialogContent, Box, Typography } from "@mui/material";
import { BookOpen, CalendarX2, Clock, Laptop2, MapPin, User } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import {
  cancelDialogIconWrapperSx,
  cancelBookingSummaryBoxSx,
  cancelBookingSummaryRowSx,
} from "@/modules/class-history/styles/classHistoryStyles";
import {
  formatSessionDateLabel,
  formatTime,
} from "@/modules/class-history/utils/classHistory.utils";
import type { BookingHistoryDetail } from "@/modules/class-history/interfaces/responses/booking-history-detail.interface";
import type { CancellationPreview } from "@/modules/class-history/interfaces/responses/cancellation-preview.interface";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";
import type { RefundPolicy } from "@/modules/class-history/types/refund-policy.type";

interface CancelBookingConfirmDialogProps {
  open: boolean;
  detail: BookingHistoryDetail;
  role: BookingRole;
  preview: CancellationPreview | undefined;
  isPreviewLoading: boolean;
  isPreviewError: boolean;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function getNoticeMessage(role: BookingRole): string {
  return role === "TUTOR"
    ? "Esta acción no se puede deshacer. El alumno recibirá una notificación con la cancelación."
    : "Esta acción no se puede deshacer. El tutor recibirá una notificación con la cancelación.";
}

function getRefundMessage(role: BookingRole, refundPolicy: RefundPolicy): string {
  switch (refundPolicy) {
    case "REFUND_TOTAL_STUDENT":
      return role === "TUTOR"
        ? "El importe abonado será reintegrado automáticamente al alumno."
        : "El importe abonado se te reintegrará automáticamente.";
    case "TRANSFER_TOTAL_TUTOR":
      return "El importe abonado no podrá ser reintegrado, ya que la clase se cancela con poca anticipación.";
  }
}

export default function CancelBookingConfirmDialog({
  open,
  detail,
  role,
  preview,
  isPreviewLoading,
  isPreviewError,
  isPending,
  onConfirm,
  onCancel,
}: CancelBookingConfirmDialogProps) {
  const canConfirm = !isPreviewLoading && !isPreviewError && !!preview;

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, textAlign: "center", pt: 1 } }}
    >
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 2, px: 4 }}
      >
        <Box sx={cancelDialogIconWrapperSx("#fce8e8")}>
          <CalendarX2 size={32} color="#b91c1c" />
        </Box>

        <Typography variant="h6" fontWeight={700} mb={1}>
          ¿Cancelar esta clase?
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {getNoticeMessage(role)}
        </Typography>

        {isPreviewLoading ? (
          <Typography variant="body2" color="text.secondary" mt={1}>
            Cargando información de reembolso...
          </Typography>
        ) : isPreviewError || !preview ? (
          <Typography variant="body2" color="error" mt={1}>
            No se pudo cargar la información de reembolso. Intentá de nuevo.
          </Typography>
        ) : (
          preview.amount > 0 && (
            <Typography variant="body2" color="text.secondary" mt={1}>
              {getRefundMessage(role, preview.refundPolicy)}
            </Typography>
          )
        )}

        <Box sx={cancelBookingSummaryBoxSx}>
          <Box sx={cancelBookingSummaryRowSx}>
            <BookOpen size={16} color="#666" />
            <Typography sx={{ fontSize: "0.9rem", color: "#333" }}>{detail.subjectName}</Typography>
          </Box>
          <Box sx={cancelBookingSummaryRowSx}>
            <Clock size={16} color="#666" />
            <Typography sx={{ fontSize: "0.9rem", color: "#333" }}>
              {formatTime(detail.startTime)} a {formatTime(detail.endTime)} ·{" "}
              {formatSessionDateLabel(detail.sessionDate)}
            </Typography>
          </Box>
          <Box sx={cancelBookingSummaryRowSx}>
            <User size={16} color="#666" />
            <Typography sx={{ fontSize: "0.9rem", color: "#333" }}>
              {detail.otherPartyFullName}
            </Typography>
          </Box>
          <Box sx={cancelBookingSummaryRowSx}>
            {detail.modality === "VIRTUAL" ? (
              <Laptop2 size={16} color="#666" />
            ) : (
              <MapPin size={16} color="#666" />
            )}
            <Typography sx={{ fontSize: "0.9rem", color: "#333" }}>
              {detail.modality === "VIRTUAL" ? "Modalidad virtual" : "Modalidad presencial"}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 1.5, px: 4, pb: 3 }}>
        <AppButton appVariant="outline" onClick={onCancel} disabled={isPending} fullWidth>
          Volver
        </AppButton>
        <AppButton
          appVariant="soft-danger"
          onClick={onConfirm}
          loading={isPending}
          disabled={!canConfirm}
          fullWidth
        >
          Cancelar clase
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
