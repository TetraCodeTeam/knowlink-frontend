import { useQuery } from "@tanstack/react-query";
import { getSessionClaimContactInfo } from "@/modules/admin/session-claims/api/admin-session-claims.api";
import { adminQueryKeys } from "@/modules/admin/constants/admin-query-keys";

/**
 * Datos personales: se consultan solo mientras el diálogo está abierto.
 * Sin caché (`gcTime: 0`), sin reintentos automáticos y sin persistencia, para
 * que cada apertura dispare una consulta nueva que el backend pueda auditar.
 */
export function useClaimContactInfo(claimId: string, enabled: boolean) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: adminQueryKeys.sessionClaims.contact(claimId),
    queryFn: () => getSessionClaimContactInfo(claimId),
    enabled: Boolean(claimId) && enabled,
    staleTime: 0,
    gcTime: 0,
    retry: 0,
  });

  return {
    contact: data,
    isLoading: enabled && isLoading,
    isError,
    refetch,
  };
}
