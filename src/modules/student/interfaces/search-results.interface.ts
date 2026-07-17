import { MateriaSearchResult } from "./materia-search-result.interface";
import { TutorSearchResult } from "./tutor-search-result.interface";

export interface SearchResults {
  materias: MateriaSearchResult[];
  tutores: TutorSearchResult[];
}
