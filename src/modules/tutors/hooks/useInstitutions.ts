import { useQuery } from "@tanstack/react-query";
import { getInstitutions } from "@/modules/tutors/api/catalog.api";

export function useInstitutions() {
  return useQuery({
    queryKey: ["institutions"],
    queryFn: getInstitutions,
    staleTime: 1000 * 60 * 30,
  });
}
