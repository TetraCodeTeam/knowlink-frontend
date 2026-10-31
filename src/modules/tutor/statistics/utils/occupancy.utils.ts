import {
  BAND_PHRASE,
  BAND_PLURAL,
  BANDS_IN_ORDER,
  DAY_PLURAL,
  DAYS_IN_ORDER,
} from "@/modules/tutor/statistics/constants/statistics.constants";
import type { OccupancyCell } from "@/modules/tutor/statistics/interfaces/responses/tutor-statistics.response";
import type { AvailabilityBand } from "@/modules/tutor/statistics/types/availability-band.type";
import type { DayOfWeek } from "@/modules/tutor/statistics/types/day-of-week.type";

/** Índice de la escala de color: 0–19, 20–39, 40–59, 60 o más. */
export function getOccupancyLevel(percentage: number): 0 | 1 | 2 | 3 {
  if (percentage >= 60) return 3;
  if (percentage >= 40) return 2;
  if (percentage >= 20) return 1;
  return 0;
}

export function findCell(
  cells: OccupancyCell[],
  day: DayOfWeek,
  band: AvailabilityBand
): OccupancyCell | undefined {
  return cells.find((cell) => cell.dayOfWeek === day && cell.band === band);
}

/** Lunes a sábado siempre; el domingo solo si el tutor ofreció horas ese día. */
export function getVisibleDays(cells: OccupancyCell[]): DayOfWeek[] {
  const offersSunday = cells.some((cell) => cell.dayOfWeek === "SUNDAY" && cell.offeredHours > 0);
  return offersSunday ? DAYS_IN_ORDER : DAYS_IN_ORDER.filter((day) => day !== "SUNDAY");
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}`;
}

/** Franjas con mayor ocupación: las que quedan a menos del 20% de la máxima y alcanzan al menos 40%. */
function describeBusiestSlots(cells: OccupancyCell[]): string | null {
  const occupied = cells.filter((cell) => cell.percentage !== null && cell.percentage > 0);
  const top = Math.max(0, ...occupied.map((cell) => cell.percentage ?? 0));
  if (top < 40) return null;

  const busiest = occupied.filter((cell) => (cell.percentage ?? 0) >= top * 0.8);
  const bands = BANDS_IN_ORDER.map((band) => ({
    band,
    days: busiest.filter((cell) => cell.band === band).map((cell) => cell.dayOfWeek),
  })).filter((group) => group.days.length > 0);
  const main = bands.reduce((best, group) => (group.days.length > best.days.length ? group : best));

  const days = DAYS_IN_ORDER.filter((day) => main.days.includes(day)).map((day) => DAY_PLURAL[day]);
  return `Las ${BAND_PLURAL[main.band]} de ${joinNames(days)} se ocupan más que el resto.`;
}

/** Franja con horas ofrecidas que todavía no recibió ninguna reserva. */
function describeEmptySlot(cells: OccupancyCell[]): string | null {
  const hasBookings = cells.some((cell) => cell.bookedHours > 0);
  if (!hasBookings) return null;
  const empty = DAYS_IN_ORDER.flatMap((day) =>
    BANDS_IN_ORDER.map((band) => findCell(cells, day, band))
  ).find((cell) => cell !== undefined && cell.offeredHours > 0 && cell.percentage === 0);
  if (!empty) return null;
  return `Los ${DAY_PLURAL[empty.dayOfWeek]} ${BAND_PHRASE[empty.band]} todavía no recibieron reservas.`;
}

/** Texto de la franja inferior del panel de ocupación; null si no hay nada útil para decir. */
export function buildOccupancyInsight(cells: OccupancyCell[]): string | null {
  const parts = [describeBusiestSlots(cells), describeEmptySlot(cells)].filter(
    (part): part is string => part !== null
  );
  return parts.length > 0 ? parts.join(" ") : null;
}
