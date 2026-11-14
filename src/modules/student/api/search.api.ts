import { httpClient } from "@/shared/lib/httpClient";
import type { SearchFilters } from "@/modules/student/interfaces/search-filters.interface";
import type {
  SubjectSummary,
  TutorSearchResult,
} from "@/modules/student/interfaces/tutor-search-result.interface";
import { toApiParams } from "@/modules/student/utils/search-filters.utils";

/**
 * GET /api/v1/tutors/search/{query}
 * -> TutorSearchResult[]
 *
 * Contrato real:
 *  - Devuelve un array plano de tutores, no { materias, tutores }.
 *  - Matchea por nombre de materia (subjectNameContains) y por nombre de tutor
 *    (findByUser_FullNameContainingIgnoreCase), deduplicados por tutorId.
 *  - Acepta filtros opcionales por query string (US-49): modality, compensation,
 *    daysOfWeek (lista separada por comas), timeFrame, verifiedOnly y minRating.
 *  - Requiere rol STUDENT (@PreAuthorize("hasRole('STUDENT')")); si el usuario está en
 *    modo tutor el backend responde 403.
 */
export async function searchTutors(
  query: string,
  filters?: SearchFilters
): Promise<TutorSearchResult[]> {
  const response = await httpClient.get<TutorSearchResult[]>(
    `/api/v1/tutors/search/${encodeURIComponent(query)}`,
    { params: filters ? toApiParams(filters) : undefined }
  );
  return response.data;
}

/**
 * GET /api/v1/subjects/search/{query}
 * -> SubjectSummary[]  (materias del catálogo de la institución del alumno, con o sin tutores;
 *    ya ordenadas por el backend). Requiere rol STUDENT.
 */
export async function searchSubjects(query: string): Promise<SubjectSummary[]> {
  const response = await httpClient.get<SubjectSummary[]>(
    `/api/v1/subjects/search/${encodeURIComponent(query)}`
  );
  return response.data;
}
