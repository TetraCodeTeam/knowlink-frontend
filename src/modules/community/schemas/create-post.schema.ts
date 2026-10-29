import { z } from "zod";
import {
  HELP_REQUEST_MAX_LENGTH,
  SHARED_CONTENT_MAX_LENGTH,
  TITLE_MAX_LENGTH,
} from "@/modules/community/constants/community.constants";
import { POST_TYPE_VALUES } from "@/modules/community/types/post-type.type";

export const createPostSchema = z
  .object({
    type: z.enum(POST_TYPE_VALUES),
    subjectId: z.string().min(1, "Seleccioná una materia"),
    title: z
      .string()
      .trim()
      .min(1, "Ingresá un título")
      .max(TITLE_MAX_LENGTH, `El título no puede superar los ${TITLE_MAX_LENGTH} caracteres`),
    content: z.string().trim().min(1, "Ingresá el detalle de la consulta"),
    file: z.instanceof(File).nullable(),
  })
  .superRefine((data, ctx) => {
    const max = data.type === "HELP_REQUEST" ? HELP_REQUEST_MAX_LENGTH : SHARED_CONTENT_MAX_LENGTH;
    if (data.content.length > max) {
      ctx.addIssue({
        code: "custom",
        path: ["content"],
        message: `El detalle no puede superar los ${max} caracteres`,
      });
    }
  });

export type CreatePostFormData = z.infer<typeof createPostSchema>;
