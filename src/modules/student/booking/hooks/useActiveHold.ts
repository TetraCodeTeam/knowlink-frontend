import { useQuery } from "@tanstack/react-query";
import { getActiveHold } from "@/modules/student/booking/api/booking.api";

export function useActiveHold() {
  return useQuery({
    queryKey: ["active-hold"],
    queryFn: getActiveHold,
    staleTime: 0, 
  });
}