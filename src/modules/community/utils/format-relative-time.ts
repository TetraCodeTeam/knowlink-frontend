const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

function plural(value: number, singular: string, pluralForm: string): string {
  return `${value} ${value === 1 ? singular : pluralForm}`;
}

/** "Hace 25 min", "Hace 3 horas", "Hace 2 días"… a partir de una fecha ISO del backend. */
export function formatRelativeTime(isoDate: string, now: Date = new Date()): string {
  const elapsed = now.getTime() - new Date(isoDate).getTime();
  if (Number.isNaN(elapsed) || elapsed < MINUTE) return "Hace un momento";
  if (elapsed < HOUR) return `Hace ${Math.floor(elapsed / MINUTE)} min`;
  if (elapsed < DAY) return `Hace ${plural(Math.floor(elapsed / HOUR), "hora", "horas")}`;
  if (elapsed < WEEK) return `Hace ${plural(Math.floor(elapsed / DAY), "día", "días")}`;
  if (elapsed < 30 * DAY) return `Hace ${plural(Math.floor(elapsed / WEEK), "semana", "semanas")}`;
  return new Date(isoDate).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
