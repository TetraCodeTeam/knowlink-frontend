import { useMemo } from "react";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getCommunityFeed } from "@/modules/community/api/community.api";
import {
  COMMUNITY_STALE_TIME_MS,
  FEED_PAGE_SIZE,
} from "@/modules/community/constants/community.constants";
import { COMMUNITY_QUERY_KEYS } from "@/modules/community/constants/community-query-keys";
import type { FeedFilters } from "@/modules/community/interfaces/feed-filters.interface";

export function useCommunityFeed(filters: FeedFilters) {
  const query = useInfiniteQuery({
    queryKey: COMMUNITY_QUERY_KEYS.feedList(filters),
    queryFn: ({ pageParam }) => getCommunityFeed(pageParam, FEED_PAGE_SIZE, filters),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    staleTime: COMMUNITY_STALE_TIME_MS,
    // Al cambiar de filtros se sigue mostrando el feed anterior hasta que llegue el nuevo, sin saltos.
    placeholderData: keepPreviousData,
  });

  const posts = useMemo(
    () => query.data?.pages.flatMap((page) => page.content) ?? [],
    [query.data]
  );

  return {
    posts,
    isLoading: query.isLoading,
    isError: query.isError,
    isShowingPreviousFilters: query.isPlaceholderData,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
  };
}
