import type { AvailabilityBand } from "@/modules/tutor/statistics/types/availability-band.type";
import type { DayOfWeek } from "@/modules/tutor/statistics/types/day-of-week.type";
import type { QuickStatisticsPeriodType } from "@/modules/tutor/statistics/types/statistics-period.type";

/** Antigüedad máxima consultable. Debe coincidir con TutorStatisticsConstants.MAX_LOOKBACK_YEARS del backend. */
export const MAX_LOOKBACK_YEARS = 3;

export const QUICK_PERIOD_OPTIONS: { value: QuickStatisticsPeriodType; label: string }[] = [
  { value: "LAST_MONTH", label: "Último mes" },
  { value: "LAST_3_MONTHS", label: "Últimos 3 meses" },
  { value: "THIS_YEAR", label: "Este año" },
];

export const DEFAULT_PERIOD: QuickStatisticsPeriodType = "LAST_3_MONTHS";

export const DAYS_IN_ORDER: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export const DAY_SHORT_LABEL: Record<DayOfWeek, string> = {
  MONDAY: "Lun",
  TUESDAY: "Mar",
  WEDNESDAY: "Mié",
  THURSDAY: "Jue",
  FRIDAY: "Vie",
  SATURDAY: "Sáb",
  SUNDAY: "Dom",
};

/** Plural para armar frases ("los sábados por la mañana"). */
export const DAY_PLURAL: Record<DayOfWeek, string> = {
  MONDAY: "lunes",
  TUESDAY: "martes",
  WEDNESDAY: "miércoles",
  THURSDAY: "jueves",
  FRIDAY: "viernes",
  SATURDAY: "sábados",
  SUNDAY: "domingos",
};

export const BANDS_IN_ORDER: AvailabilityBand[] = ["MORNING", "AFTERNOON", "NIGHT"];

export const BAND_LABEL: Record<AvailabilityBand, { name: string; range: string }> = {
  MORNING: { name: "Mañana", range: "08 a 12 h" },
  AFTERNOON: { name: "Tarde", range: "12 a 18 h" },
  NIGHT: { name: "Noche", range: "18 a 24 h" },
};

export const BAND_PLURAL: Record<AvailabilityBand, string> = {
  MORNING: "mañanas",
  AFTERNOON: "tardes",
  NIGHT: "noches",
};

export const BAND_PHRASE: Record<AvailabilityBand, string> = {
  MORNING: "por la mañana",
  AFTERNOON: "por la tarde",
  NIGHT: "por la noche",
};

export const TUTOR_STATISTICS_PATHS = {
  availability: "/tutor/availability",
  classHistory: "/tutor/classes",
  support: "/tutor/requests",
} as const;
