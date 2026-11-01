export type AdminStatusTone = "warning" | "info" | "success" | "danger";

export interface AdminStatusMeta {
  label: string;
  tone: AdminStatusTone;
  /** Color de la franja lateral de la fila. */
  accent: string;
}
