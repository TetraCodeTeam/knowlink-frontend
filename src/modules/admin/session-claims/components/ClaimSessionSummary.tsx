import { Box, Typography } from "@mui/material";
import { formatHeldAmount } from "@/modules/admin/session-claims/utils/format-held-amount";
import { formatSessionDate } from "@/modules/admin/session-claims/utils/format-session-date";
import { infoLabelSx, infoRowSx, infoValueSx } from "@/modules/admin/styles/admin-list.styles";

interface ClaimSessionSummaryProps {
  subjectName: string;
  sessionDate: string;
  heldAmount: number;
}

export default function ClaimSessionSummary({
  subjectName,
  sessionDate,
  heldAmount,
}: ClaimSessionSummaryProps) {
  return (
    <Box>
      <Box sx={infoRowSx}>
        <Typography sx={infoLabelSx}>Materia solicitada</Typography>
        <Typography sx={infoValueSx}>{subjectName}</Typography>
      </Box>
      <Box sx={infoRowSx}>
        <Typography sx={infoLabelSx}>Sesión</Typography>
        <Typography sx={infoValueSx}>{formatSessionDate(sessionDate)}</Typography>
      </Box>
      <Box sx={infoRowSx}>
        <Typography sx={infoLabelSx}>Monto retenido</Typography>
        <Typography sx={infoValueSx}>{formatHeldAmount(heldAmount)}</Typography>
      </Box>
    </Box>
  );
}
