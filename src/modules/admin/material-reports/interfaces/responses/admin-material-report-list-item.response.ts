import type {
  AdminMaterialFileKind,
  AdminMaterialReportStatus,
} from "@/modules/admin/types/admin-material-report-status.type";

export interface AdminMaterialReportListItem {
  materialId: string;
  fileName: string;
  fileKind: AdminMaterialFileKind;
  subjectName: string;
  tutorName: string;
  reportsCount: number;
  status: AdminMaterialReportStatus;
  lastReportedAt: string;
  assignedToName: string | null;
  assignedToMe: boolean;
  resolutionNote: string | null;
}
