import type { ClaimBlockReason, ClaimReason } from "@/modules/claim/interfaces/claimReasonType";

export interface ClaimEligibility {
  canClaim: boolean;
  claimableUntil: string | null;
  blockReason: ClaimBlockReason | null;
  allowedReasons?: ClaimReason[];
}
