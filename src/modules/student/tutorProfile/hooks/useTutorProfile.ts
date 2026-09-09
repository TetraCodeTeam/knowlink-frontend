import { useQuery } from "@tanstack/react-query";
import {
  checkTutorMaterialAccess,
  getAccessibleTutorMaterials,
  getTutorProfile,
  mapTutorMaterials,
} from "@/modules/student/tutorProfile/api/getTutorProfile";

export const useTutorProfile = (tutorId: string) => {
  return useQuery({
    queryKey: ["tutorProfile", tutorId],
    queryFn: async () => {
      const [profile, hasConfirmedBooking] = await Promise.all([
        getTutorProfile(tutorId),
        checkTutorMaterialAccess(tutorId),
      ]);
      const materials = hasConfirmedBooking
        ? mapTutorMaterials(await getAccessibleTutorMaterials(tutorId))
        : [];

      return { ...profile, material: materials, hasConfirmedBooking };
    },
    enabled: Boolean(tutorId),
  });
};