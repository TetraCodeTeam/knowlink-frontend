import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogActions, DialogContent, Box, Typography, TextField } from "@mui/material";
import { Info, Star } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import StarRatingInput from "@/modules/class-history/components/StarRatingInput";
import { cancelDialogIconWrapperSx } from "@/modules/class-history/styles/classHistoryStyles";
import { formatSessionDateLabel } from "@/modules/class-history/utils/classHistory.utils";
import { MAX_RATING_COMMENT_LENGTH } from "@/modules/class-history/constants/classHistory.constants";
import {
  rateBookingSchema,
  type RateBookingFormValues,
} from "@/modules/class-history/schemas/rateBooking.schema";
import type { BookingHistoryDetail } from "@/modules/class-history/interfaces/responses/booking-history-detail.interface";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";

interface RateBookingDialogProps {
  open: boolean;
  detail: BookingHistoryDetail;
  role: BookingRole;
  isPending: boolean;
  onConfirm: (values: RateBookingFormValues) => void;
  onCancel: () => void;
}

function getCommentPlaceholder(role: BookingRole): string {
  return role === "STUDENT"
    ? "¿Cómo fue tu experiencia con este tutor?"
    : "¿Cómo fue tu experiencia con este alumno?";
}

const DEFAULT_VALUES: RateBookingFormValues = { score: 0, comment: "" };

export default function RateBookingDialog({
  open,
  detail,
  role,
  isPending,
  onConfirm,
  onCancel,
}: RateBookingDialogProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RateBookingFormValues>({
    resolver: zodResolver(rateBookingSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) reset(DEFAULT_VALUES);
  }, [open, reset]);

  const score = watch("score");

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, textAlign: "center", pt: 1 } }}
    >
      <Box component="form" onSubmit={handleSubmit(onConfirm)}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 2, px: 4 }}
        >
          <Box sx={cancelDialogIconWrapperSx("#FBF3DE")}>
            <Star size={32} color="#E4CF8C" />
          </Box>

          <Typography variant="h6" fontWeight={700} mb={1}>
            Calificá tu sesión
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={2}>
            {detail.subjectName} con {detail.otherPartyFullName} ·{" "}
            {formatSessionDateLabel(detail.sessionDate)}
          </Typography>

          <Controller
            name="score"
            control={control}
            render={({ field }) => (
              <StarRatingInput value={field.value} onChange={field.onChange} disabled={isPending} />
            )}
          />

          <Typography sx={{ fontSize: "0.8rem", color: errors.score ? "#b91c1c" : "#676767", mt: "6px" }}>
            {errors.score?.message ?? "Tocá una estrella para calificar"}
          </Typography>

          <Box sx={{ width: "100%", textAlign: "left", mt: "20px" }}>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 500, color: "#333", mb: "8px" }}>
              Comentario (opcional)
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              disabled={isPending}
              placeholder={getCommentPlaceholder(role)}
              error={!!errors.comment}
              helperText={errors.comment?.message}
              slotProps={{ htmlInput: { maxLength: MAX_RATING_COMMENT_LENGTH } }}
              {...register("comment")}
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
          <AppButton
            type="submit"
            appVariant="primary"
            loading={isPending}
            disabled={score === 0}
            fullWidth
          >
            Enviar
          </AppButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
