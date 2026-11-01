import type { MaterialReportsQueueSummary } from "@/modules/admin/home/interfaces/responses/material-reports-queue-summary.response";
import type { PerformanceSummary } from "@/modules/admin/home/interfaces/responses/performance-summary.response";
import type { SessionClaimsQueueSummary } from "@/modules/admin/home/interfaces/responses/session-claims-queue-summary.response";

/**
 * Respuesta de `GET /api/v1/admin/dashboard/summary`.
 * Las colas son siempre semanales; `range` solo afecta a `performance`.
 */
export interface DashboardSummaryResponse {
  sessionClaims: SessionClaimsQueueSummary;
  materialReports: MaterialReportsQueueSummary;
  performance: PerformanceSummary;
}
