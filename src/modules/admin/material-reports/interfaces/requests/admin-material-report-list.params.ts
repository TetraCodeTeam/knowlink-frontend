import type { AdminMaterialReportFilters } from "@/modules/admin/types/admin-material-report-status.type";

export interface AdminMaterialReportListParams extends AdminMaterialReportFilters {
  size: number;
}
