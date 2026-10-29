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
  verified: boolean;
  /** Solo los tres primeros puestos tienen insignia. */
  badge: PodiumBadge | null;
  subjects: string[];
}
