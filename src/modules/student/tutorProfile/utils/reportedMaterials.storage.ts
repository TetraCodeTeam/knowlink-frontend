import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";

function getStorageKey(): string | null {
  const userId = useAuthStore.getState().authResponse?.userId;
  // Without a signed-in user there is no identity to namespace by, so there
  // is nothing safe to read or persist.
  return userId ? `knowlink:reportedMaterialIds:${userId}` : null;
}

function readReportedMaterialIds(storageKey: string): string[] {
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function hasReportedMaterial(materialId: string): boolean {
  const storageKey = getStorageKey();
  if (!storageKey) return false;
  return readReportedMaterialIds(storageKey).includes(materialId);
}

export function markMaterialAsReported(materialId: string): void {
  const storageKey = getStorageKey();
  if (!storageKey) return;
  try {
    const ids = readReportedMaterialIds(storageKey);
    if (!ids.includes(materialId)) {
      localStorage.setItem(storageKey, JSON.stringify([...ids, materialId]));
    }
  } catch {
    // Storage unavailable (private mode, quota, etc.): the server-side 409
    // check on submit still prevents a duplicate report from being accepted.
  }
}
