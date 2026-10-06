import { Dialog, DialogActions, DialogContent, Box, Typography, TextField } from "@mui/material";
import { Info, Star } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import StarRatingInput from "@/modules/class-history/components/StarRatingInput";
import { cancelDialogIconWrapperSx } from "@/modules/class-history/styles/classHistoryStyles";
import { formatSessionDateLabel } from "@/modules/class-history/utils/classHistory.utils";
import { MAX_RATING_COMMENT_LENGTH } from "@/modules/class-history/constants/classHistory.constants";
import type { BookingHistoryDetail } from "@/modules/class-history/interfaces/responses/booking-history-detail.interface";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";

interface RateBookingDialogProps {
  open: boolean;
  detail: BookingHistoryDetail;
  role: BookingRole;
  score: number;
  comment: string;
  isPending: boolean;
  onScoreChange: (score: number) => void;
  onCommentChange: (comment: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function getCommentPlaceholder(role: BookingRole): string {
  return role === "STUDENT"
    ? "¿Cómo fue tu experiencia con este tutor?"
    : "¿Cómo fue tu experiencia con este alumno?";
}

export default function RateBookingDialog({
  open,
  detail,
  role,
  score,
  comment,
  isPending,
  onScoreChange,
  onCommentChange,
  onConfirm,
  onCancel,
}: RateBookingDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, textAlign: "center", pt: 1 } }}
    >
      <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 2, px: 4 }}>
        <Box sx={cancelDialogIconWrapperSx("#FBF3DE")}>
          <Star size={32} color="#E4CF8C" />
        </Box>

        <Typography variant="h6" fontWeight={700} mb={1}>
          Calificá tu sesión
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {detail.subjectName} con {detail.otherPartyFullName} · {formatSessionDateLabel(detail.sessionDate)}
        </Typography>

        <StarRatingInput value={score} onChange={onScoreChange} disabled={isPending} />

        <Typography sx={{ fontSize: "0.8rem", color: "#676767", mt: "6px" }}>
          Tocá una estrella para calificar
        </Typography>

        <Box sx={{ width: "100%", textAlign: "left", mt: "20px" }}>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 500, color: "#333", mb: "8px" }}>
            Comentario (opcional)
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={comment}
            disabled={isPending}
            onChange={(e) => onCommentChange(e.target.value.slice(0, MAX_RATING_COMMENT_LENGTH))}
            placeholder={getCommentPlaceholder(role)}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mt: "10px", width: "100%" }}>
          <Info size={14} color="#676767" />
          <Typography sx={{ fontSize: "0.8rem", color: "#676767" }}>
            No vas a poder modificarla una vez enviada
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 1.5, px: 4, pb: 3 }}>
        <AppButton appVariant="outline" onClick={onCancel} disabled={isPending} fullWidth>
          Cancelar
        </AppButton>
        <AppButton appVariant="primary" onClick={onConfirm} loading={isPending} disabled={score === 0} fullWidth>
          Enviar
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
