import type { PodiumBadge } from "@/modules/community/types/podium-badge.type";

export interface RankedTutor {
  /** Id del usuario con rol TUTOR: el mismo tutorId de los endpoints de perfil y reserva. */
  tutorId: string;
  position: number;
  fullName: string;
  careerName: string | null;
  profilePictureUrl: string | null;
  averageRating: number | null;
  reviewsCount: number;
  completedClasses: number;
  /** Puntaje con el que se ordenó el ranking. */
  score: number;
  /** Respuestas suyas elegidas como destacadas el mes anterior. */
  bestAnswers: number;
  /** Marcas "Esto me sirvió" que recibieron sus respuestas el mes anterior. */
  helpfulMarks: number;
  verified: boolean;
  /** Solo los tres primeros puestos tienen insignia. */
  badge: PodiumBadge | null;
  subjects: string[];
}
