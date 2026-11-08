import type { LucideIcon } from "lucide-react";

/** Contadores que pueden mostrarse sobre un ítem del menú. */
export type NavBadgeKey = "complaints" | "requests" | "materialReports" | "sessionClaims";

export type NavBadgeCounts = Partial<Record<NavBadgeKey, number>>;

export interface NavItemConfig {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: NavBadgeKey;
  /**
   * Por defecto el ítem está activo en su ruta y en las rutas hijas. Se usa solo cuando
   * esa regla no alcanza (ej. Inicio también está activo en el hilo de una publicación).
   */
  isActive?: (pathname: string) => boolean;
}

export interface NavGroupConfig {
  /** Sin título, el grupo se muestra sin encabezado. */
  title?: string;
  items: NavItemConfig[];
}

/** Colores de un menú. Cada rol conserva su identidad visual sobre la misma estructura. */
export interface NavTheme {
  topbarBg: string;
  topbarBorder: string;
  sidebarBg: string;
  sidebarBorder: string;
  contentBg: string;
  /** Color del nombre "KnowLink" junto al logo. */
  brandText: string;
  /** Recuadro claro detrás de Frankie en los fondos oscuros, donde su azul se pierde. */
  logoBg?: string;
  /** Texto e íconos de los ítems en reposo. */
  itemText: string;
  groupTitle: string;
  itemHoverBg: string;
  itemActiveBg: string;
  itemActiveText: string;
  divider: string;
  /** Íconos de acción del topbar (campana, menú, avatar). */
  actionColor: string;
  actionHoverBg: string;
  avatarBg: string;
  avatarText: string;
  /** Tipografía del topbar y del menú. */
  fontFamily?: string;
  /** Tipografía del área de contenido, si difiere de la global. */
  contentFontFamily?: string;
}

export interface NavigationConfig {
  theme: NavTheme;
  /** Texto accesible del `<nav>`. */
  ariaLabel: string;
  /** Destino del logo. */
  homePath: string;
  groups: NavGroupConfig[];
  /** Grupo anclado al pie del menú (Ayuda). */
  footerGroup?: NavGroupConfig;
}
