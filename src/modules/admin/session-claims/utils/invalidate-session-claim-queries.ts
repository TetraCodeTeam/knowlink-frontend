import type { QueryClient } from "@tanstack/react-query";
import { adminQueryKeys } from "@/modules/admin/constants/admin-query-keys";

/**
 * Invalidación única tras tomar o resolver un reclamo.
 * Refresca lista, detalle del reclamo y el dashboard de Admin 02.
 */
export async function invalidateSessionClaimQueries(
  queryClient: QueryClient,
  claimId: string
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.sessionClaimsBase }),
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.sessionClaims.detail(claimId) }),
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.dashboardBase }),
  ]);
}
