import type { MaterialReportStatus } from "@/modules/support/interfaces/material-report-status.type";
import type {
  MaterialReportReason,
  MaterialReportResolution,
} from "@/modules/student/support/interfaces/responses/student-support.response";

export interface StudentMaterialReportDetail {
  reportId: string;
  materialId: string;
  name: string;
  originalFileName: string;
  format: string;
  sizeInBytes: number;
  subjectName: string;
  careerName: string;
  tutor: { userId: string; fullName: string; profilePictureUrl: string | null };
  materialUploadedAt: string;
  materialAvailable: boolean;
  reason: MaterialReportReason;
  reasonLabel: string;
  description: string | null;
  status: MaterialReportStatus;
  statusLabel: string;
  resolution: MaterialReportResolution;
  reviewerName: string | null;
  reviewTeamName: string;
  reportedAt: string;
}
