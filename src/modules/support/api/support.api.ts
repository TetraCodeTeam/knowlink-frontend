import { httpClient } from "@/shared/lib/httpClient";
import type { ClaimResponse } from "@/modules/support/interfaces/responses/claim.response";
import type { ReportedMaterialResponse } from "@/modules/support/interfaces/responses/reported-material.response";
import type { FileFormat } from "@/modules/support/interfaces/file-format.type";

interface TutorSupportClaimDto {
  claimId: string;
  bookingId: string;
  subjectName: string;
  studentName: string;
  sessionDate: string;
  reason: string;
  status: ClaimResponse["status"];
  updatedAt: string;
}

interface TutorReportedMaterialDto {
  materialId: string;
  name: string;
  originalFileName: string;
  format: string;
  subjectName: string;
  reportCount: number;
  status: ReportedMaterialResponse["status"];
}

interface TutorSupportDto {
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

export interface ReportedMaterialDetail {
  materialId: string;
  name: string;
  originalFileName: string;
  format: string;
  sizeInBytes: number;
  subjectName: string;
  careerName: string;
  uploadedAt: string;
  available: boolean;
  previewUrl: string | null;
  reportCount: number;
  status: ReportedMaterialResponse["status"];
  reviewTeamName: string;
  reviewerName: string | null;
  reports: Array<{
    reportId: string;
    reason: string;
    description: string | null;
    reportedAt: string;
    status: ReportedMaterialResponse["status"];
    resolution: string | null;
  }>;
  defense: {
    submitted: boolean;
    description: string | null;
    submittedAt: string | null;
    attachments: Array<{ attachmentId: string; fileName: string; signedUrl: string }>;
  } | null;
}

export interface MaterialReportingPolicy {
  acceptedFormats: FileFormat[];
  maxDescriptionLength: number;
  maxDefenseAttachments: number;
  maxDefenseAttachmentSizeBytes: number;
  permittedContentPolicy: string;
  reportReasons: Array<{ code: string; label: string; description: string }>;
  reviewProcess: string;
  upheldOutcome: string;
  dismissedOutcome: string;
  reporterNotification: string;
}

function describeClaimReason(reason: string): string {
  switch (reason) {
    case "STUDENT_COULD_NOT_ATTEND":
      return "El alumno no pudo asistir a la sesión";
    case "TUTOR_COULD_NOT_ATTEND":
      return "El tutor no pudo asistir a la sesión";
    case "I_COULD_NOT_ATTEND":
      return "No pude asistir a la sesión";
    default:
      return reason;
  }
}

function normalizeFileFormat(format: string): FileFormat {
  const normalized = format.toUpperCase();
  if (normalized === "PDF" || normalized === "PNG" || normalized === "XLSX") {
    return normalized;
  }
  throw new Error(`Formato de material no reconocido: ${format}`);
}

export async function getTutorSupport(): Promise<TutorSupportData> {
  const response = await httpClient.get<TutorSupportDto>("/api/v1/tutors/support");
  const data = response.data;

  return {
    summary: data.summary,
    claims: data.sessionClaims.map((claim) => ({
      id: claim.claimId,
      subjectName: claim.subjectName,
      studentName: claim.studentName,
      sessionDate: claim.sessionDate,
      reason: describeClaimReason(claim.reason),
      status: claim.status,
      resolvedAt: claim.status === "RESOLVED" ? claim.updatedAt.slice(0, 10) : null,
      hasUnseenUpdate: false,
    })),
    materials: data.reportedMaterials.map((material) => ({
      id: material.materialId,
      fileName: material.originalFileName || material.name,
      fileFormat: normalizeFileFormat(material.format),
      subjectName: material.subjectName,
      reportCount: material.reportCount,
      status: material.status,
      hasUnseenUpdate: false,
    })),
  };
}

export async function getTutorClaimDetail(claimId: string): Promise<TutorClaimDetail> {
  const response = await httpClient.get<TutorClaimDetail>(
    `/api/v1/tutors/support/session-claims/${claimId}`
  );
  return response.data;
}

export async function getReportedMaterialDetail(
  materialId: string
): Promise<ReportedMaterialDetail> {
  const response = await httpClient.get<ReportedMaterialDetail>(
    `/api/v1/tutors/support/materials/${materialId}`
  );
  return response.data;
}

export async function addTutorClaimComment(claimId: string, comment: string): Promise<void> {
  await httpClient.post(`/api/v1/tutors/support/session-claims/${claimId}/comments`, { comment });
}

export async function submitMaterialDefense(
  materialId: string,
  description: string,
  files: File[]
): Promise<void> {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify({ description })], { type: "application/json" })
  );
  files.forEach((file) => formData.append("files", file));
  await httpClient.post(`/api/v1/tutors/support/materials/${materialId}/defense`, formData);
}

export async function getMaterialReportingPolicy(): Promise<MaterialReportingPolicy> {
  const response = await httpClient.get<MaterialReportingPolicy>(
    "/api/v1/tutors/support/material-policy"
  );
  return response.data;
}
