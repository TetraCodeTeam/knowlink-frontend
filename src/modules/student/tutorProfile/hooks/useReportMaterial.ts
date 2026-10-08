import { useMutation } from "@tanstack/react-query";
import { reportMaterial } from "@/modules/student/tutorProfile/api/reportMaterial.api";
import type { ReportMaterialRequest } from "@/modules/student/tutorProfile/interfaces/requests/report-material-request.interface";

export function useReportMaterial(materialId: string) {
  const mutation = useMutation({
    mutationKey: ["reportMaterial", materialId],
    mutationFn: (data: ReportMaterialRequest) => reportMaterial(materialId, data),
  });

  return {
    submitReport: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}
