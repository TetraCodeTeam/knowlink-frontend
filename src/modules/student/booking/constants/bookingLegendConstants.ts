// Mismo patrón que modules/tutor/availability/constants/availability-legend.constants.ts
export interface BookingLegendItem {
  label: string;
  color: string;
  description?: string; // Si tiene texto, el label muestra un ícono (i) con tooltip informativo
}

export const BOOKING_CALENDAR_LEGEND: BookingLegendItem[] = [
  {
    label: "Disponible",
    color: "#acb2e4",
  },
  {
    label: "Bloqueado",
    color: "#f5d98a",
    description:
      "Bloqueado por otro estudiante. En unos minutos puede liberarse o quedar reservado.",
  },
  {
    label: "Reservado",
    color: "#dfe1ec",
    description: "Reservado por otro estudiante. Este horario ya no está disponible.",
  },
  {
    label: "Pasado",
    color: "#e2e2ea",
  },
  {
    label: "Seleccionado",
    color: "#5865C8",
  },
];
