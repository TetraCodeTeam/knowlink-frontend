import { useQuery } from "@tanstack/react-query";
import { searchSubjects } from "../api/search.api";
import { STUDENTS_SEARCH_KEY } from "../constants";

interface UseSearchSubjectsOptions {
  enabled?: boolean;
}

/**
 * Materias del catálogo de la institución del alumno (GET
 * /api/v1/subjects/search/{query}), con o sin tutores. Requiere rol STUDENT.
 *
 * La key arranca con STUDENTS_SEARCH_KEY para que las invalidaciones por
 * prefijo existentes también alcancen este resultado; no se crea una raíz
 * nueva. Sin debounce: un request por carácter, mismo criterio que
 * useSearchTutorsAndMaterias.
 */
export function useSearchSubjects(query: string, options?: UseSearchSubjectsOptions) {
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: [STUDENTS_SEARCH_KEY, "subjects", trimmedQuery],
    queryFn: () => searchSubjects(trimmedQuery),
    enabled: trimmedQuery.length > 0 && (options?.enabled ?? true),
  });
}
