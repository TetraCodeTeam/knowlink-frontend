import { useState } from "react";
import axios from "axios";
import RateBookingButton from "@/modules/class-history/components/RateBookingButton";
import RateBookingDialog from "@/modules/class-history/components/RateBookingDialog";
import RateBookingSuccessDialog from "@/modules/class-history/components/RateBookingSuccessDialog";
import RateBookingAlreadyRatedDialog from "@/modules/class-history/components/RateBookingAlreadyRatedDialog";
import { useRateBooking } from "@/modules/class-history/hooks/useRateBooking";
import { hasRatedBooking, markBookingAsRated } from "@/modules/class-history/utils/ratedBookings.storage";
import { isWithinRatingWindow } from "@/modules/class-history/utils/classHistory.utils";
import { RATING_WINDOW_HOURS } from "@/modules/class-history/constants/classHistory.constants";
import type { BookingHistoryDetail } from "@/modules/class-history/interfaces/responses/booking-history-detail.interface";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";

interface RateBookingFlowProps {
  detail: BookingHistoryDetail;
  role: BookingRole;
}

type RateBookingStep = "closed" | "rating" | "success" | "already-rated";

export default function RateBookingFlow({ detail, role }: RateBookingFlowProps) {
  const [step, setStep] = useState<RateBookingStep>("closed");
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const { submitRating, isPending, invalidate } = useRateBooking(detail.bookingId);

  const handleOpen = () => {
    if (hasRatedBooking(detail.bookingId)) {
      setStep("already-rated");
      return;
    }
    setScore(0);
    setComment("");
    setStep("rating");
  };

  const handleConfirm = async () => {
    if (score === 0) return;
    try {
      await submitRating({ score, comment: comment.trim() || null });
      markBookingAsRated(detail.bookingId);
      setStep("success");
    } catch (err: unknown) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      if (status === 409 || status === 422) {
        // The booking was already rated (by this user, in a previous session
        // or request): resubmitting is not possible, so tell the user instead
        // of leaving the rating dialog open for a retry that will always fail.
        markBookingAsRated(detail.bookingId);
        setStep("already-rated");
        invalidate();
        return;
      }
      // Other errors (network, 5xx): the httpClient interceptor already
      // showed an error toast; keep the rating dialog open so the user can retry.
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
        score={score}
        comment={comment}
        isPending={isPending}
        onScoreChange={setScore}
        onCommentChange={setComment}
        onConfirm={() => void handleConfirm()}
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
