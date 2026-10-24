import type { Role } from "@/shared/types/role.type";
import type { ClaimReason, ClaimStatus } from "@/modules/claim/interfaces/claimReasonType";
import type { ClaimAttachment } from "@/modules/claim/interfaces/responses/claim-attachment.interface";

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
