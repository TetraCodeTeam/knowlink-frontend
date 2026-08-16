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
    description: "Reservado definitivamente por otro estudiante. Este horario ya no está disponible.",
  },
  {
    label: "Ocupado",
    color: "#e2e2ea",
  },
  {
    label: "Seleccionado",
    color: "#5865C8",
  },
];