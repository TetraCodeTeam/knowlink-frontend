import type { SharedModality } from "@/shared/constants/modality";

export type CompensationFilter = "FREE" | "PAID";

export type WeekDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type TimeFrameFilter = "MORNING" | "AFTERNOON" | "EVENING";

export type SearchMode = "materias" | "tutores";

export interface SearchFilters {
  /** "VIRTUAL" | "IN_PERSON". Nunca se envía "BOTH" desde la UI. */
  modality?: SharedModality;
  compensation?: CompensationFilter;
  /** [] = sin filtro; siempre en orden L→D, sin repetidos. */
  daysOfWeek: WeekDay[];
  timeFrame?: TimeFrameFilter;
  verifiedOnly: boolean;
  minRating?: 1 | 2 | 3 | 4 | 5;
}

export const EMPTY_SEARCH_FILTERS: SearchFilters = { daysOfWeek: [], verifiedOnly: false };
