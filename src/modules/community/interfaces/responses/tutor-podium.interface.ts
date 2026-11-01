import type { RankedTutor } from "@/modules/community/interfaces/responses/ranked-tutor.interface";

export interface TutorPodium {
  /** Primer día del mes (yyyy-MM-dd) al que pertenece el ranking. */
  periodStart: string;
  /** Puestos 1 a 3. */
  podium: RankedTutor[];
  /** Puestos 4 a 10. */
  ranking: RankedTutor[];
}
