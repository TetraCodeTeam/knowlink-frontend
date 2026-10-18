import { useQuery } from "@tanstack/react-query";
import { getSubjectsByInstitutionAndCareer } from "@/modules/catalog/api/catalog.api";

export function useMateriasByInstitucion(institutionId?: string) {
  return useQuery({
    queryKey: ["catalog", "subjects", institutionId, null],
    queryFn: () => getSubjectsByInstitutionAndCareer(institutionId!),
    enabled: !!institutionId,
    staleTime: 1000 * 60 * 30,
  });
}