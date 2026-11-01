import type { AdminMaterialReportItem } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-item.response";
import type { AdminMaterialReportListItem } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-list-item.response";

export interface AdminMaterialReportTutor {
  fullName: string;
  career: string;
  nationalId: string;
  institutionalFileNumber: string;
}

export interface AdminMaterialReportDetailResponse extends AdminMaterialReportListItem {
  tutor: AdminMaterialReportTutor;
  reports: AdminMaterialReportItem[];
}
