import { useMemo } from "react";
import type { NavBadgeCounts } from "@/modules/app-shell/interfaces/navigation.interface";
import { useTutorBadgesStore } from "@/modules/tutor/hooks/useTutorBadgesStore";

/** Contadores del menú del tutor. */
export function useTutorNavBadges(): NavBadgeCounts {
  const requestsCount = useTutorBadgesStore((state) => state.requestsCount);

  return useMemo(() => ({ requests: requestsCount }), [requestsCount]);
}
