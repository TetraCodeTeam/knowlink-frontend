import type { VolumeSplit } from "@/modules/admin/home/interfaces/responses/volume-split.response";

/**
 * Los porcentajes se redondean a 10 decimales para eliminar el ruido de coma flotante
 * (`58 / 100 * 100` da `57.99999999999999`). No afecta al ancho visible de la barra.
 */
const ROUNDING_FACTOR = 1e10;

function roundToPrecision(value: number): number {
  return Math.round(value * ROUNDING_FACTOR) / ROUNDING_FACTOR;
}

/**
 * Normaliza la distribución para que los anchos siempre sumen 100 %.
 * Si el backend manda valores inconsistentes (negativos o suma distinta de 100),
 * la barra no se rompe ni desborda.
 */
export function normalizeVolumeSplit(split: VolumeSplit): VolumeSplit {
  const claims = Math.max(0, split.claimsPct);
  const reports = Math.max(0, split.reportsPct);
  const total = claims + reports;

  if (total === 0) {
    return { claimsPct: 0, reportsPct: 0 };
  }

  const claimsPct = roundToPrecision((claims / total) * 100);

  return { claimsPct, reportsPct: roundToPrecision(100 - claimsPct) };
}
