import { studentPaths } from "@/routes/paths";
import type { Role } from "@/shared/types/role.type";

export interface CommunityPaths {
  home: string;
  myPosts: string;
  podium: string;
  profile: string;
  post: (postId: string) => string;
  /** Perfil público de un tutor. Solo existe para alumnos, que son quienes pueden reservar. */
  tutorProfile: ((tutorId: string) => string) | null;
  /** Reserva de una clase con un tutor. Solo existe para alumnos. */
  booking: ((tutorId: string) => string) | null;
}

export function getCommunityPaths(role: Role): CommunityPaths {
  const base = role === "TUTOR" ? "/tutor" : "/student";
  const isStudent = role === "STUDENT";
  return {
    home: `${base}/home`,
    myPosts: `${base}/community/mine`,
    podium: `${base}/community/podium`,
    profile: `${base}/profile`,
    post: (postId) => `${base}/community/posts/${postId}`,
    tutorProfile: isStudent ? (tutorId) => `/student/tutor/${tutorId}` : null,
    booking: isStudent ? studentPaths.bookingWithTutor : null,
  };
}
