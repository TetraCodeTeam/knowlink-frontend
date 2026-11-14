/**
 * Cuánto suma cada cosa al puntaje del ranking. Reflejan los pesos del backend (`CommunityConstants`):
 * puntaje = respuestas destacadas × 10 + marcas "Esto me sirvió" × 2 + calificación promedio × 5.
 */
export const RANKING_SCORE_WEIGHTS = {
  bestAnswer: 10,
  helpfulMark: 2,
  averageRating: 5,
} as const;
