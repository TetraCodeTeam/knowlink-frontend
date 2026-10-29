import { useQuery } from "@tanstack/react-query";
import { getMyPodiumPosition } from "@/modules/community/api/community.api";
import { COMMUNITY_QUERY_KEYS } from "@/modules/community/constants/community-query-keys";

export function useMyPodiumPosition(enabled: boolean) {
  const query = useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.myPosition,
    queryFn: getMyPodiumPosition,
    enabled,
  });

  return { position: query.data, isLoading: query.isLoading, isError: query.isError };
}
