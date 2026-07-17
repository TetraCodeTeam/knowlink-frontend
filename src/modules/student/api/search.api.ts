import { httpClient } from "@/shared/lib/httpClient";
import type { SearchResults } from "@/modules/students/interfaces/responses/search-results.interface";

/**
 * GET /api/v1/tutors/search/{query}
 * -> { materias: MateriaSearchResult[], tutores: TutorSearchResult[] }
 *
 * El backend es responsable de:
 *  - Interpretar `query` contra nombre de materia y nombre/apellido de tutor.
 *  - Excluir de `tutores` a los usuarios que solo tienen rol alumno activo.
 *  - Rechazar (403) la consulta si quien llama está en modo tutor.
 */
export async function searchTutorsAndMaterias(query: string): Promise<SearchResults> {
  const response = await httpClient.get<SearchResults>(
    `/api/v1/tutors/search/${encodeURIComponent(query)}`
  );
  return response.data;
}
