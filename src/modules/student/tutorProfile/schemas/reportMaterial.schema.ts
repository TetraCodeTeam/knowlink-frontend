import { z } from "zod";
import {
  MAX_OTHER_REASON_LENGTH,
  MAX_REPORT_COMMENT_LENGTH,
} from "@/modules/student/tutorProfile/constants/reportMaterial.constants";

const REASON_VALUES = ["INAPPROPRIATE_CONTENT", "FALSE_INFORMATION", "PLAGIARISM", "OTHER"] as const;

export const reportMaterialSchema = z
  .object({
    reason: z.enum(REASON_VALUES).or(z.literal("")),
    otherReasonText: z
      .string()
      .trim()
      .max(MAX_OTHER_REASON_LENGTH, `El motivo no puede superar los ${MAX_OTHER_REASON_LENGTH} caracteres`)
      .optional(),
    comment: z
      .string()
      .trim()
      .max(MAX_REPORT_COMMENT_LENGTH, `El comentario no puede superar los ${MAX_REPORT_COMMENT_LENGTH} caracteres`)
      .optional(),
  })
  .refine((data) => data.reason !== "", {
    message: "Seleccioná un motivo",
    path: ["reason"],
  })
  .refine((data) => data.reason !== "OTHER" || !!data.otherReasonText?.trim(), {
    message: "Especificá el motivo de tu denuncia",
    path: ["otherReasonText"],
  });

export type ReportMaterialFormValues = z.infer<typeof reportMaterialSchema>;
