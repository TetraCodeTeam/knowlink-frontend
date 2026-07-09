import type { TutorProfile } from "@/modules/tutor/interfaces/tutor.interface";
import { mockTutorProfile } from "@/modules/tutor/api/tutorProfile.mock";

// TODO: reemplazar por la llamada real cuando el endpoint esté disponible.
export const getTutorProfile = async (tutorId: string): Promise<TutorProfile> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { ...mockTutorProfile, id: tutorId };
};