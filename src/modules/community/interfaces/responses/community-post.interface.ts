import type { CommunityAttachment } from "@/modules/community/interfaces/responses/community-attachment.interface";
import type { CommunityAuthor } from "@/modules/community/interfaces/responses/community-author.interface";
import type { CommunitySubject } from "@/modules/community/interfaces/responses/community-subject.interface";
import type { PostStatus } from "@/modules/community/types/post-status.type";
import type { PostType } from "@/modules/community/types/post-type.type";

export interface FeaturedReply {
  replyId: string;
  author: CommunityAuthor;
  excerpt: string;
  helpfulCount: number;
  createdAt: string;
}

export interface CommunityPost {
  postId: string;
  type: PostType;
  status: PostStatus;
  subject: CommunitySubject;
  title: string;
  content: string;
  attachment: CommunityAttachment | null;
  author: CommunityAuthor;
  createdAt: string;
  resolvedAt: string | null;
  replyCount: number;
  /** Marcas "Esto me sirvió" de la mejor respuesta de la publicación. */
  helpfulCount: number;
  featuredReply: FeaturedReply | null;
  ownedByMe: boolean;
  edited: boolean;
  /** Publicación abierta y, si es propia, con al menos una respuesta de otra persona. */
  canReply: boolean;
}
