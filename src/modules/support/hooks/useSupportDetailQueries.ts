import { useQuery } from "@tanstack/react-query";
import { getTutorClaimDetail } from "@/modules/support/api/supportClaims.api";
import {
  getMaterialReportingPolicy,
  getReportedMaterialDetail,
} from "@/modules/support/api/supportMaterials.api";

export function useTutorClaimDetail(claimId: string | null) {
  return useQuery({
    queryKey: ["tutorSupport", "claimDetail", claimId],
    queryFn: () => getTutorClaimDetail(claimId!),
    enabled: claimId !== null,
  });
}

export function useReportedMaterialDetail(materialId: string | null) {
  return useQuery({
    queryKey: ["tutorSupport", "materialDetail", materialId],
    queryFn: () => getReportedMaterialDetail(materialId!),
    enabled: materialId !== null,
  });
}

export function useMaterialReportingPolicy(enabled: boolean) {
  return useQuery({
    queryKey: ["tutorSupport", "materialPolicy"],
    queryFn: getMaterialReportingPolicy,
    enabled,
  });
}
