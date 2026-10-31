const decimalFormatter = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const hoursFormatter = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 });

export const NO_VALUE = "—";

/** 4.6 → "4,6" */
export function formatRating(value: number | null): string {
  return value === null ? NO_VALUE : decimalFormatter.format(value);
}

/** 90 → "90%"; con decimales redondea (la tasa llega con 1 decimal). */
export function formatPercent(value: number | null): string {
  return value === null ? NO_VALUE : `${Math.round(value)}%`;
}

export function formatHours(value: number): string {
  return `${hoursFormatter.format(value)} h`;
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

/** "3 sesiones" / "1 sesión" */
export function formatCount(count: number, singular: string, plural: string): string {
  return `${count} ${pluralize(count, singular, plural)}`;
}

export type DeltaTone = "positive" | "negative" | "neutral";

export interface PeriodDelta {
  text: string;
  tone: DeltaTone;
}

export function describeDelta(current: number, previous: number): PeriodDelta {
  const delta = current - previous;
  if (delta === 0) {
    return { text: "Igual que el período anterior", tone: "neutral" };
  }
  const sign = delta > 0 ? "+" : "−";
  return {
    text: `${sign}${Math.abs(delta)} respecto al período anterior`,
    tone: delta > 0 ? "positive" : "negative",
  };
}
