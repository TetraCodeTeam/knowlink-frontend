import { Box } from "@mui/material";
import { ClaimListItem } from "@/modules/support/components/ClaimListItem";
import { SupportEmptyState } from "@/modules/support/components/SupportEmptyState";
import { SupportListSection } from "@/modules/support/components/SupportListSection";
import type { ClaimResponse } from "@/modules/support/interfaces/responses/claim.response";
import { listSx } from "@/modules/support/styles/support.styles";

interface ClaimsTabProps {
  claims: ClaimResponse[];
  onViewDetail: (claimId: string) => void;
  selectedClaimId?: string;
}

export function ClaimsTab({ claims, onViewDetail, selectedClaimId }: ClaimsTabProps) {
  if (claims.length === 0) {
    return <SupportEmptyState />;
  }

  return (
    <SupportListSection
      title="Historial de reclamos"
      subtitle="Visualizá el avance e intervenciones del equipo académico"
      count={claims.length}
    >
      <Box component="ul" sx={listSx}>
        {claims.map((claim) => (
          <ClaimListItem
            key={claim.id}
            claim={claim}
            onViewDetail={onViewDetail}
            selected={claim.id === selectedClaimId}
          />
        ))}
      </Box>
    </SupportListSection>
  );
}
