export const COMMUNITY_QUERY_KEYS = {
  all: ["community"] as const,
  feed: ["community", "feed"] as const,
  myPostsBase: ["community", "my-posts"] as const,
  myPosts: (date: string) => ["community", "my-posts", date] as const,
  post: (postId: string) => ["community", "post", postId] as const,
  subjects: ["community", "subjects"] as const,
  podium: ["community", "podium"] as const,
  myPosition: ["community", "podium", "me"] as const,
};
