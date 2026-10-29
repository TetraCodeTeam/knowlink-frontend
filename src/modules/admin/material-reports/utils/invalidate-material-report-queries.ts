import type { QueryClient } from "@tanstack/react-query";
import { adminQueryKeys } from "@/modules/admin/constants/admin-query-keys";

/**
 * Invalidación única tras tomar, dar de baja o desestimar.
 * Refresca lista, detalle del archivo y el dashboard de Admin 02.
 */
export async function invalidateMaterialReportQueries(
  queryClient: QueryClient,
  materialId: string
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.materialReportsBase }),
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.materialReports.detail(materialId) }),
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.dashboardBase }),
  ]);
}
