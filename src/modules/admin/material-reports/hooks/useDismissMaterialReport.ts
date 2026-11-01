import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dismissMaterialReport } from "@/modules/admin/material-reports/api/admin-material-reports.api";
import { MATERIAL_REPORT_MESSAGES } from "@/modules/admin/material-reports/constants/material-reports.constants";
import { invalidateMaterialReportQueries } from "@/modules/admin/material-reports/utils/invalidate-material-report-queries";
import type { DismissMaterialReportRequest } from "@/modules/admin/material-reports/interfaces/requests/dismiss-material-report.request";
import { getErrorMessage } from "@/shared/utils/errors";

export function useDismissMaterialReport(materialId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DismissMaterialReportRequest) =>
      dismissMaterialReport(materialId, payload),
    onSuccess: async () => {
      toast.success(MATERIAL_REPORT_MESSAGES.dismissSuccess);
      await invalidateMaterialReportQueries(queryClient, materialId);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, MATERIAL_REPORT_MESSAGES.dismissError));
    },
  });
}
