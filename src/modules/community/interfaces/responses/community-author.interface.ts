import type { Role } from "@/shared/types/role.type";

export interface CommunityAuthor {
  /** Cuando el rol es TUTOR, es también el tutorId de los endpoints de perfil y reserva. */
  userId: string;
  fullName: string;
  role: Role;
  profilePictureUrl: string | null;
  careerName: string | null;
  averageRating: number | null;
  verified: boolean;
  canBookClass: boolean;
}
