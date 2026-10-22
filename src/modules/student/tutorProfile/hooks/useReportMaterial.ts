import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportMaterial } from "@/modules/student/tutorProfile/api/reportMaterial.api";
import type { ReportMaterialRequest } from "@/modules/student/tutorProfile/interfaces/requests/report-material-request.interface";

export function useReportMaterial(materialId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["reportMaterial", materialId],
    mutationFn: (data: ReportMaterialRequest) => reportMaterial(materialId, data),
    onSettled: () => {
      // Runs on both success and 409 conflict so the tutor profile query
      // (and its "Reportado" label) stays in sync with the backend either way.
      void queryClient.invalidateQueries({ queryKey: ["tutorProfile"] });
    },
  });

  return {
    submitReport: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}
