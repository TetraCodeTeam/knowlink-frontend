import { Box, Typography } from "@mui/material";
import { MessageSquareOff } from "lucide-react";
import {
  SESSION_CLAIM_MESSAGES,
  SESSION_CLAIM_ROLE_LABELS,
} from "@/modules/admin/session-claims/constants/session-claims.constants";
import type { AdminClaimParty } from "@/modules/admin/session-claims/interfaces/responses/admin-claim-party.response";
import {
  partyCardSx,
  partyHeaderSx,
  partyMessageSx,
  partyNameSx,
  partyNoMessageSx,
  partyRoleSx,
} from "@/modules/admin/session-claims/styles/session-claims.styles";
import { ADMIN_TOKENS } from "@/modules/admin/styles/admin-tokens";

interface ClaimPartyMessageProps {
  party: AdminClaimParty;
}

export default function ClaimPartyMessage({ party }: ClaimPartyMessageProps) {
  const roleLabel = SESSION_CLAIM_ROLE_LABELS[party.role];

  return (
    <Box sx={partyCardSx}>
      <Box sx={partyHeaderSx}>
        <Typography component="span" sx={partyNameSx}>
          {party.fullName}
        </Typography>
        <Typography component="span" sx={partyRoleSx}>
          ({roleLabel})
        </Typography>
      </Box>

      {party.message ? (
        <Box sx={partyMessageSx}>
          <Typography sx={{ fontSize: 13, color: ADMIN_TOKENS.slate600, lineHeight: 1.55 }}>
            {party.message}
          </Typography>
        </Box>
      ) : (
        <Box sx={partyNoMessageSx}>
          <MessageSquareOff size={16} aria-hidden="true" />
          <Typography component="span" sx={{ fontSize: 13, fontWeight: 500 }}>
            {SESSION_CLAIM_MESSAGES.noMessage}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
