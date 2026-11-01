import { useQuery } from "@tanstack/react-query";
import { searchTutors } from "../api/search.api";
import { STUDENTS_SEARCH_KEY } from "../constants";
import { EMPTY_SEARCH_FILTERS } from "../interfaces/search-filters.interface";
import type { SearchFilters } from "../interfaces/search-filters.interface";
import { toApiParams } from "../utils/search-filters.utils";

interface UseSearchTutorsAndMateriasOptions {
  enabled?: boolean;
}

export function useSearchTutorsAndMaterias(
  query: string,
  filters?: SearchFilters,
  options?: UseSearchTutorsAndMateriasOptions
) {
  const trimmedQuery = query.trim();
  const apiParams = toApiParams(filters ?? EMPTY_SEARCH_FILTERS);

  return useQuery({
    queryKey: [STUDENTS_SEARCH_KEY, trimmedQuery, apiParams],
    queryFn: () => searchTutors(trimmedQuery, filters),
    enabled: trimmedQuery.length > 0 && (options?.enabled ?? true),
  });
}
