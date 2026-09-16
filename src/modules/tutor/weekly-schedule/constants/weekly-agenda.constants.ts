/**
 * Estado de disponibilidad de un bloque: si es un slot libre para reservar
 * o una sesión ya reservada por un alumno (US-52, criterio 1).
 */
export type AgendaBlockKind = "available" | "booked";

export const AGENDA_BLOCK_LABEL: Record<AgendaBlockKind, string> = {
  available: "Disponible",
  booked: "Reservada",
};

/**
 * Tokens de color combinando las 2 dimensiones independientes del bloque:
 * su tipo (available | booked) y si ya pasó (isPast). "Pasado" es una
 * regla transversal: usa el mismo gris tanto para libres como reservados,
 * solo cambia el estilo de borde (punteado vs. sólido), por eso se separa
 * de "tipo" en vez de mezclarse en un único enum de 4 valores.
 */
interface AgendaBlockColorTokens {
  bg: string;
  border: string;
  borderStyle: "dashed" | "solid";
  text: string;
}

export const AGENDA_BLOCK_COLOR: Record<AgendaBlockKind, { current: AgendaBlockColorTokens; past: AgendaBlockColorTokens }> = {
  available: {
    current: {
      bg: "#E0E0FA",
      border: "rgba(63, 76, 174, 0.4)",
      borderStyle: "dashed",
      text: "#3d4bb0",
    },
    past: {
      bg: "rgba(168, 168, 168, 0.6)",
      border: "#999999",
      borderStyle: "dashed",
      text: "#5c5c5c",
    },
  },
  booked: {
    current: {
      bg: "rgba(88, 101, 200, 0.6)",
      border: "rgba(63, 76, 174, 0.3)",
      borderStyle: "solid",
      text: "#ffffff",
    },
    past: {
      bg: "rgba(168, 168, 168, 0.6)",
      border: "#999999",
      borderStyle: "solid",
      text: "#4a4a4a",
    },
  },
};

/** Leyenda de la grilla (US-52): 3 estados visibles para el tutor. */
export const AGENDA_LEGEND_ITEMS = [
  { label: "Disponibles", color: AGENDA_BLOCK_COLOR.available.current.bg },
  { label: "Finalizadas", color: AGENDA_BLOCK_COLOR.available.past.bg },
  { label: "Reservadas", color: AGENDA_BLOCK_COLOR.booked.current.bg },
] as const;

/** Ventana horaria visible en la grilla semanal. */
export const AGENDA_CALENDAR_SLOT_MIN_TIME = "08:00:00";
export const AGENDA_CALENDAR_SLOT_MAX_TIME = "21:00:00";
export const AGENDA_CALENDAR_SLOT_DURATION = "00:30:00";