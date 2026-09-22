export interface BookingLegendItem {
  label: string;
  color: string;
  description?: string; // Si tiene texto, el label muestra un ícono (i) con tooltip informativo
}

export type BookingStatusKey = "BLOCKED" | "RESERVED" | "PAST" | "AVAILABLE" | "SELECTED";

export const BOOKING_STATUS_META: Record<BookingStatusKey, BookingLegendItem> = {
  BLOCKED: {
    label: "Bloqueado",
    color: "#f5d98a",
    description:
      "Bloqueado por otro estudiante. En unos minutos puede liberarse o quedar reservado.",
  },
  RESERVED: {
    label: "Reservado",
    color: "#64748b",
    description: "Reservado por otro estudiante. Este horario ya no está disponible.",
  },
  PAST: {
    label: "Pasado",
    color: "#cacad1",
    description: "Este horario ya pasó.",
  },
  AVAILABLE: {
    label: "Disponible",
    color: "#acb2e4",
    description: "Mantené presionado y deslizá hacia abajo para reservar varias horas seguidas.",
  },
  SELECTED: {
    label: "Seleccionado por vos",
    color: "#5865C8",
    description:
      "Es el horario que seleccionaste. Tenés tiempo limitado para confirmarlo antes de que expire.",
  },
};

export const BOOKING_CALENDAR_LEGEND: BookingLegendItem[] = [
  BOOKING_STATUS_META.BLOCKED,
  BOOKING_STATUS_META.RESERVED,
  BOOKING_STATUS_META.PAST,
  BOOKING_STATUS_META.AVAILABLE,
  BOOKING_STATUS_META.SELECTED,
];

export const STATUS_TO_LEGEND_LABEL: Record<BookingStatusKey, string> = {
  BLOCKED: BOOKING_STATUS_META.BLOCKED.label,
  RESERVED: BOOKING_STATUS_META.RESERVED.label,
  PAST: BOOKING_STATUS_META.PAST.label,
  AVAILABLE: BOOKING_STATUS_META.AVAILABLE.label,
  SELECTED: BOOKING_STATUS_META.SELECTED.label,
};
