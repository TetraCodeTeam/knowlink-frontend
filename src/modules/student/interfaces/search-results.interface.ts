import { MateriaSearchResult } from "./materia-search-result.interface";
import { TutorSearchResult } from "./tutor-search-result.interface";

export interface TutorSearchResult {
  tutorId: string;
  fullName: string;
  photoProfile: string | null;
  averageRating: number | null;
  totalReviews: number;
  /** Nombres de materia que matchearon la búsqueda para este tutor. */
  subjects: string[];
}

