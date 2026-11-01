/**
 * Distribución del volumen operativo entre las dos colas.
 * `claimsPct + reportsPct === 100`.
 */
export interface VolumeSplit {
  claimsPct: number;
  reportsPct: number;
}
