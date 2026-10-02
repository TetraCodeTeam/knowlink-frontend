import { Box, Typography, Alert, Skeleton, Chip } from "@mui/material";
import { useFundsTransfer } from "@/modules/payments/hooks/useFundsTransfer";
import { fundsStatusLabel, fundsStatusColor } from "@/modules/payments/constants/fundsStatusLabel";
import { formatCurrency } from "@/shared/utils/currency.utils";

function formatDate(isoDate: string | null): string {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface FundsStatusSectionProps {
  bookingId: string;
}

export default function FundsStatusSection({ bookingId }: FundsStatusSectionProps) {
  const { data: fundsTransfer, isLoading, error } = useFundsTransfer(bookingId);

  if (isLoading) {
    return (
      <Box sx={{ mt: 2 }}>
        <Skeleton variant="text" width={200} height={24} />
        <Skeleton variant="text" width={300} height={20} />
      </Box>
    );
  }

  if (error || !fundsTransfer) {
    return null;
  }

  const { fundsStatus, transferredAmount, concept, processedAt } = fundsTransfer;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
        Estado de fondos
      </Typography>
      <Chip
        label={fundsStatusLabel[fundsStatus]}
        color={fundsStatusColor[fundsStatus]}
        size="small"
        variant="outlined"
        sx={{ mb: 1 }}
      />

      {fundsStatus === "HELD" && (
        <Typography variant="body2" color="text.secondary">
          Los fondos están retenidos, pendiente de confirmación de asistencia.
        </Typography>
      )}

      {fundsStatus === "SUSPENDED_BY_CLAIM" && (
        <Alert severity="warning" sx={{ mt: 1 }}>
          La transferencia queda en espera hasta que un administrador resuelva la disputa.
        </Alert>
      )}

      {fundsStatus === "RELEASED_TO_TUTOR" && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Monto transferido: <strong>{formatCurrency(transferredAmount)}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Concepto: {concept}
          </Typography>
          {processedAt && (
            <Typography variant="caption" color="text.secondary">
              Procesado el {formatDate(processedAt)}
            </Typography>
          )}
        </Box>
      )}

      {fundsStatus === "REFUNDED_TO_STUDENT" && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Monto devuelto: <strong>{formatCurrency(transferredAmount)}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Concepto: {concept}
          </Typography>
          {processedAt && (
            <Typography variant="caption" color="text.secondary">
              Procesado el {formatDate(processedAt)}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}