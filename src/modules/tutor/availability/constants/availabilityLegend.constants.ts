export interface LegendItem {
  label: string;
  color: string;
}

export const AVAILABILITY_LEGEND: LegendItem[] = [
  { label: "Disponible", color: "#5B6ED9" },
  { label: "Día pasado (no disponible)", color: "#f7f7fb" },
];