import type { StatisticsPeriodType } from "@/modules/tutor/statistics/types/statistics-period.type";

/** `from` y `to` (yyyy-MM-dd) solo se envían, y son obligatorios, con `period` CUSTOM. */
export interface TutorStatisticsParams {
  period: StatisticsPeriodType;
  from?: string;
  to?: string;
}
