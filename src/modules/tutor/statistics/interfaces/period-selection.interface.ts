import type { StatisticsPeriodType } from "@/modules/tutor/statistics/types/statistics-period.type";

/** Período elegido en la pantalla. `from` y `to` (yyyy-MM-dd) solo existen con CUSTOM. */
export interface PeriodSelection {
  period: StatisticsPeriodType;
  from?: string;
  to?: string;
}
