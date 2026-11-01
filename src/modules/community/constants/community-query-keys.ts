import type { FeedFilters } from "@/modules/community/interfaces/feed-filters.interface";

export const COMMUNITY_QUERY_KEYS = {
  all: ["community"] as const,
  /** Prefijo común de las listas y los conteos del feed: invalidarlo refresca ambos. */
  feed: ["community", "feed"] as const,
  feedList: (filters: FeedFilters) => ["community", "feed", "list", filters] as const,
  feedCounts: (filters: FeedFilters) => ["community", "feed", "counts", filters] as const,
  myPostsBase: ["community", "my-posts"] as const,
  myPosts: (date: string) => ["community", "my-posts", date] as const,
  post: (postId: string) => ["community", "post", postId] as const,
  subjects: ["community", "subjects"] as const,
  subjectsByCareer: (careerId: string | null) => ["community", "subjects", careerId] as const,
  podium: ["community", "podium"] as const,
  myPosition: ["community", "podium", "me"] as const,
};
