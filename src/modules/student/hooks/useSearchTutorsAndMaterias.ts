import { useQuery } from "@tanstack/react-query";
import { searchTutors } from "../api/search.api";
import { STUDENTS_SEARCH_KEY } from "../constants";

export function useSearchTutorsAndMaterias(query: string) {
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: [STUDENTS_SEARCH_KEY, trimmedQuery],
    queryFn: () => searchTutors(trimmedQuery),
    enabled: trimmedQuery.length > 0,
  });
}