import { useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useBookingDetail } from "@/modules/class-history/hooks/useBookingDetail";
import { formatSessionDateLabel } from "@/modules/class-history/utils/classHistory.utils";
import ClaimBlockedDialog from "@/modules/claim/components/ClaimBlockedDialog";
import StartClaimDialog from "@/modules/claim/components/StartClaimDialog";
import { CLAIM_BLOCK_REASON_MESSAGE } from "@/modules/claim/constants/claimReasonsConstants";
import { useClaimEligibility } from "@/modules/claim/hooks/useClaimEligibility";
import { useClaimPopupStore } from "@/modules/claim/hooks/useClaimPopupStore";
import { useCreateClaim } from "@/modules/claim/hooks/useCreateClaim";
import type { StartClaimFormData } from "@/modules/claim/hooks/startClaimSchema";
import type { ClaimReason } from "@/modules/claim/interfaces/claimReasonType";
import type { BookingHistoryDetail } from "@/modules/class-history/interfaces/responses/booking-history-detail.interface";
import type { Role } from "@/shared/types/role.type";

const DEFAULT_BLOCKED_MESSAGE = "No es posible iniciar un reclamo para esta sesión.";

function buildSessionSummary(detail: BookingHistoryDetail): string {
  return `${detail.subjectName} con ${detail.otherPartyFullName} · ${formatSessionDateLabel(detail.sessionDate)}`;
}

export default function ClaimPopupHost() {
  const bookingId = useClaimPopupStore((s) => s.bookingId);
  const close = useClaimPopupStore((s) => s.close);
  const rawRole = useAuthStore((s) => s.authResponse?.role);
  const claimantRole: Role | null = rawRole === "STUDENT" || rawRole === "TUTOR" ? rawRole : null;
  const { eligibility, isError } = useClaimEligibility(bookingId ?? "", Boolean(bookingId));
  const { detail } = useBookingDetail(bookingId ?? "", Boolean(bookingId));
  const { submitClaim, isPending } = useCreateClaim(bookingId ?? "");

  useEffect(() => {
    if (bookingId && isError) {
      close();
    }
  }, [bookingId, isError, close]);

  if (!bookingId || !eligibility) return null;

  // Backends sin `allowedReasons` solo aceptan estos motivos.
  const allowedReasons: ClaimReason[] = eligibility.allowedReasons?.length
    ? eligibility.allowedReasons
    : claimantRole === "TUTOR"
      ? ["STUDENT_COULD_NOT_ATTEND", "I_COULD_NOT_ATTEND"]
      : ["I_COULD_NOT_ATTEND"];

  const canStartClaim = eligibility.canClaim && allowedReasons.length > 0;

  if (!canStartClaim) {
    return (
      <ClaimBlockedDialog
        open
        message={
          eligibility.blockReason
            ? CLAIM_BLOCK_REASON_MESSAGE[eligibility.blockReason]
            : DEFAULT_BLOCKED_MESSAGE
        }
        onClose={close}
      />
    );
  }

  if (!detail || !claimantRole) return null;

  const handleSubmit = async (data: StartClaimFormData) => {
    try {
      await submitClaim(data);
      close();
    } catch (error: unknown) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 409 || status === 422) close();
    }
  };

  return (
    <StartClaimDialog
      open
      claimantRole={claimantRole}
      allowedReasons={allowedReasons}
      sessionSummary={buildSessionSummary(detail)}
      isPending={isPending}
      onSubmit={(data) => void handleSubmit(data)}
      onCancel={close}
    />
  );
}
