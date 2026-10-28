import type { ClaimResponse } from "@/modules/support/interfaces/responses/claim.response";

export interface TutorClaimDetail {
  claimId: string;
  bookingId: string;
  student: { fullName: string; profilePictureUrl: string | null; careerName: string | null };
  subjectName: string;
  careerName: string;
  sessionDate: string;
  sessionStartTime: string;
  sessionEndTime: string;
  reason: string;
  status: ClaimResponse["status"];
  claimantRole: string;
  claimantName: string;
  declaration: string | null;
  createdAt: string;
  updatedAt: string;
  funds: {
    originalAmount: number;
    protectedAmount: number;
    status: string | null;
    currency: string;
  };
  reviewProgress: {
    currentPhase: string;
    queuePosition: number | null;
    responseDueAt: string | null;
    remainingMinutes: number;
  };
  attachments: Array<{ id: string; fileName: string; signedUrl: string }>;
  comments: Array<{ id: string; authorName: string; comment: string; createdAt: string }>;
}
