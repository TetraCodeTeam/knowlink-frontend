const DATE_FORMATTER = new Intl.DateTimeFormat("es-AR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

type DatePartType = "weekday" | "day" | "month" | "year";

interface DateParts {
  weekday: string;
  day: string;
  month: string;
  year: string;
}

/**
 * Fallback para entornos con ICU reducido que no devuelven `weekday` en `formatToParts`.
 * Los índices siguen `Date.getDay()` / `Date.getMonth()`.
 */
const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getParts(date: Date): DateParts {
  const parts = DATE_FORMATTER.formatToParts(date);
  const find = (type: DatePartType) => parts.find((part) => part.type === type)?.value;

  return {
    weekday: find("weekday") ?? WEEKDAYS[date.getDay()],
    day: find("day") ?? String(date.getDate()),
    month: find("month") ?? MONTHS[date.getMonth()],
    year: find("year") ?? String(date.getFullYear()),
  };
}

/**
 * Formatea una fecha como "Lunes 15 de junio, 2026".
 *
 * No se usa el string directo de `Intl` porque `es-AR` produce
 * "lunes, 15 de junio de 2026" (coma tras el día y "de" antes del año).
 */
export function formatAdminDate(date: Date): string {
  const { weekday, day, month, year } = getParts(date);
  return capitalize(`${weekday} ${day} de ${month}, ${year}`);
}
