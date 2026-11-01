import { useQuery } from "@tanstack/react-query";
import { getStudentClaimDetail } from "@/modules/student/support/api/studentClaims.api";
import {
  getStudentMaterialReportDetail,
  getStudentMaterialReportingPolicy,
} from "@/modules/student/support/api/studentMaterialReports.api";

export function useStudentClaimDetail(claimId: string | null) {
  return useQuery({
    queryKey: ["studentSupport", "claimDetail", claimId],
    queryFn: () => getStudentClaimDetail(claimId!),
    enabled: claimId !== null,
  });
}

export function useStudentMaterialReportDetail(reportId: string | null) {
  return useQuery({
    queryKey: ["studentSupport", "materialReportDetail", reportId],
    queryFn: () => getStudentMaterialReportDetail(reportId!),
    enabled: reportId !== null,
  });
}

export function useStudentMaterialReportingPolicy(enabled: boolean) {
  return useQuery({
    queryKey: ["studentSupport", "materialPolicy"],
    queryFn: getStudentMaterialReportingPolicy,
    enabled,
  });
}
