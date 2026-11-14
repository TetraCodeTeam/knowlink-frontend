import type {
  SubjectSummary,
  TutorSearchResult,
} from "../interfaces/tutor-search-result.interface";

/**
 * Normaliza el texto para comparar sin distinguir mayúsculas ni acentos,
 * con el mismo criterio que el backend: minúsculas + NFD + eliminación de las
 * marcas combinantes + trim. Así "algebra" matchea "Álgebra".
 */
function normalize(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").trim();
}

/**
 * Rangos del ranking compartido con el backend (US-06):
 * 0 = empieza con la query · 1 = otra palabra empieza · 2 = contiene ·
 * 3 = no contiene. Una query en blanco deja todo en 0 (alfabético).
 */
function rank(name: string, query: string): number {
  const normalizedName = normalize(name);
  const normalizedQuery = normalize(query);

  if (!normalizedName.includes(normalizedQuery)) {
    return 3;
  }
  if (normalizedName.startsWith(normalizedQuery)) {
    return 0;
  }

  for (let i = 1; i < normalizedName.length; i++) {
    const previous = normalizedName.charAt(i - 1);
    if (!/[\p{L}\p{N}]/u.test(previous) && normalizedName.startsWith(normalizedQuery, i)) {
      return 1;
    }
  }
  return 2;
}

/** Orden alfabético español insensible a mayúsculas/acentos (desempate final). */
function compareByName(left: SubjectSummary, right: SubjectSummary): number {
  return left.name.localeCompare(right.name, "es", { sensitivity: "base" });
}

/**
 * Deriva la lista de materias únicas a partir de los tutores que trajo una
 * búsqueda, deduplicando por nombre (case-insensitive).
 *
 * Ya no es el camino principal para mostrar materias: el catálogo completo
 * (incluidas las materias sin tutores) viene de GET
 * /api/v1/subjects/search/{query}. Este camino queda para el caso con filtros
 * avanzados activos (US-49), donde las materias se derivan de los tutores
 * filtrados porque una materia "cumple" un filtro solo si algún tutor lo cumple.
 *
 * Con `query` ordena con los mismos rangos que el backend (empieza con el
 * texto → otra palabra empieza → contiene) y, dentro del mismo rango,
 * alfabéticamente. Sin `query` (o con una query en blanco) queda alfabético.
 */
export function deriveMateriasFromTutors(
  tutors: TutorSearchResult[],
  query?: string
): SubjectSummary[] {
  const seen = new Map<string, SubjectSummary>();
  for (const tutor of tutors) {
    for (const subject of tutor.subjects) {
      const key = subject.name.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.set(key, subject);
      }
    }
  }

  const normalizedQuery = normalize(query ?? "");
  return [...seen.values()].sort((left, right) => {
    const byRank = rank(left.name, normalizedQuery) - rank(right.name, normalizedQuery);
    return byRank !== 0 ? byRank : compareByName(left, right);
  });
}
