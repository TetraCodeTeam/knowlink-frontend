import type {
  SubjectSummary,
  TutorSearchResult,
} from "@/modules/student/interfaces/tutor-search-result.interface";

export const materiasIngenieria: SubjectSummary[] = [
  { name: "Álgebra", career: "Ingeniería en Sistemas" },
  { name: "Física", career: "Ingeniería en Sistemas" },
];

export const tutorAna: TutorSearchResult = {
  tutorId: "t1",
  fullName: "Ana García",
  photoProfile: null,
  averageRating: 4.5,
  totalReviews: 2,
  subjects: [{ name: "Álgebra", career: "Ingeniería en Sistemas" }],
};

export const tutorCarlos: TutorSearchResult = {
  tutorId: "t2",
  fullName: "Carlos López",
  photoProfile: null,
  averageRating: null,
  totalReviews: 0,
  subjects: [{ name: "Física", career: "Ingeniería en Sistemas" }],
};

export const tutoresDePrueba: TutorSearchResult[] = [tutorAna, tutorCarlos];
/** Resultados de la búsqueda base sin filtros (para diferenciar AC-5). */
export const tutoresBase: TutorSearchResult[] = [tutorAna, tutorCarlos];

/** Resultados de una búsqueda con filtros aplicados. */
export const tutoresFiltrados: TutorSearchResult[] = [tutorAna];

/** Caso sin resultados de la búsqueda base. */
export const sinTutores: TutorSearchResult[] = [];
