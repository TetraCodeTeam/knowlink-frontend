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

export function normalizeBlocks(blocks: { date: string; startTime: string; endTime: string }[]): string {
  return blocks
    .map((b) => `${b.date}|${b.startTime}|${b.endTime}`)
    .sort()
    .join(",");
}