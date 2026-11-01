import { useQuery } from "@tanstack/react-query";
import { getPostDetail } from "@/modules/community/api/community.api";
import { COMMUNITY_STALE_TIME_MS } from "@/modules/community/constants/community.constants";
import { COMMUNITY_QUERY_KEYS } from "@/modules/community/constants/community-query-keys";

export function useCommunityPost(postId: string) {
  const query = useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.post(postId),
    queryFn: () => getPostDetail(postId),
    enabled: postId !== "",
    staleTime: COMMUNITY_STALE_TIME_MS,
    retry: false,
  });

  return {
    detail: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
