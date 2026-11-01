export interface MyPodiumPosition {
  /** false si el usuario no tiene un rol de tutor activo. */
  eligible: boolean;
  /** null si es elegible pero todavía no suma puntaje en el período. */
  position: number | null;
  fullName: string | null;
  careerName: string | null;
  /** Puestos que faltan para el top 10; 0 si ya está dentro. */
  positionsToTopTen: number;
  progressPercent: number;
}
