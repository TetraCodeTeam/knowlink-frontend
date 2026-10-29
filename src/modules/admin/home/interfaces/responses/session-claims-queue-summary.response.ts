import type { QueueSummary } from "@/modules/admin/home/interfaces/responses/queue-summary.response";

export interface SessionClaimsQueueSummary extends QueueSummary {
  /** Días de espera del reclamo pendiente más antiguo. `null` si no hay pendientes. */
  oldestPendingDays: number | null;
}
