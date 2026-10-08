import type { ReportReason } from "@/modules/student/tutorProfile/types/report-reason.type";

export interface ReportMaterialRequest {
  reason: ReportReason;
  description?: string;
}
