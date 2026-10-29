import { rawHttpClient } from "@/shared/lib/httpClient";
import type { DashboardSummaryResponse } from "@/modules/admin/home/interfaces/responses/dashboard-summary.response";
import type { DashboardRange } from "@/modules/admin/types/dashboard-range.type";

/**
 * Resumen del dashboard de moderación.
 *
 * Usa `rawHttpClient` porque la pantalla renderiza su propio estado de error con "Reintentar";
 * `httpClient` dispararía además el snackbar global y el usuario vería dos errores.
 */
export async function getDashboardSummary(
  range: DashboardRange
): Promise<DashboardSummaryResponse> {
  const { data } = await rawHttpClient.get<DashboardSummaryResponse>(
    "/api/v1/admin/dashboard/summary",
    { params: { range } }
  );
  return data;
}
