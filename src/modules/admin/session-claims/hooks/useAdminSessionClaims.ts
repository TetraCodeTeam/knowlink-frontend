import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getSessionClaims } from "@/modules/admin/session-claims/api/admin-session-claims.api";
import { adminQueryKeys } from "@/modules/admin/constants/admin-query-keys";
import { ADMIN_LIST_PAGE_SIZE } from "@/modules/admin/constants/admin-pagination.constants";
import type { AdminSessionClaimFilters } from "@/modules/admin/types/admin-session-claim-filters.type";

export function useAdminSessionClaims(filters: AdminSessionClaimFilters) {
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: adminQueryKeys.sessionClaims.list(filters),
    queryFn: () => getSessionClaims({ ...filters, size: ADMIN_LIST_PAGE_SIZE }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    retry: 1,
  });

  return {
    response: data,
    items: data?.content ?? [],
    statusCounts: data?.statusCounts,
    totalElements: data?.totalElements ?? 0,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
}
