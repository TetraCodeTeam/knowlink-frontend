import { Box, CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import { X } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import {
  useMaterialReportingPolicy,
  useReportedMaterialDetail,
  useTutorClaimDetail,
} from "@/modules/support/hooks/useSupportDetailQueries";
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
import { getSupportErrorMessage } from "@/modules/support/utils/supportErrors.utils";
import type { SupportDetailSelection } from "@/modules/support/interfaces/support-detail-selection.type";
import {
  detailSmallButtonSx,
  supportDetailBodySx,
  supportDetailCloseButtonSx,
  supportDetailHeaderSx,
  supportDetailPanelSx,
  supportDetailSubtitleSx,
  supportDetailTitleSx,
} from "@/modules/support/styles/supportDetail.styles";

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
            <Typography sx={supportDetailTitleSx}>
              {isClaim ? "Detalle del reclamo" : "Detalle del material"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Typography sx={supportDetailSubtitleSx}>
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
          sx={supportDetailCloseButtonSx}
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
  error,
  onRetry,
}: {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
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
        <Typography color="error" sx={{ fontSize: 14, mb: 1 }}>
          {getSupportErrorMessage(error, "No se pudo cargar el detalle.")}
        </Typography>
        <AppButton appVariant="outline" size="small" onClick={onRetry} sx={detailSmallButtonSx}>
          Reintentar
        </AppButton>
      </Box>
    );
  }

  return null;
}

export function SupportDetailPanel({ selection, onClose }: SupportDetailPanelProps) {
  const claimId = selection?.type === "claim" ? selection.id : null;
  const materialId = selection?.type === "material" ? selection.id : null;

  const claimQuery = useTutorClaimDetail(claimId);
  const materialQuery = useReportedMaterialDetail(materialId);
  const policyQuery = useMaterialReportingPolicy(materialId !== null);

  if (!selection) return null;

  const isClaim = selection.type === "claim";
  const isLoading = isClaim ? claimQuery.isLoading : materialQuery.isLoading;
  const isError = isClaim ? claimQuery.isError : materialQuery.isError;
  const error = isClaim ? claimQuery.error : materialQuery.error;
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
          error={error}
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
