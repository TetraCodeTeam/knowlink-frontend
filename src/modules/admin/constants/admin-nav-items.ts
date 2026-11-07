import { alpha } from "@mui/material";
import { BookAlert, House, Scale } from "lucide-react";
import type { NavigationConfig } from "@/modules/app-shell/interfaces/navigation.interface";
import {
  ADMIN_CONTENT_FONT_FAMILY,
  ADMIN_SIDEBAR_ACTIVE_BG,
  ADMIN_SIDEBAR_FONT_FAMILY,
  ADMIN_SIDEBAR_HOVER_BG,
  ADMIN_TOKENS,
} from "@/modules/admin/styles/admin-tokens";
import { adminPaths } from "@/routes/paths";

/**
 * El contador pendiente de cada ítem sale de GET /navigation/badges
 * (ver `useAdminNavigationBadges`).
 */
export const ADMIN_NAVIGATION: NavigationConfig = {
  ariaLabel: "Navegación del administrador",
  homePath: adminPaths.home,
  theme: {
    topbarBg: ADMIN_TOKENS.sidebarBg,
    topbarBorder: alpha(ADMIN_TOKENS.fondo3, 0.12),
    sidebarBg: ADMIN_TOKENS.sidebarBg,
    sidebarBorder: alpha(ADMIN_TOKENS.fondo3, 0.12),
    contentBg: ADMIN_TOKENS.fondo3,
    brandText: ADMIN_TOKENS.celeste,
    logoBg: ADMIN_TOKENS.fondo3,
    itemText: ADMIN_TOKENS.fondo3,
    groupTitle: alpha(ADMIN_TOKENS.fondo3, 0.6),
    itemHoverBg: ADMIN_SIDEBAR_HOVER_BG,
    itemActiveBg: ADMIN_SIDEBAR_ACTIVE_BG,
    itemActiveText: ADMIN_TOKENS.fondo3,
    divider: alpha(ADMIN_TOKENS.fondo3, 0.24),
    actionColor: ADMIN_TOKENS.fondo3,
    actionHoverBg: ADMIN_SIDEBAR_HOVER_BG,
    avatarBg: alpha(ADMIN_TOKENS.celeste, 0.28),
    avatarText: ADMIN_TOKENS.fondo3,
    fontFamily: ADMIN_SIDEBAR_FONT_FAMILY,
    contentFontFamily: ADMIN_CONTENT_FONT_FAMILY,
  },
  groups: [
    {
      items: [{ label: "Inicio", path: adminPaths.home, icon: House }],
    },
    {
      title: "Moderación",
      items: [
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
      ],
    },
  ],
};
