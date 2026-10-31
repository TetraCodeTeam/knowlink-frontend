import { Box, Button, Typography } from "@mui/material";
import { BookOpen, CalendarDays, ChevronRight, CircleCheck } from "lucide-react";
import { SupportStatusChip } from "@/modules/support/components/SupportStatusChip";
import { CLAIM_STATUS_META } from "@/modules/support/constants/status.constants";
import { SUPPORT_COLORS } from "@/modules/support/constants/support-colors.constants";
import type { StudentSessionClaimResponse } from "@/modules/student/support/interfaces/responses/student-support.response";
import {
  detailButtonSx,
  itemBodySx,
  itemMetaSx,
  itemReasonSx,
  itemTitleRowSx,
  itemTitleSx,
  listItemSx,
  metaSeparatorSx,
} from "@/modules/support/styles/supportList.styles";
import { getIconBoxSx, TONE_COLORS } from "@/modules/support/styles/supportShared.styles";
import { formatLongDate, formatShortDate } from "@/modules/support/utils/format.utils";

interface StudentClaimListItemProps {
  claim: StudentSessionClaimResponse;
  onViewDetail: (claimId: string) => void;
  selected?: boolean;
}

export function StudentClaimListItem({
  claim,
  onViewDetail,
  selected = false,
}: StudentClaimListItemProps) {
  const { tone } = CLAIM_STATUS_META[claim.status];
  const isResolved = claim.status === "RESOLVED";
  const { bg, fg } = TONE_COLORS[tone];

  return (
    <Box
      component="li"
      sx={{
        ...listItemSx,
        border: selected ? `1px solid ${SUPPORT_COLORS.borderSelected}` : "1px solid transparent",
        boxShadow: selected ? "0 2px 5px rgba(41, 62, 157, 0.2)" : "none",
        bgcolor: selected ? SUPPORT_COLORS.surfaceSelected : listItemSx.bgcolor,
      }}
    >
      <Box sx={getIconBoxSx(bg, fg)}>
        <BookOpen size={18} aria-hidden="true" />
      </Box>

      <Box sx={itemBodySx}>
        <Box sx={itemTitleRowSx}>
          <Typography component="span" sx={itemTitleSx}>
            {claim.subjectName}
          </Typography>
          <SupportStatusChip label={claim.statusLabel} tone={tone} />
        </Box>

        <Box sx={itemMetaSx}>
          {isResolved ? (
            <>
              <CircleCheck size={12} aria-hidden="true" />
              <span>Resuelto el {formatShortDate(claim.updatedAt.slice(0, 10))}</span>
            </>
          ) : (
            <>
              <CalendarDays size={12} aria-hidden="true" />
              <span>Sesión del {formatLongDate(claim.sessionDate)}</span>
            </>
          )}
          <Box component="span" sx={metaSeparatorSx} aria-hidden="true">
            ·
          </Box>
          <span>{claim.tutorName}</span>
        </Box>

        <Typography noWrap sx={itemReasonSx}>
          Motivo: {claim.reasonLabel}
          {" · "}
          {claim.initiatedByMe ? "Tu reclamo" : "Reclamo contra vos"}
        </Typography>
      </Box>

      <Button
        size="small"
        variant="text"
        endIcon={<ChevronRight size={14} aria-hidden="true" />}
        sx={detailButtonSx}
        onClick={() => onViewDetail(claim.claimId)}
      >
        Ver detalle
      </Button>
    </Box>
  );
}
