import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubject } from "@/modules/catalog/api/catalog.api";
import type { CreateSubjectRequest } from "@/modules/catalog/interfaces/requests/create-subject.interface";

export function useCreateSubject(institutionId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["createSubject", institutionId],
    mutationFn: (data: CreateSubjectRequest) => createSubject(institutionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "subjects"] });
    },
  });

  return {
    createSubject: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}