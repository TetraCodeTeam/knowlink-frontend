import type { NavBadgeKey } from "@/modules/app-shell/interfaces/navigation.interface";

export const TOPBAR_HEIGHT = 64;
export const SIDEBAR_WIDTH_EXPANDED = 232;
export const SIDEBAR_WIDTH_COLLAPSED = 76;
export const SIDEBAR_DRAWER_WIDTH = 280;
/** Ancho de Frankie como logo; el alto sale de su proporción y cabe holgado en el topbar. */
export const BRAND_LOGO_SIZE = 52;
/** Con recuadro de fondo (temas oscuros) Frankie se achica para dejar margen dentro de él. */
export const BRAND_LOGO_TILE_SIZE = 46;
export const BRAND_LOGO_IN_TILE_SIZE = 38;

/** Por debajo de este ancho el menú pasa a un cajón que se abre desde el topbar. */
export const COMPACT_VIEWPORT_QUERY = "(max-width:899.95px)";

/** Desde este ancho el menú arranca expandido; por debajo, como riel de íconos. */
export const SIDEBAR_AUTO_EXPAND_QUERY = "(min-width:1280px)";

export const SIDEBAR_COLLAPSED_STORAGE_KEY = "knowlink.sidebar.collapsed";

export const LAYOUT_Z_INDEX = {
  sidebar: 100,
  notificationsBackdrop: 101,
  notificationsPanel: 102,
  topbar: 105,
} as const;

export const NAV_BADGE_COLOR = "#E5484D";
export const NAV_BADGE_MAX = 99;

/** Texto que lee un lector de pantalla junto al nombre del ítem. */
export const NAV_BADGE_DESCRIPTION: Record<NavBadgeKey, (count: number) => string> = {
  complaints: (count) => `${count} sin leer`,
  requests: (count) => `${count} ${count === 1 ? "pendiente" : "pendientes"}`,
  materialReports: (count) => `${count} ${count === 1 ? "pendiente" : "pendientes"}`,
  sessionClaims: (count) => `${count} ${count === 1 ? "pendiente" : "pendientes"}`,
};
