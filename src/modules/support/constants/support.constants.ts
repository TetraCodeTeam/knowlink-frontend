export const SUPPORT_TABS = [
  { value: "claims", label: "Reclamos de sesiones" },
  { value: "materials", label: "Material denunciado" },
] as const;

export type SupportTab = (typeof SUPPORT_TABS)[number]["value"];

// La ilustración (Storyset "Documents - Bro", color #407BFF) va en public/illustrations/.
export const EMPTY_STATE_ILLUSTRATION_SRC = "/illustrations/documents-bro.svg";
export const EMPTY_STATE_TITLE = "Sin registros por ahora";
export const EMPTY_STATE_DESCRIPTION = "Por el momento no tenés nada pendiente en esta sección.";
