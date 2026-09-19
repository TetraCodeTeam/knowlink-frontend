import type { BookingHistoryItem } from "@/modules/class-history/interfaces/responses/booking-history-item.interface";

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export interface DateGroup {
  sessionDate: string;
  items: BookingHistoryItem[];
}

export function groupByDate(items: BookingHistoryItem[]): DateGroup[] {
  const groups: DateGroup[] = [];
  for (const item of items) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.sessionDate === item.sessionDate) {
      lastGroup.items.push(item);
    } else {
      groups.push({ sessionDate: item.sessionDate, items: [item] });
    }
  }
  return groups;
}

export function formatDateHeader(sessionDate: string): string {
  const date = new Date(`${sessionDate}T00:00:00`);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const dayName = DAY_NAMES[date.getDay()];
  const shortDate = `${date.getDate()}/${date.getMonth() + 1}`;

  if (isSameDay(date, today)) return `Hoy - ${dayName} ${shortDate}`;
  if (isSameDay(date, tomorrow)) return `Mañana - ${dayName} ${shortDate}`;
  return `${dayName} ${shortDate}`;
}

export function formatClassCountBadge(count: number): string {
  return count === 1 ? "1 clase" : `${count} clases`;
}

export function formatTime(time: string): string {
  return time.slice(0, 5);
}

export function formatDurationLabel(startTime: string, endTime: string): string {
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  const minutes = endH * 60 + endM - (startH * 60 + startM);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(hours === 1 ? "1 hora" : `${hours} horas`);
  if (remainingMinutes > 0) parts.push(`${remainingMinutes} min`);

  return parts.length > 0 ? parts.join(" ") : "0 min";
}

export function formatPriceLabel(amount: number): string {
  if (amount === 0) return "Clase gratuita";
  return `${amount.toLocaleString("es-AR")} por la clase`;
}

export function buildModalityMessage(item: {
  modality: "VIRTUAL" | "IN_PERSON";
  virtualSessionLink?: string | null;
  address?: string | null;
}): string {
  if (item.modality === "VIRTUAL") {
    return item.virtualSessionLink
      ? `Modalidad virtual. Link: ${item.virtualSessionLink}`
      : "Modalidad virtual. Link a acordar con el alumno";
  }
  return `Modalidad presencial. Dirección: ${item.address ?? "no especificada"}`;
}

export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isWithinVirtualLinkEditWindow(
  sessionDate: string,
  startTime: string,
  editWindowMinutes: number
): boolean {
  const classStart = new Date(`${sessionDate}T${startTime}`);
  const now = new Date();
  const minutesUntilStart = (classStart.getTime() - now.getTime()) / 60000;
  return minutesUntilStart > editWindowMinutes;
}

export function formatSessionDateLabel(sessionDate: string): string {
  const date = new Date(`${sessionDate}T00:00:00`);
  return `${DAY_NAMES[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}`;
}

export function hasFullRefundCancellationWindow(
  sessionDate: string,
  startTime: string,
  windowHours: number
): boolean {
  const classStart = new Date(`${sessionDate}T${startTime}`);
  const now = new Date();
  const hoursUntilStart = (classStart.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntilStart >= windowHours;
}
