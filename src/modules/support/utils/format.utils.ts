const longDateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const shortDateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

// Recibe fechas ISO (yyyy-MM-dd). Se fuerza UTC para que el día no se corra por zona horaria.
const parseIsoDate = (isoDate: string): Date => new Date(`${isoDate}T00:00:00Z`);

/** "15 de julio de 2026" */
export const formatLongDate = (isoDate: string): string =>
  longDateFormatter.format(parseIsoDate(isoDate));

/** "28 jun 2026" */
export const formatShortDate = (isoDate: string): string =>
  shortDateFormatter.format(parseIsoDate(isoDate)).replace(/\./g, "");

export const pluralizeReports = (count: number): string =>
  `${count} ${count === 1 ? "denuncia" : "denuncias"}`;
