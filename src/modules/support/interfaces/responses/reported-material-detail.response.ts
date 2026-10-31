import type { ReportedMaterialResponse } from "@/modules/support/interfaces/responses/reported-material.response";

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
