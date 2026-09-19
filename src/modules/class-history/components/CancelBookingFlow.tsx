import { useState } from "react";
import CancelBookingButton from "@/modules/class-history/components/CancelBookingButton";
import CancelBookingConfirmDialog from "@/modules/class-history/components/CancelBookingConfirmDialog";
import CancelBookingSuccessDialog from "@/modules/class-history/components/CancelBookingSuccessDialog";
import { useCancelBooking } from "@/modules/class-history/hooks/useCancelBooking";
import { CANCELLATION_FULL_REFUND_WINDOW_HOURS } from "@/modules/class-history/constants/classHistory.constants";
import { hasFullRefundCancellationWindow } from "@/modules/class-history/utils/classHistory.utils";
import type { BookingHistoryDetail } from "@/modules/class-history/interfaces/responses/booking-history-detail.interface";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";

interface CancelBookingFlowProps {
  detail: BookingHistoryDetail;
  role: BookingRole;
}

type CancelBookingStep = "closed" | "confirm" | "success";

export default function CancelBookingFlow({ detail, role }: CancelBookingFlowProps) {
  const [step, setStep] = useState<CancelBookingStep>("closed");
  const { confirmCancelBooking, isPending } = useCancelBooking(detail.bookingId);

  const isFullRefund = hasFullRefundCancellationWindow(
    detail.sessionDate,
    detail.startTime,
    CANCELLATION_FULL_REFUND_WINDOW_HOURS
  );

  const handleConfirm = async () => {
    try {
      await confirmCancelBooking();
      setStep("success");
    } catch {
      // The httpClient interceptor already shows an error toast; keep the
      // confirmation dialog open so the user can retry.
    }
  };

  return (
    <>
      <CancelBookingButton onClick={() => setStep("confirm")} />

      <CancelBookingConfirmDialog
        open={step === "confirm"}
        detail={detail}
        role={role}
        isFullRefund={isFullRefund}
        isPending={isPending}
        onConfirm={() => void handleConfirm()}
        onCancel={() => setStep("closed")}
      />

      <CancelBookingSuccessDialog
        open={step === "success"}
        otherPartyFullName={detail.otherPartyFullName}
        onClose={() => setStep("closed")}
      />
    </>
  );
}
