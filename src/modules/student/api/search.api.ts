import { httpClient } from "@/shared/lib/httpClient";
import type { TutorSearchResult } from "@/modules/student/interfaces/tutor-search-result.interface";

/**
 * GET /api/v1/tutors/search/{query}
 * -> TutorSearchResult[]
 *
 * Contrato real (rama Julian-SalvucciV3 de knowlink-backend):
 *  - Devuelve un array plano de tutores, no { materias, tutores }.
 *  - Matchea únicamente por nombre de materia (findBySubject_NameContainingIgnoreCase),
 *    NO por nombre de tutor. Cada tutor incluye en `subjects` las materias que matchearon.
 *  - Requiere rol STUDENT (@PreAuthorize("hasRole('STUDENT')")); si el usuario está en
 *    modo tutor el backend responde 403.
 */
export async function searchTutors(query: string): Promise<TutorSearchResult[]> {
  const response = await httpClient.get<TutorSearchResult[]>(
    `/api/v1/tutors/search/${encodeURIComponent(query)}`
  );
  return response.data;
}
