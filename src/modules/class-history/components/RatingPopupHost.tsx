import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import RateBookingDialog from "@/modules/class-history/components/RateBookingDialog";
import RateBookingAlreadyRatedDialog from "@/modules/class-history/components/RateBookingAlreadyRatedDialog";
import RateBookingSuccessDialog from "@/modules/class-history/components/RateBookingSuccessDialog";
import { RATING_WINDOW_HOURS } from "@/modules/class-history/constants/classHistory.constants";
import { useBookingDetail } from "@/modules/class-history/hooks/useBookingDetail";
import { useRateBooking } from "@/modules/class-history/hooks/useRateBooking";
import { useRatingPopupStore } from "@/modules/class-history/hooks/useRatingPopupStore";
import {
  hasRatedBooking,
  markBookingAsRated,
} from "@/modules/class-history/utils/ratedBookings.storage";
import {
  getRatingDeadline,
  isWithinRatingWindow,
} from "@/modules/class-history/utils/classHistory.utils";
import type { RateBookingFormValues } from "@/modules/class-history/schemas/rateBooking.schema";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";

type RatingPopupStep = "rating" | "success" | "already-rated";

export default function RatingPopupHost() {
  const bookingId = useRatingPopupStore((s) => s.bookingId);
  const close = useRatingPopupStore((s) => s.close);
  const rawRole = useAuthStore((s) => s.authResponse?.role);
  const bookingRole: BookingRole | null =
    rawRole === "STUDENT" || rawRole === "TUTOR" ? rawRole : null;
  const { detail, isError } = useBookingDetail(bookingId ?? "", Boolean(bookingId));
  const { submitRating, isPending, invalidate } = useRateBooking(bookingId ?? "");
  const [step, setStep] = useState<RatingPopupStep | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setStep(null);
      return;
    }
    setStep(hasRatedBooking(bookingId) ? "already-rated" : "rating");
  }, [bookingId]);

  useEffect(() => {
    if (bookingId && isError) {
      close();
    }
  }, [bookingId, isError, close]);

  useEffect(() => {
    if (!bookingId || !detail) return;
    if (!isWithinRatingWindow(detail.sessionDate, detail.endTime, RATING_WINDOW_HOURS)) {
      close();
      return;
    }
    const deadline = getRatingDeadline(detail.sessionDate, detail.endTime, RATING_WINDOW_HOURS);
    const timer = setTimeout(close, deadline - Date.now());
    return () => clearTimeout(timer);
  }, [bookingId, detail, close]);

  if (!bookingId || !step || !bookingRole) return null;

  const handleConfirm = async ({ score, comment }: RateBookingFormValues) => {
    if (!detail || !isWithinRatingWindow(detail.sessionDate, detail.endTime, RATING_WINDOW_HOURS)) {
      close();
      return;
    }
    try {
      await submitRating({ score, comment: comment?.trim() || null });
      markBookingAsRated(bookingId);
      setStep("success");
    } catch (err: unknown) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      if (status === 409) {
        markBookingAsRated(bookingId);
        setStep("already-rated");
        invalidate();
      }
    }
  };

  const handleSuccessClose = () => {
    invalidate();
    close();
  };

  return (
    <>
      {detail && (
        <RateBookingDialog
          open={step === "rating"}
          detail={detail}
          role={bookingRole}
          isPending={isPending}
          onConfirm={(values) => void handleConfirm(values)}
          onCancel={close}
        />
      )}
      <RateBookingSuccessDialog
        open={step === "success"}
        role={bookingRole}
        onClose={handleSuccessClose}
      />
      <RateBookingAlreadyRatedDialog open={step === "already-rated"} onClose={close} />
    </>
  );
}
