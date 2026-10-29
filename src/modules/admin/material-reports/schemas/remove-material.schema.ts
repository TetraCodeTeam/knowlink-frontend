import { z } from "zod";
import { MATERIAL_REPORT_TEXT_MAX_LENGTH } from "@/modules/admin/material-reports/constants/material-reports.constants";

export const removeMaterialSchema = z.object({
  reason: z
    .string()
    .trim()
    .max(
      MATERIAL_REPORT_TEXT_MAX_LENGTH,
      `El motivo no puede superar los ${MATERIAL_REPORT_TEXT_MAX_LENGTH} caracteres`
    ),
});

export type RemoveMaterialFormValues = z.infer<typeof removeMaterialSchema>;
