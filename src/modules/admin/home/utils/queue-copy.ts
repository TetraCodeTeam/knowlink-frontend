import { pluralize } from "@/modules/admin/home/utils/pluralize";

/**
 * Fragmento de copy de un pill. Permite resaltar una parte con otro color
 * sin meter JSX en los utils (el diseño usa dos tonos en cada pill).
 */
export interface PillSegment {
  text: string;
  emphasis: boolean;
}

export function buildOldestPendingCopy(days: number | null): PillSegment[] {
  if (days === null) {
    return [{ text: "No hay reclamos pendientes", emphasis: false }];
  }

  const wholeDays = Math.floor(days);

  if (wholeDays < 1) {
    return [
      { text: "La más antigua espera hace ", emphasis: false },
      { text: "menos de un día", emphasis: true },
    ];
  }

  return [
    { text: "La más antigua espera hace ", emphasis: false },
    { text: `${wholeDays} ${pluralize(wholeDays, "día", "días")}`, emphasis: true },
  ];
}

export function buildPendingReportsCopy(files: number, reports: number): PillSegment[] {
  if (files <= 0) {
    return [{ text: "No hay denuncias sin revisar", emphasis: false }];
  }

  const filesLabel = `${files} ${pluralize(files, "archivo", "archivos")}`;
  const reportsLabel = `${reports} ${pluralize(reports, "reporte", "reportes")}`;

  return [
    { text: `${filesLabel} `, emphasis: true },
    { text: `con ${reportsLabel} sin revisar`, emphasis: false },
  ];
}
