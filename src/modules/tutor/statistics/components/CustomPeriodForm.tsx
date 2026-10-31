import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, TextField, Typography } from "@mui/material";
import AppButton from "@/shared/components/AppButton";
import { STATISTICS_COLORS } from "@/modules/tutor/statistics/constants/statistics-colors.constants";
import { MAX_LOOKBACK_YEARS } from "@/modules/tutor/statistics/constants/statistics.constants";
import {
  createCustomPeriodSchema,
  type CustomPeriodFormData,
} from "@/modules/tutor/statistics/schemas/custom-period.schema";
import { getEarliestCustomDate, toIsoDate } from "@/modules/tutor/statistics/utils/period.utils";

interface CustomPeriodFormProps {
  initialFrom: string;
  initialTo: string;
  onApply: (from: string, to: string) => void;
  onCancel: () => void;
}

export default function CustomPeriodForm({
  initialFrom,
  initialTo,
  onApply,
  onCancel,
}: CustomPeriodFormProps) {
  const today = useMemo(() => new Date(), []);
  const schema = useMemo(() => createCustomPeriodSchema(today), [today]);
  const earliest = getEarliestCustomDate(today);
  const latest = toIsoDate(today);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomPeriodFormData>({
    resolver: zodResolver(schema),
    defaultValues: { from: initialFrom, to: initialTo },
  });

  const submit = handleSubmit(({ from, to }) => onApply(from, to));

  return (
    <Box component="form" onSubmit={submit} noValidate sx={{ p: 3, width: { xs: 300, sm: 360 } }}>
      <Typography component="h3" sx={{ fontSize: 17, fontWeight: 600, mb: 0.5 }}>
        Período personalizado
      </Typography>
      <Typography sx={{ fontSize: 13, color: STATISTICS_COLORS.textMuted, mb: 2.5 }}>
        Podés consultar hasta {MAX_LOOKBACK_YEARS} años hacia atrás.
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        <TextField
          {...register("from")}
          type="date"
          label="Desde"
          size="small"
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { min: earliest, max: latest },
          }}
          error={Boolean(errors.from)}
          helperText={errors.from?.message}
        />
        <TextField
          {...register("to")}
          type="date"
          label="Hasta"
          size="small"
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { min: earliest, max: latest },
          }}
          error={Boolean(errors.to)}
          helperText={errors.to?.message}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 3 }}>
        <AppButton appVariant="outline" type="button" onClick={onCancel} sx={{ py: 0.75 }}>
          Cancelar
        </AppButton>
        <AppButton type="submit" sx={{ py: 0.75 }}>
          Aplicar
        </AppButton>
      </Box>
    </Box>
  );
}
