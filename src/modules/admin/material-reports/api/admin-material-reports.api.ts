import { rawHttpClient } from "@/shared/lib/httpClient";
import type { AdminMaterialReportDetailResponse } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-detail.response";
import type { AdminMaterialReportListResponse } from "@/modules/admin/material-reports/interfaces/responses/admin-material-report-list.response";
import type { AdminMaterialReportListParams } from "@/modules/admin/material-reports/interfaces/requests/admin-material-report-list.params";
import type { DismissMaterialReportRequest } from "@/modules/admin/material-reports/interfaces/requests/dismiss-material-report.request";
import type { RemoveMaterialRequest } from "@/modules/admin/material-reports/interfaces/requests/remove-material.request";
import {
  mapMaterialReportDetail,
  mapMaterialReportList,
} from "@/modules/admin/material-reports/api/material-report.mapper";
import type {
  ApiMaterialReportDetailResponse,
  ApiMaterialReportListResponse,
} from "@/modules/admin/material-reports/api/material-report.mapper";

const BASE_PATH = "/api/v1/admin/material-reports";

/**
 * Usa `rawHttpClient` para que la pantalla controle el estado de error y los
 * diálogos muestren el `message` del backend sin duplicar el snackbar global.
 *
 * El backend agrupa las denuncias por caso (`caseId`) y envuelve la página en
 * `{ page, statusCounts }`; el mapper lo adapta al modelo de vista de la UI.
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

  const { data } = await rawHttpClient.get<ApiMaterialReportListResponse>(BASE_PATH, { params });
  return mapMaterialReportList(data);
}

export async function getMaterialReportDetail(
  caseId: string
): Promise<AdminMaterialReportDetailResponse> {
  const { data } = await rawHttpClient.get<ApiMaterialReportDetailResponse>(
    `${BASE_PATH}/${caseId}`
  );
  return mapMaterialReportDetail(data);
}

export async function assignMaterialReport(caseId: string): Promise<void> {
  await rawHttpClient.post(`${BASE_PATH}/${caseId}/assign`);
}

export async function removeMaterial(
  caseId: string,
  payload: RemoveMaterialRequest
): Promise<void> {
  await rawHttpClient.post(`${BASE_PATH}/${caseId}/remove`, payload);
}

export async function dismissMaterialReport(
  caseId: string,
  payload: DismissMaterialReportRequest
): Promise<void> {
  // El backend ignora el body de `dismiss`: el caso queda con
  // `resolutionNote = null` según el contrato publicado.
  await rawHttpClient.post(`${BASE_PATH}/${caseId}/dismiss`, payload);
}
