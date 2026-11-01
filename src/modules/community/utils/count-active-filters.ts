import type { FeedFilters } from "@/modules/community/interfaces/feed-filters.interface";

/** Cuenta criterios activos, no valores: elegir varias materias suma uno. */
export function countActiveFilters(filters: FeedFilters): number {
  return [
    filters.type !== null,
    filters.period !== "ALL",
    filters.careerId !== null,
    filters.subjectIds.length > 0,
    filters.status !== null,
  ].filter(Boolean).length;
}
