import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSubjectCareers } from "@/modules/catalog/api/catalog.api";
import type { UpdateSubjectCareersRequest } from "@/modules/catalog/interfaces/requests/update-subject-careers.interface";

export function useUpdateSubjectCareers() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["updateSubjectCareers"],
    mutationFn: ({ subjectId, data }: { subjectId: string; data: UpdateSubjectCareersRequest }) =>
      updateSubjectCareers(subjectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog", "subjects"] });
    },
  });

  return {
    updateSubjectCareers: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}