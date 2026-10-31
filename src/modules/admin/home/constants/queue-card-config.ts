import { Clock, TriangleAlert, type LucideIcon } from "lucide-react";
import { adminPaths } from "@/routes/paths";
import { ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";

export type QueueCardVariant = "claims" | "reports";

export interface QueueCardConfig {
  title: string;
  subtitle: string;
  path: string;
  icon: LucideIcon;
  stripe: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
  pillEmphasis: string;
}

/**
 * Textos, colores y destino de cada tarjeta de cola.
 * Tipado contra el union para que TypeScript avise si falta una variante.
 */
export const QUEUE_CARD_CONFIG: Record<QueueCardVariant, QueueCardConfig> = {
  claims: {
    title: "Reclamo de sesiones",
    subtitle: "Conflictos entre tutores y alumnos",
    path: adminPaths.sessionClaims,
    icon: Clock,
    stripe: `linear-gradient(90deg, ${ADMIN_TOKENS.indigo500} 0%, ${ADMIN_TOKENS.indigo600} 100%)`,
    iconBg: ADMIN_TOKENS.indigo50,
    iconBorder: ADMIN_TOKENS.indigo100,
    iconColor: ADMIN_TOKENS.indigo600,
    pillBg: ADMIN_TOKENS.indigo50,
    pillBorder: ADMIN_TOKENS.indigo100,
    pillText: ADMIN_TOKENS.indigo900,
    pillEmphasis: ADMIN_TOKENS.indigo700,
  },
  reports: {
    title: "Denuncias de material",
    subtitle: "Infracciones de copyright y guías indebidas",
    path: adminPaths.materialReports,
    icon: TriangleAlert,
    stripe: `linear-gradient(90deg, ${ADMIN_TOKENS.rose500} 0%, ${ADMIN_TOKENS.amber500} 100%)`,
    iconBg: ADMIN_TOKENS.rose50,
    iconBorder: ADMIN_TOKENS.rose100,
    iconColor: ADMIN_TOKENS.rose500,
    pillBg: ADMIN_TOKENS.rose50,
    pillBorder: ADMIN_TOKENS.rose100,
    pillText: ADMIN_TOKENS.rose900,
    pillEmphasis: ADMIN_TOKENS.rose700,
  },
};
