import { useState } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import AppButton from "@/shared/components/AppButton";
import StartClaimDialog from "@/modules/claim/components/StartClaimDialog";
import { CLAIM_BLOCK_REASON_MESSAGE } from "@/modules/claim/constants/claimReasonsConstants";
import { useClaimEligibility } from "@/modules/claim/hooks/useClaimEligibility";
import { useCreateClaim } from "@/modules/claim/hooks/useCreateClaim";
import type { StartClaimFormData } from "@/modules/claim/hooks/startClaimSchema";
import type { Role } from "@/shared/types/role.type";

interface StartClaimFlowProps {
  bookingId: string;
  claimantRole: Role;
  sessionSummary: string;
}

export default function StartClaimFlow({ bookingId, claimantRole, sessionSummary }: StartClaimFlowProps) {
  const [open, setOpen] = useState(false);
  const { eligibility } = useClaimEligibility(bookingId, true);
  const { submitClaim, isPending } = useCreateClaim(bookingId);

  if (!eligibility) return null;

  const canStartClaim = eligibility.canClaim && eligibility.allowedReasons.length > 0;

  const handleSubmit = async (data: StartClaimFormData) => {
    try {
      await submitClaim(data);
      setOpen(false);
    } catch (error: unknown) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 409 || status === 422) setOpen(false);
    }
  };

  if (!canStartClaim) {
    if (!eligibility.blockReason) return null;

    return (
      <Typography variant="caption" color="text.secondary" role="status">
        {CLAIM_BLOCK_REASON_MESSAGE[eligibility.blockReason]}
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <AppButton appVariant="outline" onClick={() => setOpen(true)}>
        Iniciar reclamo
      </AppButton>
      <StartClaimDialog
        open={open}
        claimantRole={claimantRole}
        allowedReasons={eligibility.allowedReasons}
        sessionSummary={sessionSummary}
        isPending={isPending}
        onSubmit={handleSubmit}
        onCancel={() => setOpen(false)}
      />
    </Box>
  );
}
