import { useQuery } from "@tanstack/react-query";
import { getMinNoticeMinutes } from "@/modules/tutor/availability/api/tutor-notice.api";

export function useMinNoticeMinutes() {
  return useQuery({
    queryKey: ["min-notice-minutes"],
    queryFn: getMinNoticeMinutes,
  });
}