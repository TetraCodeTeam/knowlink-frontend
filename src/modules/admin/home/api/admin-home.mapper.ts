import type { DashboardSummaryResponse } from "@/modules/admin/home/interfaces/responses/dashboard-summary.response";
import type { UnresolvedStatusLevel } from "@/modules/admin/home/constants/performance-status.constants";
import type { DashboardRange } from "@/modules/admin/types/dashboard-range.type";

/**
 * Tipos del contrato real del backend (`docs/admin/admin-frontend-contract.md`).
 *
 * El backend nombra los contadores pendientes como `pendingCount` (archivos)
 * y expone `unresolvedLevel` ya calculado. La UI usa `pendingFiles` y no
 * recalcula el semáforo, así que el mapper traduce ambos campos.
 */
export interface ApiSessionClaimsBlock {
  resolvedThisWeek: number;
  resolvedDeltaPct: number | null;
  newThisWeek: number;
  pendingCount: number;
  oldestPendingDays: number | null;
}

export interface ApiMaterialReportsBlock {
  resolvedThisWeek: number;
  resolvedDeltaPct: number | null;
  newThisWeek: number;
  pendingCount: number;
  pendingReports: number;
  mostReportedPendingFile: {
    caseId: string;
    materialId: string;
    fileName: string;
    reportsCount: number;
  } | null;
}

export interface ApiPerformanceBlock {
  range: DashboardRange;
  avgResolutionHours: number | null;
  avgResolutionDeltaPct: number | null;
  unresolvedPct: number;
  unresolvedLevel: UnresolvedStatusLevel;
  volumeSplit: {
    claimsPct: number;
    reportsPct: number;
  };
}

export interface ApiDashboardSummaryResponse {
  sessionClaims: ApiSessionClaimsBlock;
  materialReports: ApiMaterialReportsBlock;
  performance: ApiPerformanceBlock;
}

export function mapDashboardSummary(api: ApiDashboardSummaryResponse): DashboardSummaryResponse {
  return {
    sessionClaims: {
      resolvedThisWeek: api.sessionClaims.resolvedThisWeek,
      resolvedDeltaPct: api.sessionClaims.resolvedDeltaPct,
      newThisWeek: api.sessionClaims.newThisWeek,
      oldestPendingDays: api.sessionClaims.oldestPendingDays,
    },
    materialReports: {
      resolvedThisWeek: api.materialReports.resolvedThisWeek,
      resolvedDeltaPct: api.materialReports.resolvedDeltaPct,
      newThisWeek: api.materialReports.newThisWeek,
      // El backend cuenta archivos pendientes distintos en `pendingCount`.
      pendingFiles: api.materialReports.pendingCount,
      pendingReports: api.materialReports.pendingReports,
    },
    performance: {
      avgResolutionHours: api.performance.avgResolutionHours,
      avgResolutionDeltaPct: api.performance.avgResolutionDeltaPct,
      unresolvedPct: api.performance.unresolvedPct,
      unresolvedLevel: api.performance.unresolvedLevel,
      volumeSplit: api.performance.volumeSplit,
    },
  };
}
