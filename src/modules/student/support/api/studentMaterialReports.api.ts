import { httpClient } from "@/shared/lib/httpClient";
import type { MaterialReportingPolicy } from "@/modules/support/interfaces/responses/material-reporting-policy.response";
import type { StudentMaterialReportDetail } from "@/modules/student/support/interfaces/responses/student-material-report-detail.response";

export async function getStudentMaterialReportDetail(
  reportId: string
): Promise<StudentMaterialReportDetail> {
  const response = await httpClient.get<StudentMaterialReportDetail>(
    `/api/v1/students/support/material-reports/${reportId}`
  );
  return response.data;
}

export async function getStudentMaterialReportingPolicy(): Promise<MaterialReportingPolicy> {
  const response = await httpClient.get<MaterialReportingPolicy>(
    "/api/v1/students/support/material-policy"
  );
  return response.data;
}
