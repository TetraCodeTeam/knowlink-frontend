import { useQuery } from "@tanstack/react-query";
import { getInstitutions } from "@/modules/catalog/api/catalog.api";

export function useInstituciones() {
  return useQuery({
    queryKey: ["catalog", "institutions"],
    queryFn: getInstitutions,
    staleTime: 1000 * 60 * 30,
  });
}