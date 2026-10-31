/** Largo máximo del motivo de baja y de la nota interna de desestimación. */
export const MATERIAL_REPORT_TEXT_MAX_LENGTH = 500;

export const MATERIAL_REPORT_GUIDELINES = [
  "Descargá y auditá el archivo: los motivos denunciados no siempre reflejan con precisión el contenido real.",
  "Dar de baja retira el material para todos los alumnos y notifica al tutor (y a quien denunció). Desestimar mantiene la visibilidad y registra tu nota en auditoría interna.",
  "Resolución unificada: si un archivo tiene varias denuncias, tu decisión resuelve todos los tickets simultáneamente.",
];

export const MATERIAL_REPORT_MESSAGES = {
  assignSuccess: "Solicitud asignada. El material quedó en revisión.",
  assignError: "No pudimos tomar la solicitud. Intentá de nuevo.",
  removeSuccess: "Material dado de baja correctamente.",
  removeError: "No pudimos dar de baja el material. Intentá de nuevo.",
  dismissSuccess: "Denuncia desestimada. El material sigue disponible.",
  dismissError: "No pudimos desestimar la denuncia. Intentá de nuevo.",
  listErrorTitle: "No pudimos cargar las denuncias",
  listErrorText: "Revisá tu conexión e intentá de nuevo.",
  detailErrorTitle: "No pudimos cargar la denuncia",
  detailErrorText: "Revisá tu conexión e intentá de nuevo.",
  emptyList:
    "No hay denuncias de material para mostrar. Probá con otro filtro o esperá a que un alumno denuncie un archivo.",
} as const;
