const relativeFormatter = new Intl.RelativeTimeFormat("es-AR", { numeric: "always" });
const timeFormatter = new Intl.DateTimeFormat("es-AR", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const shortDateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "short",
});

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/**
 * Tiempo relativo de la última denuncia.
 * Casos del diseño: "Hace 2 horas", "Ayer a las 18:20", "Hace 2 días".
 */
export function formatRelativeTime(isoDate: string, now: Date = new Date()): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) return "";

  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0) return "Ahora";

  const diffMinutes = Math.floor(diffMs / MINUTE_MS);
  const dayDiff = Math.round((startOfDay(now) - startOfDay(date)) / DAY_MS);

  if (diffMinutes < 1) return "Hace un momento";
  if (dayDiff === 1 && diffMinutes >= 60) {
    return `Ayer a las ${timeFormatter.format(date)}`;
  }
  if (diffMinutes < 60) {
    return capitalize(relativeFormatter.format(-diffMinutes, "minute"));
  }
  if (dayDiff === 0) {
    return capitalize(relativeFormatter.format(-Math.floor(diffMs / HOUR_MS), "hour"));
  }
  if (dayDiff < 7) {
    return capitalize(relativeFormatter.format(-dayDiff, "day"));
  }

  return capitalize(shortDateFormatter.format(date).replace(/\./g, ""));
}

/** "12 sept 2026" */
export function formatReportDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return capitalize(shortDateFormatter.format(date).replace(/\./g, ""));
}
