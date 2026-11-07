import { useQuery } from "@tanstack/react-query";
import { getMyStudentProfile } from "@/modules/student/profile/api/student-profile.api";

export function useMyStudentProfile(enabled: boolean = true) {
  return useQuery({
    queryKey: ["myStudentProfile"],
    queryFn: getMyStudentProfile,
    enabled,
  });
}
