import { Avatar, Box, Link, Typography } from "@mui/material";
import { Banknote, Clock3, Paperclip, UserRound, ArrowUpRight } from "lucide-react";
import type { TutorClaimDetail } from "@/modules/support/interfaces/responses/tutor-claim-detail.response";
import { formatLongDate } from "@/modules/support/utils/format.utils";
import {
  formatReviewPhase,
  formatSupportAmount,
  formatSupportReason,
} from "@/modules/support/utils/supportDetail.utils";
import { SupportDetailSection, SupportDetailTile } from "./SupportDetailSection";
import { attachmentLinkSx, detailCardSx } from "../../styles/supportDetail.styles";

interface ClaimDetailContentProps {
  claim: TutorClaimDetail;
}

export function ClaimDetailContent({ claim }: ClaimDetailContentProps) {
  return (
    <>
      <SupportDetailSection title="Estudiante involucrado">
        <Box sx={{ ...detailCardSx, display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            src={claim.student.profilePictureUrl ?? undefined}
            sx={{ width: 34, height: 34, bgcolor: "#E1E5FF", color: "#3347A3" }}
          >
            <UserRound size={17} />
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#282A3B" }}>
              {claim.student.fullName}
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#686C7B", lineHeight: 1.35 }}>
              {claim.student.careerName ?? "Estudiante"}
            </Typography>
          </Box>
        </Box>
      </SupportDetailSection>

      <Box sx={{ display: "flex", gap: 1 }}>
        <SupportDetailTile title="Materia">
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#282A3B" }}>
            {claim.subjectName}
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#73778A" }}>
            Sesión del {formatLongDate(claim.sessionDate)}
          </Typography>
        </SupportDetailTile>
        <SupportDetailTile title="Causal del reclamo">
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#A94442" }}>
            {formatSupportReason(claim.reason)}
          </Typography>
        </SupportDetailTile>
      </Box>

      <SupportDetailSection title="Fondos y garantía">
        <Box sx={{ ...detailCardSx, p: 1.25 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
            <Box>
              <Typography sx={{ fontSize: 14, color: "#73778A" }}>Honorarios retenidos</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#282A3B" }}>
                {formatSupportAmount(claim.funds.protectedAmount, claim.funds.currency)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ fontSize: 14, color: "#73778A" }}>Garantía académica</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#3549A5" }}>
                {claim.funds.protectedAmount > 0 ? "100% protegido" : "Sin fondos retenidos"}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 0.6,
              mt: 1,
              p: 0.75,
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          >
            <Banknote size={20} color="#5866B1" />
            <Typography sx={{ fontSize: 14, color: "#686C7B" }}>
              Los fondos se liberarán automáticamente al finalizar la revisión.
            </Typography>
          </Box>
        </Box>
      </SupportDetailSection>

      <SupportDetailSection title="Descargo y evidencias">
        <Box sx={detailCardSx}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#73778A", mb: 0.5 }}>
            Declaración del {claim.claimantRole === "TUTOR" ? "tutor" : "estudiante"}:
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#55596B", fontStyle: "italic", lineHeight: 1.5 }}>
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

      <Box
        sx={{
          ...detailCardSx,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 0.8,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Clock3 size={14} color="#3549A5" />
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#73778A" }}>
            Fase actual del reclamo
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#282A3B" }}>
          {formatReviewPhase(claim.reviewProgress.currentPhase)}
        </Typography>
        {claim.reviewProgress.queuePosition != null && (
          <Typography sx={{ fontSize: 12, color: "#73778A" }}>
            Turno #{claim.reviewProgress.queuePosition}
          </Typography>
        )}
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#3549A5" }}>
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
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#73778A" }}>
                  {entry.authorName} · {new Date(entry.createdAt).toLocaleString("es-AR")}
                </Typography>
                <Typography sx={{ fontSize: 14, color: "#45495A", mt: 0.25 }}>
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
