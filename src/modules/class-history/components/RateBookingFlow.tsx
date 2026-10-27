import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import RateBookingButton from "@/modules/class-history/components/RateBookingButton";
import RateBookingDialog from "@/modules/class-history/components/RateBookingDialog";
import RateBookingSuccessDialog from "@/modules/class-history/components/RateBookingSuccessDialog";
import RateBookingAlreadyRatedDialog from "@/modules/class-history/components/RateBookingAlreadyRatedDialog";
import RateBookingExpiredDialog from "@/modules/class-history/components/RateBookingExpiredDialog";
import { useRateBooking } from "@/modules/class-history/hooks/useRateBooking";
import { useResolveRatingNotification } from "@/modules/notifications/hooks/useResolveRatingNotification";
import type { RateBookingFormValues } from "@/modules/class-history/schemas/rateBooking.schema";
import type { BookingHistoryDetail } from "@/modules/class-history/interfaces/responses/booking-history-detail.interface";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";
import type { ErrorResponse } from "@/shared/interfaces/error-response.interface";

interface RateBookingFlowProps {
  detail: BookingHistoryDetail;
  role: BookingRole;
}

type RateBookingStep = "closed" | "rating" | "success" | "already-rated" | "expired";

export default function RateBookingFlow({ detail, role }: RateBookingFlowProps) {
  const [step, setStep] = useState<RateBookingStep>("closed");
  const [deadlinePassed, setDeadlinePassed] = useState(false);
  const [, forceRerender] = useReducer((n: number) => n + 1, 0);
  const { submitRating, isPending, invalidate } = useRateBooking(detail.bookingId);
  const { resolve } = useResolveRatingNotification();
  const deadline = detail.ratingDeadline ? new Date(detail.ratingDeadline).getTime() : null;

  useEffect(() => {
    setDeadlinePassed(false);
  }, [detail.bookingId, detail.ratingDeadline]);

  useEffect(() => {
    if (detail.ratingStatus !== "PENDING" || deadline === null) return;

    const msUntilDeadline = deadline - Date.now();
    if (msUntilDeadline <= 0) {
      setDeadlinePassed(true);
      setStep((current) => (current === "rating" ? "expired" : current));
      return;
    }

    const timer = setTimeout(() => {
      setDeadlinePassed(true);
      setStep((current) => (current === "rating" ? "expired" : current));
      forceRerender();
      invalidate();
    }, msUntilDeadline);
    return () => clearTimeout(timer);
  }, [detail.ratingStatus, deadline, invalidate]);

  useEffect(() => {
    if (step !== "rating") return;
    if (detail.ratingStatus === "SUBMITTED") {
      setStep("already-rated");
    } else if (detail.ratingStatus === "EXPIRED") {
      setStep("expired");
    }
  }, [detail.ratingStatus, step]);

  const canRate =
    detail.ratingStatus === "PENDING" &&
    !deadlinePassed &&
    (deadline === null || Date.now() < deadline);

  const handleOpen = () => {
    if (!canRate) return;
    setStep("rating");
  };

  const handleConfirm = async ({ score, comment }: RateBookingFormValues) => {
    try {
      await submitRating({ score, comment: comment?.trim() || null });
      setStep("success");
    } catch (err: unknown) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      if (status === 409) {
        // 409 is the documented "already rated" conflict. Other error codes
        // (e.g. 422 validation errors) are not duplicate-rating signals and
        // must not be treated as if the booking were already rated.
        setStep("already-rated");
        invalidate();
        resolve(detail.bookingId);
        return;
      }
      if (
        status === 422 &&
        axios.isAxiosError<ErrorResponse>(err) &&
        err.response?.data?.detail === "RATING_WINDOW_EXPIRED"
      ) {
        setStep("expired");
        invalidate();
        return;
      }
      // Other errors (network, 5xx, validation): the httpClient interceptor
      // already showed an error toast; keep the rating dialog open to retry.
    }
  };

  const handleCloseSuccess = () => {
    setStep("closed");
    invalidate();
    resolve(detail.bookingId);
  };

  return (
    <>
      {canRate && <RateBookingButton onClick={handleOpen} />}

      <RateBookingDialog
        open={step === "rating"}
        detail={detail}
        role={role}
        isPending={isPending}
        onConfirm={(values) => void handleConfirm(values)}
        onCancel={() => setStep("closed")}
      />

      <RateBookingSuccessDialog
        open={step === "success"}
        role={role}
        onClose={handleCloseSuccess}
      />

      <RateBookingAlreadyRatedDialog
        open={step === "already-rated"}
        onClose={() => setStep("closed")}
      />
      <RateBookingExpiredDialog open={step === "expired"} onClose={() => setStep("closed")} />
    </>
  );
}
