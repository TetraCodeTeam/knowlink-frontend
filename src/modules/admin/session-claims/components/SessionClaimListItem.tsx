import { Box, Typography } from "@mui/material";
import { Clock } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import AdminStatusChip from "@/modules/admin/components/AdminStatusChip";
import { ADMIN_SESSION_CLAIM_STATUS_META } from "@/modules/admin/session-claims/constants/claim-status-meta";
import { SESSION_CLAIM_ROLE_LABELS } from "@/modules/admin/session-claims/constants/session-claims.constants";
import type { AdminSessionClaimListItem as AdminSessionClaimListItemResponse } from "@/modules/admin/session-claims/interfaces/responses/admin-session-claim-list-item.response";
import { formatSessionDate } from "@/modules/admin/session-claims/utils/format-session-date";
import {
  itemActionSx,
  itemBodySx,
  itemMetaSx,
  itemMetaStrongSx,
  itemSeparatorSx,
  itemStripeSx,
  itemTitleRowSx,
  itemTitleSx,
  justificationLabelSx,
  justificationSx,
  justificationTextSx,
  listItemSelectedSx,
  listItemSx,
} from "@/modules/admin/styles/admin-list.styles";

interface SessionClaimListItemProps {
  claim: AdminSessionClaimListItemResponse;
  selected: boolean;
  onSelect: (claimId: string) => void;
}

export default function SessionClaimListItem({
  claim,
  selected,
  onSelect,
}: SessionClaimListItemProps) {
  const meta = ADMIN_SESSION_CLAIM_STATUS_META[claim.status];
  const isOpen = claim.status === "OPEN";
  const isResolved = claim.status === "RESOLVED";

  return (
    <Box
      component="li"
      sx={{ ...listItemSx, ...(selected ? listItemSelectedSx : {}) }}
      aria-label={claim.subjectName}
    >
      <Box sx={{ ...itemStripeSx, backgroundColor: meta.accent }} aria-hidden="true" />

      <Box sx={itemBodySx}>
        <Box sx={itemTitleRowSx}>
          <Typography component="span" title={claim.subjectName} sx={itemTitleSx}>
            {claim.subjectName}
          </Typography>
          <AdminStatusChip label={meta.label} tone={meta.tone} />
        </Box>

        <Typography sx={itemMetaSx}>
          <span>
            {claim.tutorName} ({SESSION_CLAIM_ROLE_LABELS.TUTOR})
          </span>
          <Box component="span" sx={itemSeparatorSx} aria-hidden="true">
            •
          </Box>
          <span>
            {claim.studentName} ({SESSION_CLAIM_ROLE_LABELS.STUDENT})
          </span>
        </Typography>

        <Box sx={itemMetaSx}>
          <Clock size={13} aria-hidden="true" />
          <span>Sesión del {formatSessionDate(claim.sessionDate)}</span>

          {claim.status === "IN_REVIEW" && claim.assignedToName && (
            <>
              <Box component="span" sx={itemSeparatorSx} aria-hidden="true">
                •
              </Box>
              <Box component="span" sx={itemMetaStrongSx}>
                Asignado a: {claim.assignedToName}
              </Box>
            </>
          )}
        </Box>

        {isResolved && (
          <Box sx={justificationSx}>
            <Typography component="p" sx={justificationLabelSx}>
              Justificación del administrador:
            </Typography>
            <Typography sx={justificationTextSx}>
              {claim.resolutionJustification || "Sin justificación registrada."}
            </Typography>
          </Box>
        )}
      </Box>

      <AppButton
        appVariant={isOpen ? "primary" : "outline"}
        size="small"
        onClick={() => onSelect(claim.claimId)}
        sx={{ ...itemActionSx, py: 1, px: 2, fontSize: 13 }}
      >
        Revisar
      </AppButton>
    </Box>
  );
}
