import { ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";

/**
 * Semáforo que calcula el backend según `unresolvedPct`.
 * El frontend solo traduce el nivel a etiqueta y color: no recalcula umbrales.
 */
export type UnresolvedStatusLevel = "UNDER_CONTROL" | "ACCEPTABLE" | "RISKY" | "CRITICAL";

export interface UnresolvedStatusMeta {
  level: UnresolvedStatusLevel;
  label: string;
  color: string;
}

const UNRESOLVED_STATUS_META: Record<UnresolvedStatusLevel, Omit<UnresolvedStatusMeta, "level">> = {
  UNDER_CONTROL: { label: "Bajo control", color: ADMIN_TOKENS.emerald600 },
  ACCEPTABLE: { label: "Aceptable", color: ADMIN_TOKENS.amber700 },
  RISKY: { label: "Riesgoso", color: ADMIN_TOKENS.rose500 },
  CRITICAL: { label: "Crítico", color: ADMIN_TOKENS.rose700 },
};

export function getUnresolvedStatus(level: UnresolvedStatusLevel): UnresolvedStatusMeta {
  return { level, ...UNRESOLVED_STATUS_META[level] };
}
