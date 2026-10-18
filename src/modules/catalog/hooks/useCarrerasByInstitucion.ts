import { useQuery } from "@tanstack/react-query";
import { getCareersByInstitution } from "@/modules/catalog/api/catalog.api";

export function useCarrerasByInstitucion(institutionId?: string) {
  return useQuery({
    queryKey: ["catalog", "careers", institutionId],
    queryFn: () => getCareersByInstitution(institutionId!),
    enabled: !!institutionId,
    staleTime: 1000 * 60 * 30,
  });
}