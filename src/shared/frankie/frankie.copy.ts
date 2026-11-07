import type { FrankieMood } from "@/shared/frankie/frankie.types";

/**
 * Voz de Frankie: cercana, en voseo (como el resto de la app) y sin dramatismo.
 *  - Errores: se hace cargo y tranquiliza ("no es tu culpa"), nunca culpa al usuario.
 *  - Advertencias: avisa con ternura, sin asustar.
 *  - Logros: celebra la acción concreta que se completó.
 */

export type FeedbackKind = "success" | "error" | "warning" | "info";

/** Ánimo de Frankie para cada tipo de mensaje. */
export const MOOD_BY_KIND: Record<FeedbackKind, FrankieMood> = {
  success: "celebrate",
  error: "sad",
  warning: "worried",
  info: "happy",
};

/** Encabezados breves de los avisos (toasts). Se elige uno al azar, sin repetir el último. */
export const HEADLINES: Record<FeedbackKind, readonly string[]> = {
  success: ["¡Listo!", "¡Hecho!", "¡Genial!", "¡Buenísimo!"],
  error: ["Uy, algo no salió bien", "Tuvimos un tropiezo", "Esto no salió como esperábamos"],
  warning: ["Ojo con esto", "Un momento", "Antes de seguir"],
  info: ["Te cuento", "Dato de Frankie", "Para que sepas"],
};

const lastPick = new Map<FeedbackKind, string>();

export function pickHeadline(kind: FeedbackKind): string {
  const options = HEADLINES[kind];
  const candidates = options.length > 1 ? options.filter((o) => o !== lastPick.get(kind)) : options;
  const choice = candidates[Math.floor(Math.random() * candidates.length)] ?? options[0];
  lastPick.set(kind, choice);
  return choice;
}

/** Mensajes de la pantalla de error inesperado y de página inexistente. */
export const ERROR_PAGE_COPY = {
  crash: {
    title: "Uy, algo se nos complicó",
    message:
      "Esto no es culpa tuya: tuvimos un problema inesperado. Probá de nuevo y, si sigue pasando, volvé en un rato.",
    retry: "Reintentar",
    reload: "Recargar la página",
  },
  notFound: {
    title: "Nos perdimos en el mar",
    message:
      "No encontramos la página que buscabas. Puede que el enlace haya cambiado o que ya no exista.",
    home: "Volver al inicio",
  },
} as const;

/** Frases de ánimo para la comunidad. Una por día, para que Frankie no repita siempre la misma. */
export const MOTIVATION_MESSAGES: readonly string[] = [
  "Cada pregunta que hacés le sirve también a alguien más que no se animó a hacerla.",
  "Nadie aprende solo: hoy puede ser el día en que le muestres el camino a alguien.",
  "Equivocarse es parte de aprender. Lo importante es que seguís acá.",
  "Una respuesta tuya puede ahorrarle horas de dudas a otra persona.",
  "Tomate un respiro si hace falta: aprender también es descansar bien.",
  "Compartir lo que sabés es la mejor manera de afianzarlo.",
  "No hay preguntas tontas, hay comunidad dispuesta a ayudar. Y vos sos parte.",
  "Hoy no hace falta hacerlo perfecto. Alcanza con dar el próximo paso.",
];

export function motivationOfTheDay(date: Date = new Date()): string {
  // Día local (no UTC): la frase cambia a la medianoche de quien la lee.
  const dayNumber = Math.floor((date.getTime() - date.getTimezoneOffset() * 60_000) / 86_400_000);
  return MOTIVATION_MESSAGES[dayNumber % MOTIVATION_MESSAGES.length];
}
