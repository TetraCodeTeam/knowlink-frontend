import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMaterialReports } from "@/modules/admin/material-reports/api/admin-material-reports.api";
import { ADMIN_LIST_PAGE_SIZE } from "@/modules/admin/constants/admin-pagination.constants";
import { adminQueryKeys } from "@/modules/admin/constants/admin-query-keys";
import type { AdminMaterialReportFilters } from "@/modules/admin/types/admin-material-report-status.type";

export function useAdminMaterialReports(filters: AdminMaterialReportFilters) {
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: adminQueryKeys.materialReports.list(filters),
    queryFn: () => getMaterialReports({ ...filters, size: ADMIN_LIST_PAGE_SIZE }),
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
