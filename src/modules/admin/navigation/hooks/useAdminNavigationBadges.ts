import { useQuery } from "@tanstack/react-query";
import { getAdminNavigationBadges } from "@/modules/admin/navigation/api/admin-navigation.api";
import {
  ADMIN_NAVIGATION_BADGES_MAX_RETRIES,
  ADMIN_NAVIGATION_BADGES_REFETCH_INTERVAL_MS,
  ADMIN_NAVIGATION_BADGES_STALE_TIME_MS,
} from "@/modules/admin/navigation/constants/admin-navigation.constants";
import { adminQueryKeys } from "@/modules/admin/constants/admin-query-keys";

/**
 * Contadores de pendientes del sidebar.
 *
 * Se refrescan al volver a la pestaña y cada ~60 s. Si la consulta falla no se
 * muestra error: el badge simplemente se oculta.
 */
export function useAdminNavigationBadges() {
  const { data } = useQuery({
    queryKey: adminQueryKeys.navigationBadges,
    queryFn: getAdminNavigationBadges,
    staleTime: ADMIN_NAVIGATION_BADGES_STALE_TIME_MS,
    refetchInterval: ADMIN_NAVIGATION_BADGES_REFETCH_INTERVAL_MS,
    refetchOnWindowFocus: true,
    retry: ADMIN_NAVIGATION_BADGES_MAX_RETRIES,
  });

  return { badges: data };
}
