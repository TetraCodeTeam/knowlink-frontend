import { useQuery } from "@tanstack/react-query";
import { getTutorPodium } from "@/modules/community/api/community.api";
import { COMMUNITY_QUERY_KEYS } from "@/modules/community/constants/community-query-keys";

// El ranking solo cambia el primer día de cada mes.
const PODIUM_STALE_TIME_MS = 1000 * 60 * 30;

export function useTutorPodium() {
  const query = useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.podium,
    queryFn: getTutorPodium,
    staleTime: PODIUM_STALE_TIME_MS,
  });

  return {
    podium: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
