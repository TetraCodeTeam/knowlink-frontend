import { useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import AppButton from "@/shared/components/AppButton";
import StartClaimDialog from "@/modules/claim/components/StartClaimDialog";
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

  if (!eligibility?.canClaim) return null;

  const handleSubmit = async (data: StartClaimFormData) => {
    try {
      await submitClaim(data);
      setOpen(false);
    } catch (err: unknown) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      // 409/422: ya no se puede reclamar (reclamo activo o plazo vencido).
      if (status === 409 || status === 422) setOpen(false);
      // Otros errores: el interceptor de httpClient ya mostró el aviso; el diálogo sigue abierto.
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <AppButton appVariant="outline" onClick={() => setOpen(true)}>
        Iniciar reclamo
      </AppButton>
      <StartClaimDialog
        open={open}
        claimantRole={claimantRole}
        sessionSummary={sessionSummary}
        isPending={isPending}
        onSubmit={handleSubmit}
        onCancel={() => setOpen(false)}
      />
    </Box>
  );
}
