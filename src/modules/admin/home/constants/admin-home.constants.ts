import type { DashboardRange } from "@/modules/admin/types/dashboard-range.type";

export const DEFAULT_DASHBOARD_RANGE: DashboardRange = "WEEK";

/** Refresco silencioso del resumen: el diseño habla de métricas "en tiempo real". */
export const DASHBOARD_REFETCH_INTERVAL_MS = 60_000;

export const DASHBOARD_STALE_TIME_MS = 30_000;

export const DASHBOARD_MAX_RETRIES = 1;
