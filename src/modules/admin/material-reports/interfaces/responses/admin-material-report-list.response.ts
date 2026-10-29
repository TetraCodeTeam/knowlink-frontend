import type { AdminMaterialReportListItem } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-list-item.response";
import type { AdminMaterialReportStatusCounts } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-status-counts.response";

export interface AdminMaterialReportListResponse {
  content: AdminMaterialReportListItem[];
  page: number;
  size: number;
  totalElements: number;
  statusCounts: AdminMaterialReportStatusCounts;
}
