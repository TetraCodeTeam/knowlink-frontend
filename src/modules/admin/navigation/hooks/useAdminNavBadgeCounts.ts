import { useMemo } from "react";
import { useAdminNavigationBadges } from "@/modules/admin/navigation/hooks/useAdminNavigationBadges";
import type { NavBadgeCounts } from "@/modules/app-shell/interfaces/navigation.interface";

/** Contadores del menú del administrador. Si la consulta falla, no se muestra ninguno. */
export function useAdminNavBadgeCounts(): NavBadgeCounts {
  const { badges } = useAdminNavigationBadges();
  const materialReports = badges?.pendingMaterialReports ?? 0;
  const sessionClaims = badges?.pendingSessionClaims ?? 0;

  return useMemo(() => ({ materialReports, sessionClaims }), [materialReports, sessionClaims]);
}
