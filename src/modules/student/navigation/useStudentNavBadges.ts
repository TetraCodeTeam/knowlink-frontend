import { useEffect, useMemo } from "react";
import type { NavBadgeCounts } from "@/modules/app-shell/interfaces/navigation.interface";
import { useStudentBadgesStore } from "@/modules/student/hooks/useStudentBadgesStore";
import { useSupportUnreadCount } from "@/modules/student/support/hooks/useSupportUnreadCount";

/** Contadores del menú del alumno. El de reclamos se comparte con la página de soporte. */
export function useStudentNavBadges(): NavBadgeCounts {
  const complaintsCount = useStudentBadgesStore((state) => state.complaintsCount);
  const setComplaintsCount = useStudentBadgesStore((state) => state.setComplaintsCount);
  const { data: supportUnreadCount } = useSupportUnreadCount();

  useEffect(() => {
    if (supportUnreadCount) setComplaintsCount(supportUnreadCount.unreadCount);
  }, [supportUnreadCount, setComplaintsCount]);

  return useMemo(() => ({ complaints: complaintsCount }), [complaintsCount]);
}
