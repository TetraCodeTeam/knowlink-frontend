import { useQuery } from "@tanstack/react-query";
import { searchTutorsAndMaterias } from "../api/search.api";
import { STUDENTS_SEARCH_KEY } from "../constants";

export function useSearchTutorsAndMaterias(query: string) {
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: [STUDENTS_SEARCH_KEY, trimmedQuery],
    queryFn: () => searchTutorsAndMaterias(trimmedQuery),
    enabled: trimmedQuery.length > 0,
  });
}
