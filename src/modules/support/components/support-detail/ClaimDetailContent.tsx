import { Avatar, Box, Link, Typography } from "@mui/material";
import { Banknote, Clock3, Paperclip, UserRound, ArrowUpRight } from "lucide-react";
import type { TutorClaimDetail } from "@/modules/support/interfaces/responses/tutor-claim-detail.response";
import { SUPPORT_COLORS } from "@/modules/support/constants/support-colors.constants";
import { formatLongDate } from "@/modules/support/utils/format.utils";
import {
  formatReviewPhase,
  formatSupportAmount,
  formatSupportReason,
} from "@/modules/support/utils/supportDetail.utils";
import {
  SupportDetailSection,
  SupportDetailTile,
} from "@/modules/support/components/support-detail/SupportDetailSection";
import {
  attachmentLinkSx,
  detailAvatarSx,
  detailCardSx,
  detailFundsNoteSx,
  detailPhaseCardSx,
} from "@/modules/support/styles/supportDetail.styles";
import {
  supportAccentTextSx,
  supportBodyTextSx,
  supportDangerTextSx,
  supportMutedLabelSx,
  supportMutedTextSx,
  supportQuoteTextSx,
  supportStrongLabelSx,
  supportTitleTextSx,
} from "@/modules/support/styles/supportText.styles";

interface ClaimDetailContentProps {
  claim: TutorClaimDetail;
}

export function ClaimDetailContent({ claim }: ClaimDetailContentProps) {
  return (
    <>
      <SupportDetailSection title="Estudiante involucrado">
        <Box sx={{ ...detailCardSx, display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar src={claim.student.profilePictureUrl ?? undefined} sx={detailAvatarSx}>
            <UserRound size={17} />
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={supportTitleTextSx}>{claim.student.fullName}</Typography>
            <Typography sx={{ ...supportBodyTextSx, lineHeight: 1.35 }}>
              {claim.student.careerName ?? "Estudiante"}
            </Typography>
          </Box>
        </Box>
      </SupportDetailSection>

      <Box sx={{ display: "flex", gap: 1 }}>
        <SupportDetailTile title="Materia">
          <Typography sx={supportTitleTextSx}>{claim.subjectName}</Typography>
          <Typography sx={supportMutedTextSx}>
            Sesión del {formatLongDate(claim.sessionDate)}
          </Typography>
        </SupportDetailTile>
        <SupportDetailTile title="Causal del reclamo">
          <Typography sx={supportDangerTextSx}>{formatSupportReason(claim.reason)}</Typography>
        </SupportDetailTile>
      </Box>

      <SupportDetailSection title="Fondos y garantía">
        <Box sx={detailCardSx}>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
            <Box>
              <Typography sx={supportMutedTextSx}>Honorarios retenidos</Typography>
              <Typography sx={supportTitleTextSx}>
                {formatSupportAmount(claim.funds.protectedAmount, claim.funds.currency)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography sx={supportMutedTextSx}>Garantía académica</Typography>
              <Typography sx={supportAccentTextSx}>
                {claim.funds.protectedAmount > 0 ? "100% protegido" : "Sin fondos retenidos"}
              </Typography>
            </Box>
          </Box>
          <Box sx={detailFundsNoteSx}>
            <Banknote size={20} color={SUPPORT_COLORS.primaryIcon} />
            <Typography sx={supportBodyTextSx}>
              Los fondos se liberarán automáticamente al finalizar la revisión.
            </Typography>
          </Box>
        </Box>
      </SupportDetailSection>

      <SupportDetailSection title="Descargo y evidencias">
        <Box sx={detailCardSx}>
          <Typography sx={{ ...supportStrongLabelSx, mb: 0.5 }}>
            Declaración del {claim.claimantRole === "TUTOR" ? "tutor" : "estudiante"}:
          </Typography>
          <Typography sx={supportQuoteTextSx}>
            {claim.declaration || "No se agregó una declaración."}
          </Typography>
          {claim.attachments.length > 0 && (
            <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
              {claim.attachments.map((attachment) => (
                <Link
                  key={attachment.id}
                  href={attachment.signedUrl}
                  target="_blank"
                  rel="noreferrer"
                  sx={attachmentLinkSx}
                >
                  <Paperclip size={14} />
                  {attachment.fileName}
                  <ArrowUpRight size={14} />
                </Link>
              ))}
            </Box>
          )}
        </Box>
      </SupportDetailSection>

      <Box sx={detailPhaseCardSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Clock3 size={14} color={SUPPORT_COLORS.primary} />
          <Typography sx={supportMutedLabelSx}>Fase actual del reclamo</Typography>
        </Box>
        <Typography sx={{ ...supportTitleTextSx, fontSize: 14 }}>
          {formatReviewPhase(claim.reviewProgress.currentPhase)}
        </Typography>
        {claim.reviewProgress.queuePosition != null && (
          <Typography sx={supportMutedTextSx}>
            Turno #{claim.reviewProgress.queuePosition}
          </Typography>
        )}
        <Typography sx={{ ...supportAccentTextSx, fontWeight: 600 }}>
          {claim.reviewProgress.remainingMinutes > 0
            ? `< ${Math.ceil(claim.reviewProgress.remainingMinutes / 60)} hs resp.`
            : "Actualizado"}
        </Typography>
      </Box>

      {claim.comments.length > 0 && (
        <SupportDetailSection title="Seguimiento">
          <Box sx={{ ...detailCardSx, display: "flex", flexDirection: "column", gap: 1 }}>
            {claim.comments.map((entry) => (
              <Box key={entry.id}>
                <Typography sx={supportStrongLabelSx}>
                  {entry.authorName} · {new Date(entry.createdAt).toLocaleString("es-AR")}
                </Typography>
                <Typography sx={{ ...supportBodyTextSx, color: SUPPORT_COLORS.textBody, mt: 0.25 }}>
                  {entry.comment}
                </Typography>
              </Box>
            ))}
          </Box>
        </SupportDetailSection>
      )}
    </>
  );
}
