export const SUPPORT_TABS = [
  { value: "claims", label: "Reclamos de sesiones" },
  { value: "materials", label: "Material denunciado" },
] as const;

export type SupportTab = (typeof SUPPORT_TABS)[number]["value"];

export const EMPTY_STATE_ILLUSTRATION_SRC = "/illustrations/documents-bro.svg";
export const EMPTY_STATE_TITLE = "Sin registros por ahora";
export const EMPTY_STATE_DESCRIPTION = "Por el momento no tenés nada pendiente en esta sección.";

export const MAX_CLAIM_COMMENT_LENGTH = 2000;
