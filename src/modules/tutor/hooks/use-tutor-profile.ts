import { useQuery } from "@tanstack/react-query";
import { getTutorProfile } from "@/modules/tutor/api/get-tutor-profile";

export const useTutorProfile = (tutorId: string) => {
  return useQuery({
    queryKey: ["tutorProfile", tutorId],
    queryFn: () => getTutorProfile(tutorId),
    enabled: Boolean(tutorId),
  });
};