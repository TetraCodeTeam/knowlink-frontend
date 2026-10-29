import type { PostType } from "@/modules/community/types/post-type.type";
import type { Role } from "@/shared/types/role.type";

interface PostTypeStyle {
  bg: string;
  color: string;
}

export const POST_TYPE_STYLE: Record<PostType, PostTypeStyle> = {
  HELP_REQUEST: { bg: "#FDE4D6", color: "#A8480E" },
  SHARED_CONTENT: { bg: "#E4E1FA", color: "#3F2FB5" },
};

export const POST_TYPE_COMPOSER_LABEL: Record<PostType, string> = {
  HELP_REQUEST: "Duda puntual / Ayuda",
  SHARED_CONTENT: "Aporte a la comunidad",
};

export const POST_TYPE_COMPOSER_LABEL_TUTOR: Record<PostType, string> = {
  HELP_REQUEST: "Duda puntual / Ayuda",
  SHARED_CONTENT: "Aporte de tutor",
};

/** Etiqueta del tipo de publicación según quién la escribió (feed y detalle). */
export function getPostTypeLabel(type: PostType, authorRole: Role): string {
  if (type === "HELP_REQUEST") return "Pedido de ayuda";
  return authorRole === "TUTOR" ? "Aporte de Tutor" : "Aporte";
}

/** Etiqueta corta usada en "Mis publicaciones". */
export const POST_TYPE_SHORT_LABEL: Record<PostType, string> = {
  HELP_REQUEST: "Duda",
  SHARED_CONTENT: "Aporte",
};
