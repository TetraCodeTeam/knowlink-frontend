import { useQuery } from "@tanstack/react-query";
import { getTutorProfile } from "@/modules/tutor/api/getTutorProfile";

export const useTutorProfile = (tutorId: string) => {
  return useQuery({
    queryKey: ["tutorProfile", tutorId],
    queryFn: () => getTutorProfile(tutorId),
    enabled: Boolean(tutorId),
  });
};