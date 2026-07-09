import { useQuery } from "@tanstack/react-query";
import { getCareers } from "@/modules/tutors/api/catalog.api";

export function useCareers() {
  return useQuery({
    queryKey: ["careers"],
    queryFn: getCareers,
    staleTime: 1000 * 60 * 30,
  });
}