import { useQuery } from "@tanstack/react-query";
import { getMyTutorProfile } from "../api/Tutorsubject.api";

export function useMyTutorProfile() {
  return useQuery({
    queryKey: ["tutorProfile", "me"],
    queryFn: getMyTutorProfile,
    staleTime: 1000 * 60 * 5,
  });
}