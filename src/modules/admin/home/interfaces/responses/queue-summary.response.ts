/**
 * Métricas comunes a las dos colas de moderación.
 * Corresponden siempre a la semana actual, sin importar el `range` del panel de rendimiento.
 */
export interface QueueSummary {
  resolvedThisWeek: number;
  /** Variación porcentual contra la semana anterior. `null` si no hay base de comparación. */
  resolvedDeltaPct: number | null;
  newThisWeek: number;
}
