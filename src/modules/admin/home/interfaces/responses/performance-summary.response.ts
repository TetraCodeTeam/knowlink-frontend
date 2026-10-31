import type { UnresolvedStatusLevel } from "@/modules/admin/home/constants/performance-status.constants";
import type { VolumeSplit } from "@/modules/admin/home/interfaces/responses/volume-split.response";

export interface PerformanceSummary {
  /** Tiempo promedio de resolución en horas. `null` si no hay datos del período. */
  avgResolutionHours: number | null;
  /**
   * Variación porcentual del TTR contra el período anterior equivalente.
   * Positivo = más rápido. `null` si no hay base de comparación.
   */
  avgResolutionDeltaPct: number | null;
  /** Porcentaje de tareas sin resolver del período (0–100). */
  unresolvedPct: number;
  /** Semáforo calculado por el backend; el frontend no lo recalcula. */
  unresolvedLevel: UnresolvedStatusLevel;
  volumeSplit: VolumeSplit;
}
