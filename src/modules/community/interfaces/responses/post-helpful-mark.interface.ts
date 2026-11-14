/** Resultado de marcar o quitar "Esto me sirvió" en un aporte. */
export interface PostHelpfulMark {
  postId: string;
  helpfulCount: number;
  markedByMe: boolean;
}
