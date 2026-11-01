import { z } from "zod";
import { MATERIAL_REPORT_TEXT_MAX_LENGTH } from "@/modules/admin/material-reports/constants/material-reports.constants";

export const dismissReportSchema = z.object({
  note: z
    .string()
    .trim()
    .max(
      MATERIAL_REPORT_TEXT_MAX_LENGTH,
      `La nota no puede superar los ${MATERIAL_REPORT_TEXT_MAX_LENGTH} caracteres`
    ),
});

export type DismissReportFormValues = z.infer<typeof dismissReportSchema>;
