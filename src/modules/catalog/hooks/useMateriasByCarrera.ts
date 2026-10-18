import { useQuery } from "@tanstack/react-query";
import { getSubjectsByInstitutionAndCareer } from "@/modules/catalog/api/catalog.api";

export function useMateriasByCarrera(institutionId?: string, careerId?: string) {
  return useQuery({
    queryKey: ["catalog", "subjects", institutionId, careerId ?? null],
    queryFn: () => getSubjectsByInstitutionAndCareer(institutionId!, careerId),
    enabled: !!institutionId && !!careerId,
    staleTime: 1000 * 60 * 30,
  });
}