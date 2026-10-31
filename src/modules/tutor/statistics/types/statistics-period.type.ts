export type StatisticsPeriodType = "LAST_MONTH" | "LAST_3_MONTHS" | "THIS_YEAR" | "CUSTOM";

/** Períodos rápidos: los que se resuelven en el backend sin enviar fechas. */
export type QuickStatisticsPeriodType = Exclude<StatisticsPeriodType, "CUSTOM">;
