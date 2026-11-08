import { useQuery } from "@tanstack/react-query";
import { getBasicSubjects } from "@/modules/tutors/api/catalog.api";

export function useBasicSubjects(institutionId?: string) {
  return useQuery({
    queryKey: ["subjects", "basic", institutionId],
    queryFn: () => getBasicSubjects(institutionId!),
    enabled: !!institutionId,
    staleTime: 1000 * 60 * 30,
  });
}
