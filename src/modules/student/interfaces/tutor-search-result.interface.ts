export interface SubjectSummary {
  name: string;
  career: string;
}

export interface TutorSearchResult {
  tutorId: string;
  fullName: string;
  photoProfile: string | null;
  averageRating: number | null;
  totalReviews: number;
  /** Materias que matchearon la búsqueda para este tutor, con su carrera. */
  subjects: SubjectSummary[];
}

