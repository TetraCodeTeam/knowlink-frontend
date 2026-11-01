import { useState } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import AppButton from "@/shared/components/AppButton";
import AdminStatusChip from "@/modules/admin/components/AdminStatusChip";
import BeforeResolvingGuide from "@/modules/admin/components/BeforeResolvingGuide";
import ClaimPartyMessage from "@/modules/admin/session-claims/components/ClaimPartyMessage";
import ClaimResolutionForm from "@/modules/admin/session-claims/components/ClaimResolutionForm";
import ClaimSessionSummary from "@/modules/admin/session-claims/components/ClaimSessionSummary";
import ContactInfoDialog from "@/modules/admin/session-claims/components/ContactInfoDialog";
import { ADMIN_SESSION_CLAIM_STATUS_META } from "@/modules/admin/session-claims/constants/claim-status-meta";
import {
  SESSION_CLAIM_GUIDELINES,
  SESSION_CLAIM_MESSAGES,
} from "@/modules/admin/session-claims/constants/session-claims.constants";
import { useAdminSessionClaimDetail } from "@/modules/admin/session-claims/hooks/useAdminSessionClaimDetail";
import { useAssignSessionClaim } from "@/modules/admin/session-claims/hooks/useAssignSessionClaim";
import type { AdminSessionClaimDetailResponse } from "@/modules/admin/session-claims/interfaces/responses/admin-session-claim-detail.response";
import {
  partiesListSx,
  resolvedNoteLabelSx,
  resolvedNoteSx,
  resolvedNoteTextSx,
} from "@/modules/admin/session-claims/styles/session-claims.styles";
import {
  detailErrorSx,
  detailErrorTextSx,
  detailErrorTitleSx,
  detailHeaderSx,
  detailNoteSx,
  detailPanelSx,
  detailSubtitleSx,
  detailTitleRowSx,
  detailTitleSx,
  sectionSx,
  sectionTitleSx,
} from "@/modules/admin/styles/admin-list.styles";

interface SessionClaimDetailPanelProps {
  claimId: string | null;
}

interface PanelHeader {
  title: string;
  subtitle: string;
}

function getPanelHeader(detail: AdminSessionClaimDetailResponse): PanelHeader {
  if (detail.status === "OPEN") {
    return {
      title: "Detalle del reclamo",
      subtitle: "Revisión previa a la asignación",
    };
  }

  if (detail.status === "IN_REVIEW") {
    return {
      title: `En revisión por ${detail.assignedToName ?? "otro administrador"}`,
      subtitle: detail.assignedToMe
        ? "Solicitud asignada a tu moderación"
        : "Solicitud asignada a otro administrador",
    };
  }

  return {
    title: "Reclamo resuelto",
    subtitle: "Resolución final",
  };
}

export default function SessionClaimDetailPanel({ claimId }: SessionClaimDetailPanelProps) {
  const { detail, isLoading, isError, refetch } = useAdminSessionClaimDetail(claimId);
  const assignMutation = useAssignSessionClaim(claimId ?? "");
  const [contactOpen, setContactOpen] = useState(false);

  if (!claimId) {
    return (
      <Box component="aside" aria-label="Detalle del reclamo" sx={detailPanelSx}>
        <Typography component="h2" sx={detailTitleSx}>
          Seleccioná un reclamo
        </Typography>
        <Typography sx={detailSubtitleSx}>
          Elegí un reclamo de la lista para ver los mensajes de ambas partes y resolverlo.
        </Typography>
        <BeforeResolvingGuide guidelines={SESSION_CLAIM_GUIDELINES} />
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box component="aside" aria-label="Detalle del reclamo" aria-busy="true" sx={detailPanelSx}>
        <Skeleton variant="text" width="70%" height={32} />
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="rounded" height={96} />
        <Skeleton variant="rounded" height={140} />
        <Skeleton variant="rounded" height={120} />
      </Box>
    );
  }

  if (isError || !detail) {
    return (
      <Box component="aside" aria-label="Detalle del reclamo" sx={detailPanelSx}>
        <Box role="alert" sx={detailErrorSx}>
          <Typography sx={detailErrorTitleSx}>{SESSION_CLAIM_MESSAGES.detailErrorTitle}</Typography>
          <Typography sx={detailErrorTextSx}>{SESSION_CLAIM_MESSAGES.detailErrorText}</Typography>
          <AppButton appVariant="dark" onClick={() => void refetch()}>
            Reintentar
          </AppButton>
        </Box>
      </Box>
    );
  }

  const header = getPanelHeader(detail);
  const meta = ADMIN_SESSION_CLAIM_STATUS_META[detail.status];

  return (
    <Box component="aside" aria-label="Detalle del reclamo" sx={detailPanelSx}>
      <Box sx={detailHeaderSx}>
        <Box sx={detailTitleRowSx}>
          <Typography component="h2" sx={detailTitleSx}>
            {header.title}
          </Typography>
          <AdminStatusChip label={meta.label} tone={meta.tone} />
        </Box>
        <Typography sx={detailSubtitleSx}>{header.subtitle}</Typography>
      </Box>

      <ClaimSessionSummary
        subjectName={detail.subjectName}
        sessionDate={detail.sessionDate}
        heldAmount={detail.heldAmount}
      />

      <Box sx={sectionSx}>
        <Typography component="h3" sx={sectionTitleSx}>
          Mensajes de las partes
        </Typography>
        <Box sx={partiesListSx}>
          <ClaimPartyMessage party={detail.tutor} />
          <ClaimPartyMessage party={detail.student} />
        </Box>
      </Box>

      {detail.status === "OPEN" && (
        <Box sx={sectionSx}>
          <AppButton
            appVariant="primary"
            fullWidth
            loading={assignMutation.isPending}
            onClick={() => assignMutation.mutate()}
          >
            Tomar solicitud
          </AppButton>
          <Typography sx={detailNoteSx}>
            Al tomar la solicitud, el reclamo pasará a estar <strong>En revisión</strong> y quedará
            asignado a tu moderación.
          </Typography>
        </Box>
      )}

      {detail.status === "IN_REVIEW" && detail.assignedToMe && (
        <Box sx={sectionSx}>
          <AppButton appVariant="outline" fullWidth onClick={() => setContactOpen(true)}>
            Consultar datos de contacto
          </AppButton>
          <ClaimResolutionForm claimId={detail.claimId} />
        </Box>
      )}

      {detail.status === "IN_REVIEW" && !detail.assignedToMe && (
        <Typography sx={detailNoteSx}>
          Solo el administrador asignado puede resolver este reclamo.
        </Typography>
      )}

      {detail.status === "RESOLVED" && (
        <Box sx={resolvedNoteSx}>
          <Typography sx={resolvedNoteLabelSx}>Justificación del administrador:</Typography>
          <Typography sx={resolvedNoteTextSx}>
            {detail.resolutionJustification || "Sin justificación registrada."}
          </Typography>
        </Box>
      )}

      <ContactInfoDialog
        claimId={detail.claimId}
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </Box>
  );
}
