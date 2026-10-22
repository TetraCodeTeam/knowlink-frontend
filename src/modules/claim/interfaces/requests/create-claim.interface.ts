import type { ClaimReason } from "@/modules/claim/interfaces/claimReasonType";

export interface CreateClaimRequest {
  reason: ClaimReason;
  comment?: string;
}
