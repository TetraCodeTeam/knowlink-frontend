import type { CommunityPost } from "@/modules/community/interfaces/responses/community-post.interface";
import type { CommunityReply } from "@/modules/community/interfaces/responses/community-reply.interface";

export interface CommunityPostDetail {
  post: CommunityPost;
  replies: CommunityReply[];
}
