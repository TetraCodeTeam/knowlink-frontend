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

const SESSION_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;

/**
 * Formatea una fecha ISO `yyyy-MM-dd` como "22 de julio".
 *
 * Se parsean las partes a mano para evitar el corrimiento de un día que produce
 * `new Date("2026-07-22")` al interpretarse como UTC.
 */
export function formatSessionDate(isoDate: string): string {
  const match = SESSION_DATE_PATTERN.exec(isoDate);
  if (!match) return isoDate;

  const month = Number(match[2]);
  const day = Number(match[3]);
  const monthName = MONTHS[month - 1];

  if (monthName === undefined || Number.isNaN(day)) return isoDate;

  return `${day} de ${monthName}`;
}
