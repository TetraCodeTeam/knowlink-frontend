// Mismo patrón que modules/tutor/availability/constants/availability-legend.constants.ts
export interface BookingLegendItem {
  label: string;
  color: string;
  description?: string; // Si tiene texto, el label muestra un ícono (i) con tooltip informativo
}

export const BOOKING_CALENDAR_LEGEND: BookingLegendItem[] = [
  {
    label: "Bloqueado",
    color: "#f5d98a",
    description: "Bloqueado por otro estudiante. En unos minutos puede liberarse o quedar reservado.",
  },
  {
    label: "Ocupado",
    color: "#e2e2ea",
  },
  {
    label: "Seleccionado",
    color: "#5B6ED9",
  },
];