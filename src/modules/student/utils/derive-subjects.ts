import type {
  SubjectSummary,
  TutorSearchResult,
} from "../interfaces/tutor-search-result.interface";

/**
 * El backend no expone una entidad "materia" separada — solo devuelve tutores
 * con sus subjects. Esta función deriva la lista de materias únicas a partir
 * de los tutores que trajo la búsqueda, dedupeando por nombre (case-insensitive).
 */
export function deriveSubjectsFromTutors(tutors: TutorSearchResult[]): SubjectSummary[] {
  const seen = new Map<string, SubjectSummary>();
  for (const tutor of tutors) {
    for (const subject of tutor.subjects) {
      const key = subject.name.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.set(key, subject);
      }
    }
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}
