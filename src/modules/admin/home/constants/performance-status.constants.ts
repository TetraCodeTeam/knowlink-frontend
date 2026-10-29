import { ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";

export type UnresolvedStatusLevel = "ok" | "warning" | "critical";

export interface UnresolvedStatusMeta {
  level: UnresolvedStatusLevel;
  label: string;
  color: string;
}

/**
 * Umbrales provisionales acordados en el spec (decisión abierta #3):
 * < 15 % bajo control, < 30 % atención, >= 30 % crítico.
 */
export const UNRESOLVED_STATUS_THRESHOLDS = {
  warning: 15,
  critical: 30,
} as const;

const UNRESOLVED_STATUS_META: Record<UnresolvedStatusLevel, Omit<UnresolvedStatusMeta, "level">> = {
  ok: { label: "Bajo control", color: ADMIN_TOKENS.emerald600 },
  warning: { label: "Atención", color: ADMIN_TOKENS.amber700 },
  critical: { label: "Crítico", color: ADMIN_TOKENS.rose700 },
};

export function getUnresolvedStatus(pct: number): UnresolvedStatusMeta {
  let level: UnresolvedStatusLevel = "critical";

  if (pct < UNRESOLVED_STATUS_THRESHOLDS.warning) {
    level = "ok";
  } else if (pct < UNRESOLVED_STATUS_THRESHOLDS.critical) {
    level = "warning";
  }

  return { level, ...UNRESOLVED_STATUS_META[level] };
}
