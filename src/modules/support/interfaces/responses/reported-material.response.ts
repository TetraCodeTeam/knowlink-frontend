import type { FileFormat } from "@/modules/support/interfaces/file-format.type";
import type { MaterialReportStatus } from "@/modules/support/interfaces/material-report-status.type";

export interface ReportedMaterialResponse {
  id: string;
  fileName: string;
  fileFormat: FileFormat;
  subjectName: string;
  reportCount: number;
  status: MaterialReportStatus;
  hasUnseenUpdate: boolean;
}
