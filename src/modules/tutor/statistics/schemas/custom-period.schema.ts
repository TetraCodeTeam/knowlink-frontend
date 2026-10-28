import { z } from "zod";
import { MAX_LOOKBACK_YEARS } from "@/modules/tutor/statistics/constants/statistics.constants";
import { getEarliestCustomDate, toIsoDate } from "@/modules/tutor/statistics/utils/period.utils";

/**
 * Las fechas son strings yyyy-MM-dd, que se comparan correctamente en orden lexicográfico.
 * Las mismas reglas las valida el backend (StatisticsPeriod.resolve).
 */
export function createCustomPeriodSchema(today: Date) {
  const earliest = getEarliestCustomDate(today);
  const latest = toIsoDate(today);

  return z
    .object({
      from: z.string().min(1, "Elegí la fecha de inicio"),
      to: z.string().min(1, "Elegí la fecha de fin"),
    })
    .superRefine((value, ctx) => {
      if (value.from && value.from < earliest) {
        ctx.addIssue({
          code: "custom",
          path: ["from"],
          message: `Solo podés consultar los últimos ${MAX_LOOKBACK_YEARS} años`,
        });
      }
      if (value.to && value.to > latest) {
        ctx.addIssue({
          code: "custom",
          path: ["to"],
          message: "La fecha de fin no puede ser futura",
        });
      }
      if (value.from && value.to && value.from > value.to) {
        ctx.addIssue({
          code: "custom",
          path: ["to"],
          message: "La fecha de fin debe ser posterior a la de inicio",
        });
      }
    });
}

export type CustomPeriodFormData = z.infer<ReturnType<typeof createCustomPeriodSchema>>;
