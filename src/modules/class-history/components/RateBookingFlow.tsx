import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import RateBookingButton from "@/modules/class-history/components/RateBookingButton";
import RateBookingDialog from "@/modules/class-history/components/RateBookingDialog";
import RateBookingSuccessDialog from "@/modules/class-history/components/RateBookingSuccessDialog";
import RateBookingAlreadyRatedDialog from "@/modules/class-history/components/RateBookingAlreadyRatedDialog";
import { useRateBooking } from "@/modules/class-history/hooks/useRateBooking";
import { hasRatedBooking, markBookingAsRated } from "@/modules/class-history/utils/ratedBookings.storage";
import { getRatingDeadline, isWithinRatingWindow } from "@/modules/class-history/utils/classHistory.utils";
import { RATING_WINDOW_HOURS } from "@/modules/class-history/constants/classHistory.constants";
import type { RateBookingFormValues } from "@/modules/class-history/schemas/rateBooking.schema";
import type { BookingHistoryDetail } from "@/modules/class-history/interfaces/responses/booking-history-detail.interface";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";

interface RateBookingFlowProps {
  detail: BookingHistoryDetail;
  role: BookingRole;
}

type RateBookingStep = "closed" | "rating" | "success" | "already-rated";

export default function RateBookingFlow({ detail, role }: RateBookingFlowProps) {
  const [step, setStep] = useState<RateBookingStep>("closed");
  const [, forceRerender] = useReducer((n: number) => n + 1, 0);
  const { submitRating, isPending, invalidate } = useRateBooking(detail.bookingId);

  // Re-render exactly when the rating window closes so the button disappears
  // on its own, instead of only re-evaluating on the next unrelated render.
  useEffect(() => {
    const deadline = getRatingDeadline(detail.sessionDate, detail.endTime, RATING_WINDOW_HOURS);
    const msUntilDeadline = deadline - Date.now();
    if (msUntilDeadline <= 0) return;
    const timer = setTimeout(forceRerender, msUntilDeadline);
    return () => clearTimeout(timer);
  }, [detail.sessionDate, detail.endTime]);

  const handleOpen = () => {
    if (hasRatedBooking(detail.bookingId)) {
      setStep("already-rated");
      return;
    }
    setStep("rating");
  };

  const handleConfirm = async ({ score, comment }: RateBookingFormValues) => {
    if (!isWithinRatingWindow(detail.sessionDate, detail.endTime, RATING_WINDOW_HOURS)) {
      // The deadline elapsed while the dialog was open: don't submit, just
      // close it so the next render hides the (now-expired) rating flow.
      setStep("closed");
      return;
    }
    try {
      await submitRating({ score, comment: comment?.trim() || null });
      markBookingAsRated(detail.bookingId);
      setStep("success");
    } catch (err: unknown) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      if (status === 409) {
        // 409 is the documented "already rated" conflict. Other error codes
        // (e.g. 422 validation errors) are not duplicate-rating signals and
        // must not be treated as if the booking were already rated.
        markBookingAsRated(detail.bookingId);
        setStep("already-rated");
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
  };

  if (!isWithinRatingWindow(detail.sessionDate, detail.endTime, RATING_WINDOW_HOURS)) {
    return null;
  }

  return (
    <>
      <RateBookingButton onClick={handleOpen} />

      <RateBookingDialog
        open={step === "rating"}
        detail={detail}
        role={role}
        isPending={isPending}
        onConfirm={(values) => void handleConfirm(values)}
        onCancel={() => setStep("closed")}
      />

      <RateBookingSuccessDialog open={step === "success"} role={role} onClose={handleCloseSuccess} />

      <RateBookingAlreadyRatedDialog
        open={step === "already-rated"}
        onClose={() => setStep("closed")}
      />
    </>
  );
}
