import type { FeedFilters } from "@/modules/community/interfaces/feed-filters.interface";
import type { FeedPeriod } from "@/modules/community/types/feed-period.type";

/** Al entrar a la comunidad se muestran las publicaciones del día. */
export const DEFAULT_FEED_FILTERS: FeedFilters = {
  type: null,
  period: "TODAY",
  careerId: null,
  subjectIds: [],
  status: null,
};

/** "Limpiar" restaura el feed completo: sin ningún criterio, incluido el período. */
export const CLEARED_FEED_FILTERS: FeedFilters = {
  type: null,
  period: "ALL",
  careerId: null,
  subjectIds: [],
  status: null,
};

export const FEED_PERIOD_OPTIONS: ReadonlyArray<{ value: FeedPeriod; label: string }> = [
  { value: "TODAY", label: "Hoy (Diario)" },
  { value: "WEEK", label: "Esta semana (Semanal)" },
  { value: "MONTH", label: "Este mes (Mensual)" },
  { value: "ALL", label: "Histórico" },
];
