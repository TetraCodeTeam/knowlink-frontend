const STORAGE_KEY = "knowlink:ratedBookingIds";

function readRatedBookingIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function hasRatedBooking(bookingId: string): boolean {
  return readRatedBookingIds().includes(bookingId);
}

export function markBookingAsRated(bookingId: string): void {
  try {
    const ids = readRatedBookingIds();
    if (!ids.includes(bookingId)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids, bookingId]));
    }
  } catch {
    // Storage unavailable (private mode, quota, etc.): the server-side 409/422
    // check on submit still prevents a duplicate rating from being accepted.
  }
}
