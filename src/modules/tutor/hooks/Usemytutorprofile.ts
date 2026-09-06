import { useQuery } from "@tanstack/react-query";
import { getMyTutorProfile } from "../api/tutorSubject.api";

export function useMyTutorProfile() {
  return useQuery({
    queryKey: ["myTutorProfile"],
    queryFn: getMyTutorProfile,
    staleTime: 1000 * 60 * 5,
  });
}