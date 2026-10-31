import type { ClaimResponse } from "@/modules/support/interfaces/responses/claim.response";
import type { ReportedMaterialResponse } from "@/modules/support/interfaces/responses/reported-material.response";

export interface TutorSupportClaimDto {
  claimId: string;
  bookingId: string;
  subjectName: string;
  studentName: string;
  sessionDate: string;
  reason: string;
  status: ClaimResponse["status"];
  updatedAt: string;
}

export interface TutorReportedMaterialDto {
  materialId: string;
  name: string;
  originalFileName: string;
  format: string;
  subjectName: string;
  reportCount: number;
  status: ReportedMaterialResponse["status"];
}

export interface TutorSupportDto {
  summary: {
    sessionClaimCount: number;
    reportedMaterialCount: number;
    materialsInReviewCount: number;
  };
  sessionClaims: TutorSupportClaimDto[];
  reportedMaterials: TutorReportedMaterialDto[];
}

export interface TutorSupportData {
  summary: TutorSupportDto["summary"];
  claims: ClaimResponse[];
  materials: ReportedMaterialResponse[];
}
