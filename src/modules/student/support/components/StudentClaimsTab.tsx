import { Box } from "@mui/material";
import { StudentClaimListItem } from "@/modules/student/support/components/StudentClaimListItem";
import { SupportEmptyState } from "@/modules/support/components/SupportEmptyState";
import { SupportListSection } from "@/modules/support/components/SupportListSection";
import type { StudentSessionClaimResponse } from "@/modules/student/support/interfaces/responses/student-support.response";
import { listSx } from "@/modules/support/styles/supportList.styles";

interface StudentClaimsTabProps {
  claims: StudentSessionClaimResponse[];
  onViewDetail: (claimId: string) => void;
  selectedClaimId?: string;
}

export function StudentClaimsTab({ claims, onViewDetail, selectedClaimId }: StudentClaimsTabProps) {
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
          <StudentClaimListItem
            key={claim.claimId}
            claim={claim}
            onViewDetail={onViewDetail}
            selected={claim.claimId === selectedClaimId}
          />
        ))}
      </Box>
    </SupportListSection>
  );
}
