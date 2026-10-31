import type { ClaimStatus } from "@/modules/support/interfaces/claim-status.type";
import type { MaterialReportStatus } from "@/modules/support/interfaces/material-report-status.type";

export type ClaimantRole = "STUDENT" | "TUTOR";

export type ClaimReason =
  | "STUDENT_COULD_NOT_ATTEND"
  | "TUTOR_COULD_NOT_ATTEND"
  | "I_COULD_NOT_ATTEND";

export type MaterialReportReason =
  | "INAPPROPRIATE_CONTENT"
  | "PLAGIARISM"
  | "FALSE_INFORMATION"
  | "OTHER";

export type MaterialReportResolution = "UPHELD" | "DISMISSED" | null;

export interface StudentSessionClaimResponse {
  claimId: string;
  bookingId: string;
  tutorName: string;
  tutorProfilePictureUrl: string | null;
  subjectName: string;
  sessionDate: string; // ISO yyyy-MM-dd
  sessionStartTime: string;
  sessionEndTime: string;
  reason: ClaimReason;
  reasonLabel: string;
  claimantRole: ClaimantRole;
  initiatedByMe: boolean;
  status: ClaimStatus;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentMaterialReportResponse {
  reportId: string;
  materialId: string;
  name: string;
  originalFileName: string;
  format: string;
  sizeInBytes: number;
  subjectName: string;
  tutorName: string;
  reason: MaterialReportReason;
  reasonLabel: string;
  description: string | null;
  status: MaterialReportStatus;
  statusLabel: string;
  resolution: MaterialReportResolution;
  materialAvailable: boolean;
  reportedAt: string;
}

export interface StudentSupportSummaryResponse {
  sessionClaims: { total: number; pending: number; inReview: number; resolved: number };
  materialReports: { total: number; pending: number; inReview: number; resolved: number };
}

export interface StudentSupportResponse {
  summary: StudentSupportSummaryResponse;
  sessionClaims: StudentSessionClaimResponse[];
  reportedMaterials: StudentMaterialReportResponse[];
}
