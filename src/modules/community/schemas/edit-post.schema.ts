import { z } from "zod";
import {
  HELP_REQUEST_MAX_LENGTH,
  SHARED_CONTENT_MAX_LENGTH,
  TITLE_MAX_LENGTH,
} from "@/modules/community/constants/community.constants";
import type { PostType } from "@/modules/community/types/post-type.type";

/** El límite de la descripción depende del tipo de publicación, que no cambia al editar. */
export function buildEditPostSchema(type: PostType) {
  const maxContent = type === "HELP_REQUEST" ? HELP_REQUEST_MAX_LENGTH : SHARED_CONTENT_MAX_LENGTH;
  return z.object({
    title: z
      .string()
      .trim()
      .min(1, "Ingresá un título")
      .max(TITLE_MAX_LENGTH, `El título no puede superar los ${TITLE_MAX_LENGTH} caracteres`),
    content: z
      .string()
      .trim()
      .min(1, "Ingresá el detalle de la publicación")
      .max(maxContent, `El detalle no puede superar los ${maxContent} caracteres`),
  });
}

export type EditPostFormData = z.infer<ReturnType<typeof buildEditPostSchema>>;
