import type { CommunityAttachment } from "@/modules/community/interfaces/responses/community-attachment.interface";
import type { CommunityAuthor } from "@/modules/community/interfaces/responses/community-author.interface";

export interface BookingCard {
  question: string;
}

export interface CommunityReply {
  replyId: string;
  postId: string;
  author: CommunityAuthor;
  content: string;
  attachment: CommunityAttachment | null;
  helpfulCount: number;
  markedHelpfulByMe: boolean;
  featured: boolean;
  bookingCard: BookingCard | null;
  createdAt: string;
  edited: boolean;
  ownedByMe: boolean;
}
