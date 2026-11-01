import { Box, Typography } from "@mui/material";
import type { ClaimFavoredParty } from "@/modules/admin/types/claim-favored-party.type";
import {
  SESSION_CLAIM_FAVORED_LABELS,
  SESSION_CLAIM_MESSAGES,
} from "@/modules/admin/session-claims/constants/session-claims.constants";
import {
  favoredButtonActiveSx,
  favoredButtonSx,
  favoredToggleSx,
  fieldErrorSx,
  fieldLabelSx,
} from "@/modules/admin/session-claims/styles/session-claims.styles";

const OPTIONS: ClaimFavoredParty[] = ["STUDENT", "TUTOR"];

interface FavoredPartyToggleProps {
  value: ClaimFavoredParty | undefined;
  onChange: (value: ClaimFavoredParty) => void;
  error?: string;
}

export default function FavoredPartyToggle({ value, onChange, error }: FavoredPartyToggleProps) {
  return (
    <Box>
      <Typography sx={{ ...fieldLabelSx, mb: 1 }}>Resolver a favor de</Typography>

      <Box role="radiogroup" aria-label="Resolver a favor de" sx={favoredToggleSx}>
        {OPTIONS.map((option) => {
          const active = value === option;

          return (
            <Box
              key={option}
              component="button"
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option)}
              sx={{ ...favoredButtonSx, ...(active ? favoredButtonActiveSx : {}) }}
            >
              {SESSION_CLAIM_FAVORED_LABELS[option]}
            </Box>
          );
        })}
      </Box>

      {error && (
        <Typography role="alert" sx={{ ...fieldErrorSx, mt: 1 }}>
          {error || SESSION_CLAIM_MESSAGES.resolveError}
        </Typography>
      )}
    </Box>
  );
}
