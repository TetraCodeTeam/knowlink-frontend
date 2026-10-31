/** Largo máximo de la justificación de resolución (a confirmar con backend). */
export const SESSION_CLAIM_JUSTIFICATION_MAX_LENGTH = 500;

export const SESSION_CLAIM_LIST_NOUN = "reclamos";

export const SESSION_CLAIM_GUIDELINES = [
  "Leé el mensaje de ambas partes antes de decidir. Si falta contexto, podés citarlas para conversar.",
  "Los fondos de la sesión permanecen retenidos hasta que confirmes una resolución.",
  "La justificación que escribas es obligatoria y la van a ver ambas partes, así que evitá juicios de valor.",
];

export const SESSION_CLAIM_MESSAGES = {
  assignSuccess: "Solicitud asignada. El reclamo quedó en revisión.",
  assignError: "No pudimos tomar la solicitud. Intentá de nuevo.",
  resolveSuccess: "Resolución confirmada. Se notificó a ambas partes.",
  resolveError: "No pudimos resolver el reclamo. Intentá de nuevo.",
  listErrorTitle: "No pudimos cargar los reclamos",
  listErrorText: "Revisá tu conexión e intentá de nuevo.",
  detailErrorTitle: "No pudimos cargar el reclamo",
  detailErrorText: "Revisá tu conexión e intentá de nuevo.",
  contactErrorTitle: "No pudimos cargar los datos de contacto",
  contactErrorText: "Cerrá el diálogo e intentá de nuevo.",
  emptyList:
    "No hay reclamos para mostrar. Probá con otro estado o esperá a que se inicie un nuevo reclamo.",
  noMessage: "No se registró un mensaje",
} as const;

export const SESSION_CLAIM_ROLE_LABELS = {
  TUTOR: "Tutor",
  STUDENT: "Alumno",
} as const;

export const SESSION_CLAIM_FAVORED_LABELS = {
  STUDENT: "Alumno",
  TUTOR: "Tutor",
} as const;
