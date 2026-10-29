import type { CommunityPost } from "@/modules/community/interfaces/responses/community-post.interface";

export interface PagedPosts {
  content: CommunityPost[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}
