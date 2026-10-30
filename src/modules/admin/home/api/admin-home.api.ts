import { rawHttpClient } from "@/shared/lib/httpClient";
import {
  mapDashboardSummary,
  type ApiDashboardSummaryResponse,
} from "@/modules/admin/home/api/admin-home.mapper";
import type { DashboardSummaryResponse } from "@/modules/admin/home/interfaces/responses/dashboard-summary.response";
import type { DashboardRange } from "@/modules/admin/types/dashboard-range.type";

/**
 * Resumen del dashboard de moderación.
 *
 * Usa `rawHttpClient` porque la pantalla renderiza su propio estado de error con "Reintentar";
 * `httpClient` dispararía además el snackbar global y el usuario vería dos errores.
 *
 * El mapper adapta los nombres del contrato real (`pendingCount`, `unresolvedLevel`)
 * al modelo de vista de la UI.
 */
export async function getDashboardSummary(
  range: DashboardRange
): Promise<DashboardSummaryResponse> {
  const { data } = await rawHttpClient.get<ApiDashboardSummaryResponse>(
    "/api/v1/admin/dashboard/summary",
    { params: { range } }
  );
  return mapDashboardSummary(data);
}
