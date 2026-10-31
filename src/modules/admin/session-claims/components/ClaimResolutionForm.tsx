import { useState } from "react";
import { TextField } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Box } from "@mui/material";
import AppButton from "@/shared/components/AppButton";
import ConfirmResolutionDialog from "@/modules/admin/session-claims/components/ConfirmResolutionDialog";
import FavoredPartyToggle from "@/modules/admin/session-claims/components/FavoredPartyToggle";
import { SESSION_CLAIM_JUSTIFICATION_MAX_LENGTH } from "@/modules/admin/session-claims/constants/session-claims.constants";
import { useResolveSessionClaim } from "@/modules/admin/session-claims/hooks/useResolveSessionClaim";
import {
  resolveClaimSchema,
  type ResolveClaimFormValues,
} from "@/modules/admin/session-claims/schemas/resolve-claim.schema";
import { resolutionFormSx } from "@/modules/admin/session-claims/styles/session-claims.styles";
import { dialogFieldSx } from "@/modules/admin/styles/admin-list.styles";

interface ClaimResolutionFormProps {
  claimId: string;
}

export default function ClaimResolutionForm({ claimId }: ClaimResolutionFormProps) {
  const mutation = useResolveSessionClaim(claimId);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ResolveClaimFormValues>({
    resolver: zodResolver(resolveClaimSchema),
    defaultValues: {
      justification: "",
    },
    mode: "onSubmit",
  });

  const openConfirmation = () => setConfirmOpen(true);

  const confirmResolution = async () => {
    const values = getValues();

    try {
      await mutation.mutateAsync({
        favoredParty: values.favoredParty,
        justification: values.justification.trim(),
      });
    } catch {
      // El hook muestra el message del backend. El diálogo se cierra igual y el
      // formulario conserva la parte elegida y la justificación escritas.
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(openConfirmation)}
      sx={resolutionFormSx}
    >
      <Controller
        control={control}
        name="favoredParty"
        render={({ field, fieldState }) => (
          <FavoredPartyToggle
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <TextField
        {...register("justification")}
        label="Justificación (obligatoria, visible para ambas partes)"
        placeholder="Explicá brevemente por qué resolvés a favor de una de las partes."
        multiline
        minRows={4}
        fullWidth
        error={Boolean(errors.justification)}
        helperText={
          errors.justification?.message ??
          `Máximo ${SESSION_CLAIM_JUSTIFICATION_MAX_LENGTH} caracteres. Evitá juicios de valor.`
        }
        disabled={mutation.isPending}
        sx={dialogFieldSx}
      />

      <AppButton type="submit" fullWidth loading={mutation.isPending}>
        Confirmar resolución
      </AppButton>

      <ConfirmResolutionDialog
        open={confirmOpen}
        isPending={mutation.isPending}
        onConfirm={() => void confirmResolution()}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
}
