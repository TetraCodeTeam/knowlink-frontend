import type { CommunityPost } from "@/modules/community/interfaces/responses/community-post.interface";

/**
 * Solo el autor de una publicación queda bloqueado para responder, y únicamente mientras nadie más
 * la haya respondido. Cualquier otro usuario puede responder una publicación abierta.
 */
export function isReplyBlocked(post: CommunityPost): boolean {
  return post.ownedByMe && post.canReply === false;
}
