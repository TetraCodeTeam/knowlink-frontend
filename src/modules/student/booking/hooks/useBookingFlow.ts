//hook para manejar el flujo de reserva de un slot seleccionado, incluyendo la gestión del estado de envío, confirmación y expiración de la reserva.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UseFormReset } from "react-hook-form";
import type { BookingCardProps } from "@/modules/student/booking/interfaces/bookingComponentPropsType";
import {
  DEFAULT_BOOKING_FORM_VALUES,
  type BookingFormValues,
} from "@/modules/student/booking/schemas/booking.schema";

interface UseBookingFlowProps {
  selectedSlot: BookingCardProps["selectedSlot"];
  onReserveBooking?: BookingCardProps["onReserveBooking"];
  onReleaseBooking?: BookingCardProps["onReleaseBooking"];
  onCancelSelectedSlot?: BookingCardProps["onCancelSelectedSlot"];
  reset: UseFormReset<BookingFormValues>;
}

export function useBookingFlow({
  selectedSlot,
  onReserveBooking,
  onReleaseBooking,
  onCancelSelectedSlot,
  reset,
}: UseBookingFlowProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const [isExpirationDialogOpen, setIsExpirationDialogOpen] = useState(false);
  const [isBackDialogOpen, setIsBackDialogOpen] = useState(false);

  const handleReserve = async (data: BookingFormValues) => {
    if (!selectedSlot || data.bookingSlotId !== selectedSlot.id || isSubmitting || confirmedBookingId) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onReserveBooking?.(selectedSlot, data);
      setConfirmedBookingId(selectedSlot.id);
    } catch (error) {
      await onReleaseBooking?.(selectedSlot).catch(() => undefined);
      resetDraft();
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetDraft = () => {
    setIsSubmitting(false);
    setConfirmedBookingId(null);
    reset({ ...DEFAULT_BOOKING_FORM_VALUES, bookingSlotId: selectedSlot?.id ?? "" });
  };

  const handleBookingExpired = () => {
    if (selectedSlot) {
      void onReleaseBooking?.(selectedSlot).catch(() => undefined);
    }
    resetDraft();
    setIsExpirationDialogOpen(true);
    onCancelSelectedSlot?.();
  };

  const handleBackConfirm = () => {
    if (selectedSlot) {
      void onReleaseBooking?.(selectedSlot).catch(() => undefined);
    }
    resetDraft();
    setIsBackDialogOpen(false);
    onCancelSelectedSlot?.();
    navigate("/student/home");
  };

  return {
    isSubmitting,
    isConfirmedForCurrentSlot:
      selectedSlot != null && confirmedBookingId === selectedSlot.id,
    canSubmit: !isSubmitting && !confirmedBookingId,
    isExpirationDialogOpen,
    isBackDialogOpen,
    setIsExpirationDialogOpen,
    setIsBackDialogOpen,
    handleReserve,
    handleBookingExpired,
    handleBackConfirm,
    handleFeedbackClose: () => navigate("/student/home"),
  };
}
