import type { Role } from "@/shared/types/role.type";
import type {
  ClaimBlockReason,
  ClaimReason,
  ClaimStatus,
} from "@/modules/claim/interfaces/claimReasonType";

export interface CreateClaimRequest {
  reason: ClaimReason;
  comment?: string;
}

export interface ClaimAttachment {
  id: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

export interface ClaimResponse {
  id: string;
  bookingId: string;
  reason: ClaimReason;
  comment: string | null;
  status: ClaimStatus;
  claimantRole: Role;
  createdAt: string;
  attachments: ClaimAttachment[];
}

export interface ClaimEligibility {
  canClaim: boolean;
  claimableUntil: string | null;
  blockReason: ClaimBlockReason | null;
  allowedReasons?: ClaimReason[];
}
