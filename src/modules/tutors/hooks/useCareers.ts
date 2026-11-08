import { useQuery } from "@tanstack/react-query";
import { getCareers } from "@/modules/tutors/api/catalog.api";

export function useCareers(institutionId?: string) {
  return useQuery({
    queryKey: ["careers", institutionId],
    queryFn: () => getCareers(institutionId!),
    enabled: !!institutionId,
    staleTime: 1000 * 60 * 30,
  });
}
