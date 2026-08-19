import { Box, Divider, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import AppButton from "@/shared/components/AppButton";
import BookingModalityToggle from "@/modules/student/booking/components/BookingModalityToggle";
import BookingPricingRow from "@/modules/student/booking/components/BookingPricingRow";
import BookingSlotSelectionSummary from "@/modules/student/booking/components/BookingSlotSelectionSummary";
import { MapPin } from "lucide-react";
import BookingCountdownTimer from "./BookingTimer";
import AppConfirmDialog from "@/shared/components/AppConfirmDialog";
import { FeedbackDialog } from "@/shared/components/FeedbackDialog";
import { currencyFormatter } from "@/shared/utils/currency.utils";
import { BOOKING_MODALITY_LABEL } from "@/modules/student/booking/constants/modality.constants";
import type { BookingCardProps } from "@/modules/student/booking/interfaces/bookingComponentPropsType";
import { useBookingFlow } from "@/modules/student/booking/hooks/useBookingFlow";
import { useBookingForm } from "@/modules/student/booking/hooks/useBookingForm";

export default function BookingCard({
  selectedSlot = null,
  onCancelSelectedSlot,
}: BookingCardProps) {
  const bookingForm = useBookingForm(selectedSlot);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
    subjects,
    modality,
    selectedSubject,
    availableModalities,
    pricing,
    handleSubjectChange,
  } = bookingForm;
  const {
    isSubmitting,
    isConfirmedForCurrentSlot,
    canSubmit,
    isExpirationDialogOpen,
    isBackDialogOpen,
    setIsExpirationDialogOpen,
    setIsBackDialogOpen,
    handleReserve,
    handleBookingExpired,
    handleBackConfirm,
    handleFeedbackClose,
  } = useBookingFlow({
    selectedSlot,
    onCancelSelectedSlot,
    reset,
  });

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit(handleReserve)}
      elevation={0}
      sx={{
        width: 350,
        p: 4,
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Reserva una clase
      </Typography>

      {selectedSlot && (
        <BookingCountdownTimer
          key={selectedSlot.id}
          durationSeconds={15 * 60}
          onExpire={handleBookingExpired}
        />
      )}

      <BookingSlotSelectionSummary slot={selectedSlot} />
      {errors.bookingSlotId && (
        <Typography variant="caption" sx={{ color: "error.main" }}>
          {errors.bookingSlotId.message}
        </Typography>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 550 }}>
          Materia
        </Typography>
        <Controller
          name="subjectId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              onChange={(event) => handleSubjectChange(event.target.value)}
              displayEmpty
              size="small"
              sx={{ borderRadius: 2, fontSize: "14px", color: "#494949" }}
              error={Boolean(errors.subjectId)}
            >
              <MenuItem value="" disabled>
                Selecciona la materia
              </MenuItem>
              {subjects.map((subject) => (
                <MenuItem
                  key={subject.id}
                  value={subject.id}
                  sx={{ fontSize: "14px", color: "#494949" }}
                >
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.subjectId && (
          <Typography variant="caption" sx={{ color: "error.main" }}>
            {errors.subjectId.message}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 550 }}>
          Tema a tratar
        </Typography>
        <TextField
          {...register("topic")}
          placeholder="Ingresa el tema a tratar para que el tutor esté lo más preparado posible"
          multiline
          minRows={3}
          size="small"
          error={Boolean(errors.topic)}
          helperText={errors.topic?.message}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: 2 },
            "& .MuiInputBase-input::placeholder": { fontSize: "14px" },
            "& .MuiInputBase-input": { fontSize: "14px" },
          }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 550 }}>
          Modalidad
        </Typography>
        <Controller
          name="modality"
          control={control}
          render={({ field }) => (
            <BookingModalityToggle
              value={field.value}
              onChange={field.onChange}
              availableModalities={availableModalities}
            />
          )}
        />
        {errors.modality && (
          <Typography variant="caption" sx={{ color: "error.main" }}>
            {errors.modality.message}
          </Typography>
        )}
        {availableModalities.length === 1 && (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            *El tutor solo ofrece clases {BOOKING_MODALITY_LABEL[availableModalities[0]].toLowerCase()}
            es para esta materia.
          </Typography>
        )}

        {modality === "IN_PERSON" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 0.5,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "#f7f7fb",
              border: "1px solid #ececf4",
            }}
          >
            <MapPin size={16} color="#8a8aa3" style={{ flexShrink: 0 }} />
            <Typography
              variant="body2"
              sx={{
                color: selectedSubject?.address ? "#494949" : "text.secondary",
                fontSize: 14,
                fontStyle: selectedSubject?.address ? "normal" : "italic",
              }}
            >
              {selectedSubject?.address ?? "Ubicación a coordinar con el tutor"}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <BookingPricingRow
          label="Tarifa por hora"
          value={pricing?.total === 0 ? "Gratis" : pricing?.hourlyRate}
          formatter={currencyFormatter}
          valueColor={pricing?.total === 0 ? "text.secondary" : undefined}
        />
        {pricing && pricing.total !== 0 && (
          <BookingPricingRow
            label="Tarifa de servicio (3%)"
            value={pricing.serviceFee}
            formatter={currencyFormatter}
          />
        )}
        <Divider sx={{ my: 0.5 }} />
        <BookingPricingRow
          label="Total"
          value={pricing?.total === 0 ? "Gratis" : pricing?.total}
          formatter={currencyFormatter}
          emphasized
          valueColor={pricing?.total === 0 ? "primary.main" : undefined}
        />
      </Box>

      <FeedbackDialog
        open={isConfirmedForCurrentSlot}
        title="Reserva confirmada"
        description="Tu clase quedó registrada con éxito."
        variant="success"
        onClose={handleFeedbackClose}
      />

      <AppButton
        type="submit"
        appVariant="primary"
        disabled={!canSubmit}
        loading={isSubmitting}
        fullWidth
      >
        {isConfirmedForCurrentSlot ? "Reservado" : "Reservar"}
      </AppButton>

      <AppButton appVariant="outline" onClick={() => setIsBackDialogOpen(true)} fullWidth>
        Volver
      </AppButton>

      <AppConfirmDialog
        open={isBackDialogOpen}
        title="¿Volver y cancelar la reserva?"
        message="Si decidís volver, se eliminarán todas las selecciones que hiciste para esta reserva."
        severity="warning"
        confirmLabel="Volver"
        cancelLabel="Continuar reserva"
        onConfirm={handleBackConfirm}
        onCancel={() => setIsBackDialogOpen(false)}
        isPending={false}
      />

      <AppConfirmDialog
        open={isExpirationDialogOpen}
        title="Reserva expirada"
        message="Se canceló tu selección porque se agotó el tiempo para completar la reserva. Elige otro horario para continuar."
        severity="warning"
        confirmLabel="Aceptar"
        cancelLabel="Cerrar"
        onConfirm={() => setIsExpirationDialogOpen(false)}
        onCancel={() => setIsExpirationDialogOpen(false)}
        isPending={false}
      />
    </Paper>
  );
}
