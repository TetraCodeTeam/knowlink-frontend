import { useQuery } from "@tanstack/react-query";
import { Box, Button, CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import { X } from "lucide-react";
import { getTutorClaimDetail } from "@/modules/support/api/supportClaims.api";
import {
  getMaterialReportingPolicy,
  getReportedMaterialDetail,
} from "@/modules/support/api/supportMaterials.api";
import type { ReportedMaterialDetail } from "@/modules/support/interfaces/responses/reported-material-detail.response";
import type { TutorClaimDetail } from "@/modules/support/interfaces/responses/tutor-claim-detail.response";
import {
  CLAIM_STATUS_META,
  MATERIAL_STATUS_META,
} from "@/modules/support/constants/status.constants";
import { SupportStatusChip } from "@/modules/support/components/SupportStatusChip";
import { ClaimCommentComposer } from "@/modules/support/components/support-detail/ClaimCommentComposer";
import { ClaimDetailContent } from "@/modules/support/components/support-detail/ClaimDetailContent";
import { MaterialDetailContent } from "@/modules/support/components/support-detail/MaterialDetailContent";
import {
  supportDetailBodySx,
  supportDetailHeaderSx,
  supportDetailPanelSx,
} from "@/modules/support/styles/supportDetail.styles";

export type SupportDetailSelection =
  { type: "claim"; id: string } | { type: "material"; id: string } | null;

interface SupportDetailPanelProps {
  selection: SupportDetailSelection;
  onClose: () => void;
}

function SupportDetailHeader({
  selection,
  claim,
  material,
  onClose,
}: {
  selection: Exclude<SupportDetailSelection, null>;
  claim: TutorClaimDetail | undefined;
  material: ReportedMaterialDetail | undefined;
  onClose: () => void;
}) {
  const isClaim = selection.type === "claim";

  return (
    <Box sx={supportDetailHeaderSx}>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Typography
              sx={{ fontSize: 20, fontWeight: 700, color: "#3549A5", letterSpacing: 0.55 }}
            >
              {isClaim ? "Detalle del reclamo" : "Detalle del material"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Typography sx={{ mt: 0.25, fontSize: 14, fontWeight: 700, color: "#24263A" }}>
              {isClaim
                ? `#REC-${selection.id.slice(0, 8).toUpperCase()}`
                : (material?.originalFileName ?? material?.name ?? "Denuncia de material")}
            </Typography>

            {isClaim && claim && <SupportStatusChip {...CLAIM_STATUS_META[claim.status]} />}
            {!isClaim && material && (
              <SupportStatusChip {...MATERIAL_STATUS_META[material.status]} />
            )}
          </Box>
        </Box>
        <IconButton
          aria-label="Cerrar detalle"
          onClick={onClose}
          size="small"
          sx={{ bgcolor: "background.paper", color: "#3549A5", flexShrink: 0 }}
        >
          <X size={15} />
        </IconButton>
      </Box>
    </Box>
  );
}

function DetailLoadState({
  isLoading,
  isError,
  onRetry,
}: {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        <Typography color="error" sx={{ fontSize: 12, mb: 1 }}>
          No se pudo cargar el detalle.
        </Typography>
        <Button size="small" onClick={onRetry} sx={{ textTransform: "none", fontSize: 10 }}>
          Reintentar
        </Button>
      </Box>
    );
  }

  return null;
}

export function SupportDetailPanel({ selection, onClose }: SupportDetailPanelProps) {
  const claimId = selection?.type === "claim" ? selection.id : null;
  const materialId = selection?.type === "material" ? selection.id : null;

  const claimQuery = useQuery({
    queryKey: ["tutorSupport", "claimDetail", claimId],
    queryFn: () => getTutorClaimDetail(claimId!),
    enabled: claimId !== null,
  });
  const materialQuery = useQuery({
    queryKey: ["tutorSupport", "materialDetail", materialId],
    queryFn: () => getReportedMaterialDetail(materialId!),
    enabled: materialId !== null,
  });
  const policyQuery = useQuery({
    queryKey: ["tutorSupport", "materialPolicy"],
    queryFn: getMaterialReportingPolicy,
    enabled: materialId !== null,
  });

  if (!selection) return null;

  const isClaim = selection.type === "claim";
  const isLoading = isClaim ? claimQuery.isLoading : materialQuery.isLoading;
  const isError = isClaim ? claimQuery.isError : materialQuery.isError;
  const claim = claimQuery.data;
  const material = materialQuery.data;

  return (
    <Paper component="aside" aria-label="Detalle de soporte" sx={supportDetailPanelSx}>
      <SupportDetailHeader
        selection={selection}
        claim={claim}
        material={material}
        onClose={onClose}
      />
      <Box sx={supportDetailBodySx}>
        <DetailLoadState
          isLoading={isLoading}
          isError={isError}
          onRetry={() => void (isClaim ? claimQuery.refetch() : materialQuery.refetch())}
        />
        {!isLoading && !isError && claim && <ClaimDetailContent claim={claim} />}
        {!isLoading && !isError && material && (
          <MaterialDetailContent
            material={material}
            policy={policyQuery.data}
            policyIsLoading={policyQuery.isLoading}
            policyIsError={policyQuery.isError}
          />
        )}
      </Box>
      {claim && claim.status !== "RESOLVED" && <ClaimCommentComposer claimId={claim.claimId} />}
    </Paper>
  );
}
