import { useQuery } from "@tanstack/react-query";
import { getWeekCustomization } from "@/modules/tutor/availability/api/availability-blocks.api";

export function useWeekCustomization(weekStart: string) {
  return useQuery({
    queryKey: ["week-customization", weekStart],
    queryFn: () => getWeekCustomization(weekStart),
  });
}