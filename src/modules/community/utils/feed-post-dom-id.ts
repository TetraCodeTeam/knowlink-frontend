/** Id del elemento de una publicación en el feed: es el ancla a la que se vuelve al regresar de su hilo. */
export function feedPostDomId(postId: string): string {
  return `feed-post-${postId}`;
}
