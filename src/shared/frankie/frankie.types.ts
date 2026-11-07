/**
 * Estados de ánimo de Frankie. Cada uno cambia ojo, ceja, boca y movimiento, pero la ilustración
 * de base es siempre la misma para que se reconozca como la mascota de KnowLink.
 */
export type FrankieMood =
  | "happy" // saludo / estado neutro amable
  | "celebrate" // logros y confirmaciones
  | "sad" // errores: comprensión, sin dramatismo
  | "worried" // advertencias y confirmaciones delicadas
  | "surprised" // novedades
  | "thinking" // sin resultados, dudas, "¿estás seguro?"
  | "sleepy" // todo tranquilo / todavía no hay nada
  | "love"; // motivación y agradecimiento

/** Detalles que acompañan a Frankie para contar la situación (todos opcionales). */
export type FrankieAccessory =
  | "confetti"
  | "sparkles"
  | "hearts"
  | "question"
  | "exclamation"
  | "sweat"
  | "tear"
  | "zzz"
  | "magnifier"
  | "hardhat";

export const FRANKIE_MOODS: readonly FrankieMood[] = [
  "happy",
  "celebrate",
  "sad",
  "worried",
  "surprised",
  "thinking",
  "sleepy",
  "love",
];

/** Accesorios que cada ánimo lleva por defecto. */
export const DEFAULT_ACCESSORIES: Record<FrankieMood, FrankieAccessory[]> = {
  happy: [],
  celebrate: ["confetti", "sparkles"],
  sad: ["tear"],
  worried: ["sweat"],
  surprised: ["exclamation"],
  thinking: ["question"],
  sleepy: ["zzz"],
  love: ["hearts"],
};
