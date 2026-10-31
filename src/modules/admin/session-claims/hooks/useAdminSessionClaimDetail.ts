import { useQuery } from "@tanstack/react-query";
import { getSessionClaimDetail } from "@/modules/admin/session-claims/api/admin-session-claims.api";
import { adminQueryKeys } from "@/modules/admin/constants/admin-query-keys";

export function useAdminSessionClaimDetail(claimId: string | null) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: adminQueryKeys.sessionClaims.detail(claimId ?? ""),
    queryFn: () => {
      if (!claimId) {
        return Promise.reject(new Error("Se requiere un reclamo para consultar el detalle."));
      }
      return getSessionClaimDetail(claimId);
    },
    enabled: Boolean(claimId),
    staleTime: 0,
    retry: 1,
  });

  return {
    detail: data,
    isLoading: Boolean(claimId) && isLoading,
    isError,
    refetch,
  };
}
