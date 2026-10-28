import { httpClient } from "@/shared/lib/httpClient";
import type { MaterialReportingPolicy } from "@/modules/support/interfaces/responses/material-reporting-policy.response";
import type { ReportedMaterialDetail } from "@/modules/support/interfaces/responses/reported-material-detail.response";

export async function getReportedMaterialDetail(
  materialId: string
): Promise<ReportedMaterialDetail> {
  const response = await httpClient.get<ReportedMaterialDetail>(
    `/api/v1/tutors/support/materials/${materialId}`
  );
  return response.data;
}

export async function submitMaterialDefense(
  materialId: string,
  description: string,
  files: File[]
): Promise<void> {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify({ description })], { type: "application/json" })
  );
  files.forEach((file) => formData.append("files", file));
  await httpClient.post(`/api/v1/tutors/support/materials/${materialId}/defense`, formData);
}

export async function getMaterialReportingPolicy(): Promise<MaterialReportingPolicy> {
  const response = await httpClient.get<MaterialReportingPolicy>(
    "/api/v1/tutors/support/material-policy"
  );
  return response.data;
}
