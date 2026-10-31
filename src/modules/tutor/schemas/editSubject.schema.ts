import { z } from "zod";

const PRICE_FORMAT = /^\d{1,8}(\.\d{1,2})?$/;

export const editSubjectSchema = z
  .object({
    isFree: z.boolean(),
    pricePerHour: z.string(),
    virtualSelected: z.boolean(),
    inPersonSelected: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (!values.isFree) {
      const raw = values.pricePerHour.trim();
      const parsed = Number(raw);

      if (raw === "") {
        ctx.addIssue({
          code: "custom",
          path: ["pricePerHour"],
          message: "Ingresá el precio por hora",
        });
      } else if (!Number.isFinite(parsed)) {
        ctx.addIssue({
          code: "custom",
          path: ["pricePerHour"],
          message: "Ingresá un valor numérico válido",
        });
      } else if (parsed <= 0) {
        ctx.addIssue({
          code: "custom",
          path: ["pricePerHour"],
          message: "El precio debe ser mayor a cero",
        });
      } else if (!PRICE_FORMAT.test(raw)) {
        ctx.addIssue({
          code: "custom",
          path: ["pricePerHour"],
          message: "Usá hasta 8 dígitos enteros y 2 decimales",
        });
      }
    }

    if (!values.virtualSelected && !values.inPersonSelected) {
      // Se cuelga de "virtualSelected" para que errors.virtualSelected quede tipado.
      ctx.addIssue({
        code: "custom",
        path: ["virtualSelected"],
        message: "Seleccioná al menos una modalidad",
      });
    }
  });

export type EditSubjectFormValues = z.infer<typeof editSubjectSchema>;
