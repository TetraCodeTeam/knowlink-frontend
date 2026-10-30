import type { ClaimStatus } from "@/modules/support/interfaces/claim-status.type";
import type {
  ClaimantRole,
  ClaimReason,
} from "@/modules/student/support/interfaces/responses/student-support.response";

export interface ClaimFundsSummary {
  originalAmount: number;
  protectedAmount: number;
  protectedPercentage: number;
  status: string | null;
  retained: boolean;
  currency: string;
}

export interface ClaimReviewProgress {
  currentPhase: string;
  queuePosition: number | null;
  responseDueAt: string | null;
  remainingMinutes: number;
}

export interface ClaimAttachment {
  id: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  signedUrl: string;
}

export interface ClaimComment {
  id: string;
  authorName: string;
  authorRole: ClaimantRole | "ADMIN";
  comment: string;
  createdAt: string;
}

export interface StudentSessionClaimDetail {
  claimId: string;
  bookingId: string;
  tutor: { fullName: string; profilePictureUrl: string | null };
  subjectName: string;
  careerName: string;
  sessionDate: string;
  sessionStartTime: string;
  sessionEndTime: string;
  reason: ClaimReason;
  reasonLabel: string;
  status: ClaimStatus;
  statusLabel: string;
  claimantRole: ClaimantRole;
  initiatedByMe: boolean;
  claimantName: string;
  declaration: string | null;
  createdAt: string;
  updatedAt: string;
  funds: ClaimFundsSummary;
  reviewProgress: ClaimReviewProgress;
  attachments: ClaimAttachment[];
  comments: ClaimComment[];
}
