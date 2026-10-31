import type { AdminStatusMeta } from "@/modules/admin/constants/admin-status-meta";
import { ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";
import type { ClaimStatus } from "@/modules/support/interfaces/claim-status.type";

/**
 * Metadatos de los estados de un reclamo de sesión en el admin.
 * Reutiliza el vocabulario de `modules/support` y lo traduce a la UI del panel.
 */
export const ADMIN_SESSION_CLAIM_STATUS_META: Record<ClaimStatus, AdminStatusMeta> = {
  OPEN: {
    label: "Pendiente",
    tone: "warning",
    accent: ADMIN_TOKENS.amber500,
  },
  IN_REVIEW: {
    label: "En revisión",
    tone: "info",
    accent: ADMIN_TOKENS.indigo600,
  },
  RESOLVED: {
    label: "Resuelto",
    tone: "success",
    accent: ADMIN_TOKENS.emerald600,
  },
};
