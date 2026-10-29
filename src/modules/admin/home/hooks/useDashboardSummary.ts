import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/modules/admin/home/api/admin-home.api";
import {
  DASHBOARD_MAX_RETRIES,
  DASHBOARD_REFETCH_INTERVAL_MS,
  DASHBOARD_STALE_TIME_MS,
} from "@/modules/admin/home/constants/admin-home.constants";
import { adminQueryKeys } from "@/modules/admin/constants/admin-query-keys";
import type { DashboardRange } from "@/modules/admin/types/dashboard-range.type";

export function useDashboardSummary(range: DashboardRange) {
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: adminQueryKeys.dashboard(range),
    queryFn: () => getDashboardSummary(range),
    staleTime: DASHBOARD_STALE_TIME_MS,
    refetchInterval: DASHBOARD_REFETCH_INTERVAL_MS,
    refetchOnWindowFocus: true,
    retry: DASHBOARD_MAX_RETRIES,
    // Al cambiar de rango no se vacían las tarjetas: se muestra el resumen anterior mientras llega el nuevo.
    placeholderData: keepPreviousData,
  });

  return { summary: data, isLoading, isFetching, isError, refetch };
}
