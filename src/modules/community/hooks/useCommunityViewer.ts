import { useMemo } from "react";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { getCommunityPaths } from "@/modules/community/utils/community-paths";
import type { Role } from "@/shared/types/role.type";

/** Quién está viendo la comunidad: su rol activo define las rutas y qué acciones se ofrecen. */
export function useCommunityViewer() {
  const authResponse = useAuthStore((state) => state.authResponse);
  const role: Role = authResponse?.role === "TUTOR" ? "TUTOR" : "STUDENT";
  const paths = useMemo(() => getCommunityPaths(role), [role]);

  return {
    userId: authResponse?.userId ?? "",
    fullName: authResponse?.fullName ?? authResponse?.email.split("@")[0] ?? "",
    role,
    paths,
  };
}
