import { ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";
import type { AdminMaterialReportStatus } from "@/modules/admin/types/admin-material-report-status.type";

export type AdminStatusTone = "warning" | "info" | "success" | "danger";

export interface AdminStatusMeta {
  label: string;
  tone: AdminStatusTone;
  /** Color de la franja lateral de la fila. */
  accent: string;
}

/**
 * Metadatos de los estados de una denuncia de material en el admin.
 * El `Record` es exhaustivo: si se agrega un estado, TypeScript exige completarlo.
 */
export const ADMIN_MATERIAL_REPORT_STATUS_META: Record<AdminMaterialReportStatus, AdminStatusMeta> =
  {
    PENDING: {
      label: "Pendiente",
      tone: "warning",
      accent: ADMIN_TOKENS.amber500,
    },
    IN_REVIEW: {
      label: "En revisión",
      tone: "info",
      accent: ADMIN_TOKENS.indigo600,
    },
    REMOVED: {
      label: "Eliminado",
      tone: "danger",
      accent: ADMIN_TOKENS.rose500,
    },
    DISMISSED: {
      label: "Desestimado",
      tone: "success",
      accent: ADMIN_TOKENS.emerald600,
    },
  };

/** Estados con los que el archivo todavía no tiene resolución final. */
export const OPEN_MATERIAL_REPORT_STATUSES: AdminMaterialReportStatus[] = ["PENDING", "IN_REVIEW"];
