import type { ClaimStatus } from "@/modules/support/types/claim-status.type";
import type { MaterialReportStatus } from "@/modules/support/types/material-report-status.type";
import type { StatusTone } from "@/modules/support/styles/support.styles";

interface StatusMeta {
  label: string;
  tone: StatusTone;
}

export const CLAIM_STATUS_META: Record<ClaimStatus, StatusMeta> = {
  OPEN: { label: "Abierto", tone: "warning" },
  IN_REVIEW: { label: "En revisión", tone: "info" },
  RESOLVED: { label: "Resuelto", tone: "neutral" },
};

export const MATERIAL_STATUS_META: Record<MaterialReportStatus, StatusMeta> = {
  PENDING: { label: "Pendiente", tone: "warning" },
  IN_REVIEW: { label: "En revisión", tone: "info" },
  RESOLVED: { label: "Resuelto", tone: "neutral" },
};
