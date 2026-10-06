import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";

function getStorageKey(): string | null {
  const userId = useAuthStore.getState().authResponse?.userId;
  // Without a signed-in user there is no identity to namespace by, so there
  // is nothing safe to read or persist.
  return userId ? `knowlink:ratedBookingIds:${userId}` : null;
}

function readRatedBookingIds(storageKey: string): string[] {
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function hasRatedBooking(bookingId: string): boolean {
  const storageKey = getStorageKey();
  if (!storageKey) return false;
  return readRatedBookingIds(storageKey).includes(bookingId);
}

export function markBookingAsRated(bookingId: string): void {
  const storageKey = getStorageKey();
  if (!storageKey) return;
  try {
    const ids = readRatedBookingIds(storageKey);
    if (!ids.includes(bookingId)) {
      localStorage.setItem(storageKey, JSON.stringify([...ids, bookingId]));
    }
  } catch {
    // Storage unavailable (private mode, quota, etc.): the server-side 409
    // check on submit still prevents a duplicate rating from being accepted.
  }
}
