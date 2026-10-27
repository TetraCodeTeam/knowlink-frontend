import { useQuery } from "@tanstack/react-query";
import { getMyTutorProfile } from "@/modules/tutor/profile/api/getMyTutorProfile";

export const useMyTutorProfile = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["myTutorProfile"],
    queryFn: getMyTutorProfile,
    enabled,
  });
};
