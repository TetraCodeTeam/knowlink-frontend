import { useQuery } from "@tanstack/react-query";
import { getSubjectsByCareer } from "@/modules/tutors/api/catalog.api";

export function useCareerSubjects(careerId?: string) {
  return useQuery({
    queryKey: ["subjects", "career", careerId],
    queryFn: () => getSubjectsByCareer(careerId!),
    enabled: !!careerId,
    staleTime: 1000 * 60 * 30,
  });
}