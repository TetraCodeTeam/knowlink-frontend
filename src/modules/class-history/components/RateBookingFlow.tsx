import { useState } from "react";
import axios from "axios";
import RateBookingButton from "@/modules/class-history/components/RateBookingButton";
import RateBookingDialog from "@/modules/class-history/components/RateBookingDialog";
import RateBookingSuccessDialog from "@/modules/class-history/components/RateBookingSuccessDialog";
import RateBookingAlreadyRatedDialog from "@/modules/class-history/components/RateBookingAlreadyRatedDialog";
import { useRateBooking } from "@/modules/class-history/hooks/useRateBooking";
import { useResolveRatingNotification } from "@/modules/notifications/hooks/useResolveRatingNotification";
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
  const { submitRating, isPending, invalidate } = useRateBooking(detail.bookingId);
  const { resolve } = useResolveRatingNotification();
  const canRate = detail.ratingStatus === "PENDING";

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
        // (e.g. validation errors) are not duplicate-rating signals and must
        // not be treated as if the booking were already rated.
        setStep("already-rated");
        invalidate();
        resolve(detail.bookingId);
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
    </>
  );
}
