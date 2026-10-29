import { BookAlert, House, Scale, type LucideIcon } from "lucide-react";
import { adminPaths } from "@/routes/paths";

export type AdminNavBadge = "materialReports" | "sessionClaims";

export interface AdminNavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  /**
   * Reservado para el contador numérico del sidebar.
   * La semántica del badge aún no está definida, por eso no se renderiza.
   */
  badge?: AdminNavBadge;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: "Home",
    path: adminPaths.home,
    icon: House,
  },
  {
    label: "Denuncias",
    path: adminPaths.materialReports,
    icon: BookAlert,
    badge: "materialReports",
  },
  {
    label: "Reclamos de sesiones",
    path: adminPaths.sessionClaims,
    icon: Scale,
    badge: "sessionClaims",
  },
];
