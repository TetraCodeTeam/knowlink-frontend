export type ClaimReason = "STUDENT_COULD_NOT_ATTEND" | "I_COULD_NOT_ATTEND";

export type ClaimStatus = "OPEN" | "RESOLVED";

export type ClaimBlockReason =
  | "SESSION_NOT_PARTICIPANT"
  | "SESSION_NOT_FINALIZED"
  | "CLAIM_DEADLINE_EXCEEDED"
  | "ACTIVE_CLAIM_EXISTS";
