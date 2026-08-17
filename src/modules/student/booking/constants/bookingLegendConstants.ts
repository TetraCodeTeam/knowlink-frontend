// Mismo patrón que modules/tutor/availability/constants/availability-legend.constants.ts
export interface BookingLegendItem {
  label: string;
  color: string;
  description?: string; // Si tiene texto, el label muestra un ícono (i) con tooltip informativo
}

export const BOOKING_STATUS_META = {
  BLOCKED: {
    label: "Bloqueado",
    color: "#f5d98a",
    description:
      "Bloqueado por otro estudiante. En unos minutos puede liberarse o quedar reservado.",
  },
  RESERVED: {
    label: "Reservado",
    color: "#b3b5c0",
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
  },
  SELECTED: {
    label: "Seleccionado",
    color: "#5865C8",
  },
} satisfies Record<string, BookingLegendItem>;

export const BOOKING_CALENDAR_LEGEND: BookingLegendItem[] = [
  BOOKING_STATUS_META.BLOCKED,
  BOOKING_STATUS_META.RESERVED,
  BOOKING_STATUS_META.PAST,
  BOOKING_STATUS_META.AVAILABLE,
  BOOKING_STATUS_META.SELECTED,
];

export const STATUS_TO_LEGEND_LABEL: Record<string, string> = {
  BLOCKED: BOOKING_STATUS_META.BLOCKED.label,
  RESERVED: BOOKING_STATUS_META.RESERVED.label,
  PAST: BOOKING_STATUS_META.PAST.label,
  AVAILABLE: BOOKING_STATUS_META.AVAILABLE.label,
  SELECTED: BOOKING_STATUS_META.SELECTED.label,
};
