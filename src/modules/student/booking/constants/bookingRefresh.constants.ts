/**
 * Cada cuánto se vuelve a pedir el calendario de reservas mientras la pantalla está visible.
 *
 * El backend recorta los bloques de hoy que ya empezaron (los muestra desde el próximo múltiplo de
 * 30 min y oculta el tramo que queda si dura menos de 1 h). Esa vista cambia solo con el paso del
 * tiempo, sin ningún evento: una pantalla abierta desde antes mostraría franjas que ya no se pueden
 * reservar. Un minuto es lo bastante corto para no mostrarlas mucho tiempo y lo bastante largo para
 * que sea una consulta liviana.
 */
export const BOOKING_CALENDAR_REFRESH_INTERVAL_MS = 60_000;

/** Cada cuánto avanza la línea de "ahora" y el estado de "pasado" de las franjas del calendario. */
export const BOOKING_CALENDAR_CLOCK_INTERVAL_MS = 60_000;
