import { MAX_LOOKBACK_YEARS } from "@/modules/tutor/statistics/constants/statistics.constants";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** yyyy-MM-dd en hora local (toISOString usaría UTC y podría correr el día). */
export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseIsoDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Resta años sin desbordar el mes (29 feb → 28 feb), igual que LocalDate.minusYears del backend. */
export function subtractYears(date: Date, years: number): Date {
  const year = date.getFullYear() - years;
  const lastDayOfMonth = new Date(year, date.getMonth() + 1, 0).getDate();
  return new Date(year, date.getMonth(), Math.min(date.getDate(), lastDayOfMonth));
}

export function getEarliestCustomDate(today: Date): string {
  return toIsoDate(subtractYears(today, MAX_LOOKBACK_YEARS));
}

const dayMonthYear = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dayMonth = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short" });

function withoutDots(value: string): string {
  return value.replace(/\./g, "");
}

/** "1 ago 2026" */
export function formatDate(value: string): string {
  return withoutDots(dayMonthYear.format(parseIsoDate(value)));
}

/** "1 ago 2026 – 22 oct 2026" */
export function formatPeriodRange(from: string, to: string): string {
  return `${formatDate(from)} – ${formatDate(to)}`;
}

/** "22 sep – 22 oct": versión compacta para el botón del período personalizado. */
export function formatCompactRange(from: string, to: string): string {
  return `${withoutDots(dayMonth.format(parseIsoDate(from)))} – ${withoutDots(dayMonth.format(parseIsoDate(to)))}`;
}

const monthShort = new Intl.DateTimeFormat("es-AR", { month: "short" });

/** "2026-08" → "Ago" (o "Ago 26" cuando el rango abarca más de un año). */
export function formatMonthLabel(month: string, includeYear: boolean): string {
  const [year, monthNumber] = month.split("-").map(Number);
  const name = withoutDots(monthShort.format(new Date(year, monthNumber - 1, 1)));
  const label = name.charAt(0).toUpperCase() + name.slice(1);
  return includeYear ? `${label} ${String(year).slice(2)}` : label;
}
