import { Box, Button, Typography } from "@mui/material";
import { BookOpen, CalendarDays, ChevronRight, CircleCheck } from "lucide-react";
import { SupportStatusChip } from "@/modules/support/components/SupportStatusChip";
import { CLAIM_STATUS_META } from "@/modules/support/constants/status.constants";
import type { ClaimResponse } from "@/modules/support/interfaces/responses/claim.response";
import {
  detailButtonSx,
  getIconBoxSx,
  itemBodySx,
  itemMetaSx,
  itemReasonSx,
  itemTitleRowSx,
  itemTitleSx,
  listItemSx,
  metaSeparatorSx,
  TONE_COLORS,
} from "@/modules/support/styles/support.styles";
import { formatLongDate, formatShortDate } from "@/modules/support/utils/format.utils";

interface ClaimListItemProps {
  claim: ClaimResponse;
  onViewDetail: (claimId: string) => void;
  selected?: boolean;
}

export function ClaimListItem({ claim, onViewDetail, selected = false }: ClaimListItemProps) {
  const { label, tone } = CLAIM_STATUS_META[claim.status];
  const isResolved = claim.status === "RESOLVED" && claim.resolvedAt !== null;
  const { bg, fg } = TONE_COLORS[tone];

  return (
    <Box
      component="li"
      sx={{
        ...listItemSx,
        border: selected ? "1px solid #4C5CB5" : "1px solid transparent",
        boxShadow: selected ? "0 2px 5px rgba(41, 62, 157, 0.2)" : "none",
        bgcolor: selected ? "#F4F5FF" : listItemSx.bgcolor,
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
          <SupportStatusChip label={label} tone={tone} />
        </Box>

        <Box sx={itemMetaSx}>
          {isResolved ? (
            <>
              <CircleCheck size={12} aria-hidden="true" />
              <span>Resuelta el {formatShortDate(claim.resolvedAt ?? "")}</span>
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
          <span>{claim.studentName}</span>
        </Box>

        <Typography noWrap sx={itemReasonSx}>
          Motivo: {claim.reason}
        </Typography>
      </Box>

      <Button
        size="small"
        variant="text"
        endIcon={<ChevronRight size={14} aria-hidden="true" />}
        sx={detailButtonSx}
        onClick={() => onViewDetail(claim.id)}
      >
        Ver detalle
      </Button>
    </Box>
  );
}
