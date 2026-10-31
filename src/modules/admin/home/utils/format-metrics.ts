/**
 * Redondea a un decimal y evita los ".0" que no aparecen en el diseño ("3.8h", "8.2%").
 */
function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

export function formatResolutionHours(hours: number | null): string {
  if (hours === null) {
    return "—";
  }

  return `${roundToOneDecimal(hours)}h`;
}

export function formatPercentValue(value: number): string {
  return `${roundToOneDecimal(value)}%`;
}

/** Para deltas de tarjetas: "+12%", "-5%", "0%". */
export function formatSignedPercent(value: number): string {
  const rounded = roundToOneDecimal(value);

  return rounded > 0 ? `+${rounded}%` : `${rounded}%`;
}
