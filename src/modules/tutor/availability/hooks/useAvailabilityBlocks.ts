import { useQuery } from "@tanstack/react-query";
import { getAvailabilityBlocksInRange } from "@/modules/tutor/availability/api/availability.api";

export function useAvailabilityBlocks(from: string, to: string) {
  return useQuery({
    queryKey: ["availability-blocks", from, to],
    queryFn: () => getAvailabilityBlocksInRange(from, to),
  });
}