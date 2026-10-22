import { httpClient } from "@/shared/lib/httpClient";
import type { ReportMaterialRequest } from "@/modules/student/tutorProfile/interfaces/requests/report-material-request.interface";
import type { ReportMaterialResponse } from "@/modules/student/tutorProfile/interfaces/responses/report-material-response.interface";

export const reportMaterial = async (
  materialId: string,
  data: ReportMaterialRequest
): Promise<ReportMaterialResponse> => {
  const { data: response } = await httpClient.post<ReportMaterialResponse>(
    `/api/v1/materials/${materialId}/reports`,
    data
  );
  return response;
};
