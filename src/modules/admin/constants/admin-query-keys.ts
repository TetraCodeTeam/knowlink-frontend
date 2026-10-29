import type { AdminMaterialReportFilters } from "@/modules/admin/types/admin-material-report-status.type";
import type { AdminSessionClaimFilters } from "@/modules/admin/types/admin-session-claim-filters.type";
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
  sessionClaimsBase: ["admin", "session-claims"] as const,
  sessionClaims: {
    list: (filters: AdminSessionClaimFilters) =>
      ["admin", "session-claims", "list", filters] as const,
    detail: (claimId: string) => ["admin", "session-claims", "detail", claimId] as const,
    contact: (claimId: string) => ["admin", "session-claims", "contact", claimId] as const,
  },
};
