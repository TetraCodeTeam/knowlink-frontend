import { useQuery } from "@tanstack/react-query";
import { getBasicSubjects } from "@/modules/tutors/api/catalog.api";

export function useBasicSubjects() {
  return useQuery({
    queryKey: ["subjects", "basic"],
    queryFn: getBasicSubjects,
    staleTime: 1000 * 60 * 30,
  });
}