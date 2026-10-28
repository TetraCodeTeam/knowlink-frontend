import { useQuery } from "@tanstack/react-query";
import { getMyStudentProfile } from "@/modules/student/profile/api/student-profile.api";

export function useMyStudentProfile() {
  return useQuery({
    queryKey: ["myStudentProfile"],
    queryFn: getMyStudentProfile,
  });
}