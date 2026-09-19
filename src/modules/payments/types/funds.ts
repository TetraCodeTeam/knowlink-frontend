export type FundsStatus =
  | "HELD"
  | "SUSPENDED_BY_CLAIM"
  | "RELEASED_TO_TUTOR"
  | "REFUNDED_TO_STUDENT";

export type FundsRecipient = "TUTOR" | "STUDENT";

export interface FundsTransfer {
  fundsTransferId: string;
  bookingId: string;
  originalAmount: number;
  systemRetentionPercentage: number;
  transferredAmount: number;
  recipient: FundsRecipient;
  concept: string;
  fundsStatus: FundsStatus;
  processedAt: string | null;
  blockingClaimId: string | null;
}