import type { FileFormat } from "@/modules/support/types/file-format.type";
import type { MaterialReportStatus } from "@/modules/support/types/material-report-status.type";

// Forma provisoria: confirmar contra el DTO real del backend antes de conectar.
export interface ReportedMaterialResponse {
  id: number;
  fileName: string;
  fileFormat: FileFormat;
  subjectName: string;
  reportCount: number;
  status: MaterialReportStatus;
  hasUnseenUpdate: boolean;
}
