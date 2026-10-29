import type { AdminMaterialReportFilters } from "@/modules/admin/types/admin-material-report-status.type";
import type { DashboardRange } from "@/modules/admin/types/dashboard-range.type";

/**
 * Claves de React Query del área de administración.
 * Centralizadas para evitar desalineaciones al invalidar (ver US-06).
 */
export const adminQueryKeys = {
  all: ["admin"] as const,
  dashboardBase: ["admin", "dashboard"] as const,
  dashboard: (range: DashboardRange) => ["admin", "dashboard", "summary", range] as const,
  materialReportsBase: ["admin", "material-reports"] as const,
  materialReports: {
    list: (filters: AdminMaterialReportFilters) =>
      ["admin", "material-reports", "list", filters] as const,
    detail: (materialId: string) => ["admin", "material-reports", "detail", materialId] as const,
  },
};
