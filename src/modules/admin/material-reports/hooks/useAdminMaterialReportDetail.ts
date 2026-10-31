import { useQuery } from "@tanstack/react-query";
import { getMaterialReportDetail } from "@/modules/admin/material-reports/api/admin-material-reports.api";
import { adminQueryKeys } from "@/modules/admin/constants/admin-query-keys";

export function useAdminMaterialReportDetail(materialId: string | null) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: adminQueryKeys.materialReports.detail(materialId ?? ""),
    queryFn: () => {
      if (!materialId) {
        return Promise.reject(new Error("Se requiere un material para consultar el detalle."));
      }
      return getMaterialReportDetail(materialId);
    },
    enabled: Boolean(materialId),
    staleTime: 0,
    retry: 1,
  });

  return {
    detail: data,
    isLoading: Boolean(materialId) && isLoading,
    isError,
    refetch,
  };
}
