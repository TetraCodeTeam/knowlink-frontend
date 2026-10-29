import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createReply } from "@/modules/community/api/community.api";
import { COMMUNITY_QUERY_KEYS } from "@/modules/community/constants/community-query-keys";
import type { CreateReplyFormData } from "@/modules/community/schemas/create-reply.schema";

interface CreateReplyVariables {
  data: CreateReplyFormData;
  /** Solo los tutores pueden incluir la tarjeta de vinculación a tutoría. */
  isTutor: boolean;
}

export function useCreateReply(postId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ data, isTutor }: CreateReplyVariables) =>
      createReply(
        postId,
        {
          content: data.content.trim(),
          ...(isTutor
            ? {
                includeBookingCard: data.includeBookingCard,
                bookingCardQuestion: data.bookingCardQuestion.trim() || undefined,
              }
            : {}),
        },
        data.file
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.post(postId) });
      void queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.feed });
      void queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.myPostsBase });
      toast.success("Tu respuesta fue publicada.");
    },
    onError: () => {
      // Si el hilo se resolvió mientras se escribía, se refresca para mostrarlo cerrado.
      void queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.post(postId) });
    },
  });

  return { createReply: mutation.mutateAsync, isPending: mutation.isPending };
}
