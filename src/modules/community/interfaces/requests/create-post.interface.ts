import type { PostType } from "@/modules/community/types/post-type.type";

export interface CreatePostRequest {
  type: PostType;
  subjectId: string;
  title: string;
  content: string;
}
