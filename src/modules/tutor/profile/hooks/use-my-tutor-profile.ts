import { useQuery } from "@tanstack/react-query";
import { getMyTutorProfile } from "@/modules/tutor/profile/api/get-my-tutor-profile";

export const useMyTutorProfile = () => {
  return useQuery({
    queryKey: ["myTutorProfile"],
    queryFn: getMyTutorProfile,
  });
};
