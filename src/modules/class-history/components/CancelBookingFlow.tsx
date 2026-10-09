import { useState } from "react";
import axios from "axios";
import CancelBookingButton from "@/modules/class-history/components/CancelBookingButton";
import CancelBookingConfirmDialog from "@/modules/class-history/components/CancelBookingConfirmDialog";
import CancelBookingSuccessDialog from "@/modules/class-history/components/CancelBookingSuccessDialog";
import { useCancelBooking } from "@/modules/class-history/hooks/useCancelBooking";
import { useCancelBookingPreview } from "@/modules/class-history/hooks/useCancelBookingPreview";
import type { BookingHistoryDetail } from "@/modules/class-history/interfaces/responses/booking-history-detail.interface";
import type { BookingRole } from "@/modules/class-history/types/booking-role.type";

interface CancelBookingFlowProps {
  detail: BookingHistoryDetail;
  role: BookingRole;
}

type CancelBookingStep = "closed" | "confirm" | "success";

export default function CancelBookingFlow({ detail, role }: CancelBookingFlowProps) {
  const [step, setStep] = useState<CancelBookingStep>("closed");
  const { confirmCancelBooking, cancellationResult, isPending, invalidate } = useCancelBooking(
    detail.bookingId
  );
  const {
    preview,
    isLoading: isPreviewLoading,
    isError: isPreviewError,
  } = useCancelBookingPreview(detail.bookingId, step === "confirm");

  const handleConfirm = async () => {
    try {
      await confirmCancelBooking();
      setStep("success");
    } catch (err: unknown) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      if (status === 409 || status === 422) {
        // The booking is no longer cancellable (already cancelled/confirmed
        // elsewhere, or the session already occurred): retrying won't help.
        setStep("closed");
        invalidate();
        return;
      }
      // Other errors (network, 5xx): the httpClient interceptor already
      // showed an error toast; keep the confirmation dialog open to retry.
    }
  };

  const handleCloseSuccess = () => {
    setStep("closed");
    // Deferred until the success dialog closes: invalidating earlier removes
    // this booking from the "Reservadas" list, which unmounts this component
    // (and the dialog it's showing) while the user is still reading it.
    invalidate();
  };

  return (
    <>
      <CancelBookingButton onClick={() => setStep("confirm")} />

      <CancelBookingConfirmDialog
        open={step === "confirm"}
        detail={detail}
        role={role}
        preview={preview}
        isPreviewLoading={isPreviewLoading}
        isPreviewError={isPreviewError}
        isPending={isPending}
        onConfirm={() => void handleConfirm()}
        onCancel={() => setStep("closed")}
      />

      <CancelBookingSuccessDialog
        open={step === "success"}
        otherPartyFullName={detail.otherPartyFullName}
        role={role}
        cancellationResult={cancellationResult}
        onClose={handleCloseSuccess}
      />
    </>
  );
}
