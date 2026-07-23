import { useQuery } from "@tanstack/react-query";
import { getMyTutorProfile } from "@/modules/tutor/api/getMyTutorProfile";

export const useMyTutorProfile = () => {
  return useQuery({
    queryKey: ["myTutorProfile"],
    queryFn: getMyTutorProfile,
  });
};
