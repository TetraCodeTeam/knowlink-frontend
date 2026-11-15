import { Box, Typography } from "@mui/material";
import type { ClaimResolution } from "@/modules/support/interfaces/responses/claim-resolution.response";
import { SUPPORT_COLORS } from "@/modules/support/constants/support-colors.constants";
import { formatDateTime } from "@/modules/support/utils/format.utils";
import { SupportDetailSection } from "@/modules/support/components/support-detail/SupportDetailSection";
import { detailCardSx } from "@/modules/support/styles/supportDetail.styles";
import {
  supportBodyTextSx,
  supportMutedTextSx,
  supportQuoteTextSx,
  supportStrongLabelSx,
} from "@/modules/support/styles/supportText.styles";

interface ClaimResolutionSectionProps {
  resolution: ClaimResolution;
}

export function ClaimResolutionSection({ resolution }: ClaimResolutionSectionProps) {
  const outcomeColor = resolution.inMyFavor ? SUPPORT_COLORS.success : SUPPORT_COLORS.textSecondary;

  return (
    <SupportDetailSection title="Resolución del reclamo">
      <Box sx={detailCardSx}>
        <Typography sx={{ ...supportBodyTextSx, fontWeight: 600, color: outcomeColor }}>
          {resolution.inMyFavor
            ? "La resolución fue a tu favor."
            : "La resolución no fue a tu favor."}
        </Typography>
        <Typography sx={supportMutedTextSx}>
          Resuelto el {formatDateTime(resolution.resolvedAt)}
        </Typography>
        <Typography sx={{ ...supportStrongLabelSx, mt: 1, mb: 0.5 }}>
          Justificación del equipo académico:
        </Typography>
        <Typography sx={{ ...supportQuoteTextSx, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {resolution.justification}
        </Typography>
      </Box>
    </SupportDetailSection>
  );
}
