import { TOPBAR_HEIGHT } from "@/modules/student/components/StudentTopbar";
import type { Role } from "@/shared/types/role.type";

/** Tramos de alto de ventana y escala de la página en cada uno (de menor a mayor). */
const SCALE_STEPS = [
  { minHeight: 800, zoom: 1.05 },
  { minHeight: 950, zoom: 1.15 },
  { minHeight: 1150, zoom: 1.3 },
] as const;

/** Alto disponible bajo el layout. El del alumno tiene topbar fija; el del tutor no. */
const getAvailableHeight = (role: Role) =>
  role === "STUDENT" ? `(100vh - ${TOPBAR_HEIGHT}px)` : "100vh";

/** Alto mínimo del área de contenido, para que la página ocupe toda la ventana. */
export const getPageMinHeight = (role: Role) => `calc(${getAvailableHeight(role)})`;

/**
 * Además de ocupar toda la ventana, escala la página por tramos de alto para que en
 * pantallas altas los componentes crezcan en vez de dejar un vacío al pie.
 * No usarlo en páginas con menús o popovers de MUI (se renderizan fuera de la página
 * y el zoom los descoloca).
 */
export const getPageScaleSx = (role: Role) => {
  const available = getAvailableHeight(role);

  const steps = Object.fromEntries(
    SCALE_STEPS.map(({ minHeight, zoom }) => [
      `@media (min-height: ${minHeight}px)`,
      // El alto también se escala con el zoom, por eso se divide.
      { zoom, minHeight: `calc(${available} / ${zoom})` },
    ])
  );

  return { minHeight: getPageMinHeight(role), ...steps };
};
