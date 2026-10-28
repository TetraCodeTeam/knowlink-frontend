import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useResolveRatingNotification } from "@/modules/notifications/hooks/useResolveRatingNotification";
import RateBookingDialog from "@/modules/class-history/components/RateBookingDialog";
import RateBookingAlreadyRatedDialog from "@/modules/class-history/components/RateBookingAlreadyRatedDialog";
import RateBookingExpiredDialog from "@/modules/class-history/components/RateBookingExpiredDialog";
import RateBookingSuccessDialog from "@/modules/class-history/components/RateBookingSuccessDialog";
import { useBookingDetail } from "@/modules/class-history/hooks/useBookingDetail";
import { useRateBooking } from "@/modules/class-history/hooks/useRateBooking";
import { useRatingPopupStore } from "@/modules/class-history/hooks/useRatingPopupStore";
import type { RateBookingFormValues } from "@/modules/class-history/schemas/rateBooking.schema";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";
import type { ErrorResponse } from "@/shared/interfaces/error-response.interface";

type RatingPopupStep = "rating" | "success" | "already-rated" | "expired";

export default function RatingPopupHost() {
  const bookingId = useRatingPopupStore((s) => s.bookingId);
  const close = useRatingPopupStore((s) => s.close);
  const rawRole = useAuthStore((s) => s.authResponse?.role);
  const bookingRole: BookingRole | null =
    rawRole === "STUDENT" || rawRole === "TUTOR" ? rawRole : null;
  const { detail, isError } = useBookingDetail(bookingId ?? "", Boolean(bookingId));
  const { submitRating, isPending, invalidate } = useRateBooking(bookingId ?? "");
  const { resolve } = useResolveRatingNotification();
  const [step, setStep] = useState<RatingPopupStep | null>(null);

  useEffect(() => {
    setStep(null);
  }, [bookingId]);

  useEffect(() => {
    if (!bookingId || !detail) return;
    if (step === "success" || step === "already-rated" || step === "expired") return;

    switch (detail.ratingStatus) {
      case "PENDING":
        setStep("rating");
        break;
      case "SUBMITTED":
        setStep("already-rated");
        break;
      case "EXPIRED":
        setStep("expired");
        break;
      case "NOT_AVAILABLE":
        close();
        break;
    }
  }, [bookingId, detail, step, close]);

  useEffect(() => {
    if (step !== "rating" || !detail || detail.ratingStatus !== "PENDING") return;
    if (!detail.ratingDeadline) return;

    const delay = new Date(detail.ratingDeadline).getTime() - Date.now();
    if (delay <= 0) {
      setStep("expired");
      return;
    }

    const timer = setTimeout(() => setStep("expired"), delay);
    return () => clearTimeout(timer);
  }, [step, detail]);

  useEffect(() => {
    if (bookingId && isError) {
      close();
    }
  }, [bookingId, isError, close]);

  if (!bookingId || !step || !bookingRole) return null;

  const handleConfirm = async ({ score, comment }: RateBookingFormValues) => {
    try {
      await submitRating({ score, comment: comment?.trim() || null });
      setStep("success");
    } catch (err: unknown) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      if (status === 409) {
        setStep("already-rated");
        invalidate();
        resolve(bookingId);
        return;
      }
      if (
        status === 422 &&
        axios.isAxiosError<ErrorResponse>(err) &&
        err.response?.data?.detail === "RATING_WINDOW_EXPIRED"
      ) {
        setStep("expired");
        invalidate();
      }
    }
  };

  const handleSuccessClose = () => {
    invalidate();
    resolve(bookingId);
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
      <RateBookingExpiredDialog open={step === "expired"} onClose={close} />
    </>
  );
}
