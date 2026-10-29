import { rawHttpClient } from "@/shared/lib/httpClient";
import type { AdminMaterialReportDetailResponse } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-detail.response";
import type { AdminMaterialReportListResponse } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-list.response";
import type { AdminMaterialReportListParams } from "@/modules/admin/material-reports/interfaces/requests/admin-material-report-list.params";
import type { DismissMaterialReportRequest } from "@/modules/admin/material-reports/interfaces/requests/dismiss-material-report.request";
import type { RemoveMaterialRequest } from "@/modules/admin/material-reports/interfaces/requests/remove-material.request";

const BASE_PATH = "/api/v1/admin/material-reports";

/**
 * Usa `rawHttpClient` para que la pantalla controle el estado de error y los
 * diálogos muestren el `message` del backend sin duplicar el snackbar global.
 */
export async function getMaterialReports(
  filters: AdminMaterialReportListParams
): Promise<AdminMaterialReportListResponse> {
  const params: Record<string, string | number | boolean> = {
    page: filters.page - 1,
    size: filters.size,
  };

  if (filters.status !== "ALL") params.status = filters.status;
  if (filters.scope === "mine") params.assignedToMe = true;

  const { data } = await rawHttpClient.get<AdminMaterialReportListResponse>(BASE_PATH, { params });
  return data;
}

export async function getMaterialReportDetail(
  materialId: string
): Promise<AdminMaterialReportDetailResponse> {
  const { data } = await rawHttpClient.get<AdminMaterialReportDetailResponse>(
    `${BASE_PATH}/${materialId}`
  );
  return data;
}

export async function assignMaterialReport(materialId: string): Promise<void> {
  await rawHttpClient.post(`${BASE_PATH}/${materialId}/assign`);
}

export async function removeMaterial(
  materialId: string,
  payload: RemoveMaterialRequest
): Promise<void> {
  await rawHttpClient.post(`${BASE_PATH}/${materialId}/remove`, payload);
}

export async function dismissMaterialReport(
  materialId: string,
  payload: DismissMaterialReportRequest
): Promise<void> {
  await rawHttpClient.post(`${BASE_PATH}/${materialId}/dismiss`, payload);
}
