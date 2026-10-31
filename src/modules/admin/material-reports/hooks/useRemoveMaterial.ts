import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { removeMaterial } from "@/modules/admin/material-reports/api/admin-material-reports.api";
import { MATERIAL_REPORT_MESSAGES } from "@/modules/admin/material-reports/constants/material-reports.constants";
import { invalidateMaterialReportQueries } from "@/modules/admin/material-reports/utils/invalidate-material-report-queries";
import type { RemoveMaterialRequest } from "@/modules/admin/material-reports/interfaces/requests/remove-material.request";
import { getErrorMessage } from "@/shared/utils/errors";

export function useRemoveMaterial(materialId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RemoveMaterialRequest) => removeMaterial(materialId, payload),
    onSuccess: async () => {
      toast.success(MATERIAL_REPORT_MESSAGES.removeSuccess);
      await invalidateMaterialReportQueries(queryClient, materialId);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, MATERIAL_REPORT_MESSAGES.removeError));
    },
  });
}
