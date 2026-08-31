const MONTHS_ES = [
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

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// "24-30 Agosto 2026" (mismo mes) | "27 Jul - 2 Ago 2026" (cruza mes) |
// "30 Dic 2026 - 5 Ene 2027" (cruza año)
export function formatWeekRangeTitle(start: Date, end: Date): string {
  const startMonth = capitalize(MONTHS_ES[start.getMonth()]);
  const endMonth = capitalize(MONTHS_ES[end.getMonth()]);

  if (start.getFullYear() !== end.getFullYear()) {
    return `${start.getDate()} ${startMonth} ${start.getFullYear()} - ${end.getDate()} ${endMonth} ${end.getFullYear()}`;
  }
  if (start.getMonth() !== end.getMonth()) {
    return `${start.getDate()} ${startMonth} - ${end.getDate()} ${endMonth} ${end.getFullYear()}`;
  }
  return `${start.getDate()}-${end.getDate()} ${startMonth} ${end.getFullYear()}`;
}

export function getCurrentWeekMonday(): Date {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getWeekEnd(weekMonday: Date): Date {
  const end = new Date(weekMonday);
  end.setDate(end.getDate() + 6);
  return end;
}

export function isBeforeToday(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
}

export function isBeforeNow(date: Date): boolean {
  return date.getTime() < Date.now();
}

export function toLocalDateTimeStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;
}