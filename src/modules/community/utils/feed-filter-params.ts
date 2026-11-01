import type { FeedFilters } from "@/modules/community/interfaces/feed-filters.interface";

export interface FeedFilterParams {
  type?: string;
  period: string;
  careerId?: string;
  subjectIds?: string;
  status?: string;
}

/**
 * Query params del backend. Axios serializa los arreglos como `subjectIds[]=…`, que Spring no reconoce,
 * así que las materias viajan separadas por coma.
 */
export function toFeedFilterParams(filters: FeedFilters): FeedFilterParams {
  return {
    type: filters.type ?? undefined,
    period: filters.period,
    careerId: filters.careerId ?? undefined,
    subjectIds: filters.subjectIds.length > 0 ? filters.subjectIds.join(",") : undefined,
    status: filters.status ?? undefined,
  };
}
