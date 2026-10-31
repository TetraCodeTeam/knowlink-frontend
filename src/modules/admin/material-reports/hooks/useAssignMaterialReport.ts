import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { assignMaterialReport } from "@/modules/admin/material-reports/api/admin-material-reports.api";
import { MATERIAL_REPORT_MESSAGES } from "@/modules/admin/material-reports/constants/material-reports.constants";
import { invalidateMaterialReportQueries } from "@/modules/admin/material-reports/utils/invalidate-material-report-queries";
import { getErrorMessage } from "@/shared/utils/errors";

export function useAssignMaterialReport(materialId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => assignMaterialReport(materialId),
    onSuccess: async () => {
      toast.success(MATERIAL_REPORT_MESSAGES.assignSuccess);
      await invalidateMaterialReportQueries(queryClient, materialId);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, MATERIAL_REPORT_MESSAGES.assignError));
      // Otro admin pudo tomarla antes: refrescamos el estado real del archivo.
      void invalidateMaterialReportQueries(queryClient, materialId);
    },
  });
}
