export type ResolutionDeltaTone = "positive" | "negative" | "neutral";

export interface ResolutionDeltaCopy {
  text: string;
  tone: ResolutionDeltaTone;
}

/**
 * Copy del delta de TTR. Positivo = más rápido que el período anterior.
 * `null` = sin base de comparación, por lo que no se muestra delta.
 */
export function buildResolutionDeltaCopy(deltaPct: number | null): ResolutionDeltaCopy | null {
  if (deltaPct === null) {
    return null;
  }

  if (deltaPct === 0) {
    return { text: "Sin cambios", tone: "neutral" };
  }

  if (deltaPct > 0) {
    return { text: `+${deltaPct}% más rápido`, tone: "positive" };
  }

  return { text: `${Math.abs(deltaPct)}% más lento`, tone: "negative" };
}
