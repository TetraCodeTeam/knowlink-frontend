/**
 * Un horario que termina a medianoche (24:00) viaja y se guarda en el backend como 23:59:59.999999
 * (EndOfDay.TIME): 00:00 sería el inicio del día. Estas funciones lo reconocen como 24:00 para
 * mostrarlo y para calcular duraciones.
 */
export const END_OF_DAY_TIME = "23:59:59.999999";

export const MINUTES_PER_DAY = 24 * 60;

/** Compara como texto, válido porque las horas llegan siempre como HH:mm:ss[.ffffff]. */
export function isEndOfDayTime(time: string): boolean {
  return time >= "23:59:59";
}

/** "10:30:00" → "10:30"; el fin de día se muestra como "24:00". */
export function formatClockTime(time: string): string {
  return isEndOfDayTime(time) ? "24:00" : time.slice(0, 5);
}

/** Minutos desde las 00:00; el fin de día vale 1440. */
export function toMinutesOfDay(time: string): number {
  if (isEndOfDayTime(time)) return MINUTES_PER_DAY;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Hora de fin de un bloque seleccionado en el calendario. Si termina a las 00:00 del día siguiente
 * (24:00) se envía como fin de día, para que el backend no lo confunda con el inicio del mismo día.
 */
export function toBlockEndTime(start: Date, end: Date): string {
  const endsAtMidnight =
    end.getHours() === 0 && end.getMinutes() === 0 && end.getDate() !== start.getDate();
  return endsAtMidnight ? END_OF_DAY_TIME : end.toTimeString().slice(0, 8);
}
