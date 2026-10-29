import type { QueueSummary } from "@/modules/admin/home/interfaces/responses/queue-summary.response";

export interface MaterialReportsQueueSummary extends QueueSummary {
  /** Archivos distintos con al menos un reporte sin revisar. */
  pendingFiles: number;
  /** Reportes sin revisar, sumados entre todos los archivos. */
  pendingReports: number;
}
