import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCommunityFeed } from "@/modules/community/api/community.api";
import {
  COMMUNITY_STALE_TIME_MS,
  FEED_PAGE_SIZE,
} from "@/modules/community/constants/community.constants";
import { COMMUNITY_QUERY_KEYS } from "@/modules/community/constants/community-query-keys";

export function useCommunityFeed() {
  const query = useInfiniteQuery({
    queryKey: COMMUNITY_QUERY_KEYS.feed,
    queryFn: ({ pageParam }) => getCommunityFeed(pageParam, FEED_PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    staleTime: COMMUNITY_STALE_TIME_MS,
  });

  const posts = useMemo(
    () => query.data?.pages.flatMap((page) => page.content) ?? [],
    [query.data]
  );

  return {
    posts,
    isLoading: query.isLoading,
    isError: query.isError,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
  };
}
