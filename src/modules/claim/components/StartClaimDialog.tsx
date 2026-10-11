import { useEffect, useId, type ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Paperclip, Users } from "lucide-react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Radio,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AppButton from "@/shared/components/AppButton";
import {
  CLAIM_REASON_LABEL,
} from "@/modules/claim/constants/claimReasonsConstants";
import {
  CLAIM_COMMENT_MAX_LENGTH,
  startClaimSchema,
  type StartClaimFormData,
} from "@/modules/claim/hooks/startClaimSchema";
import type { Role } from "@/shared/types/role.type";
import type { ClaimReason } from "@/modules/claim/interfaces/claimReasonType";

interface StartClaimDialogProps {
  open: boolean;
  /** Quién inicia el reclamo: define cómo se leen las opciones de motivo. */
  claimantRole: Role;
  allowedReasons: ClaimReason[];
  /** Ya formateado por el caller, ej. "Física 1 con María Luz Juárez · Lunes 15/6". */
  sessionSummary: string;
  isPending: boolean;
  onSubmit: (data: StartClaimFormData) => void | Promise<void>;
  onCancel: () => void;
}

const COLORS = {
  brand: "#5865C8",
  brandSoft: "#EDEBFC",
  surface: "#F8F8FD",
  surfaceSelected: "#E4E3FB",
  border: "#E0E0FA",
  borderSelected: "#8F94E6",
} as const;

const ATTACHMENT_ACCEPT = "image/*,application/pdf";

/** Oculta el input visualmente pero lo deja enfocable con teclado. */
const visuallyHiddenInputSx = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
  p: 0,
} as const;

export default function StartClaimDialog({
  open,
  claimantRole,
  allowedReasons,
  sessionSummary,
  isPending,
  onSubmit,
  onCancel,
}: StartClaimDialogProps) {
  const titleId = useId();
  const reasonLabelId = useId();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<StartClaimFormData>({
    resolver: zodResolver(startClaimSchema),
    mode: "onChange",
    defaultValues: { reason: undefined, comment: "", attachment: undefined },
  });

  // Cada apertura arranca con el formulario limpio.
  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const comment = watch("comment") ?? "";
  const attachment = watch("attachment");

  const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setValue("attachment", file, { shouldValidate: true });
    // Permite volver a elegir el mismo archivo después de quitarlo.
    event.target.value = "";
  };

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      aria-labelledby={titleId}
      slotProps={{ paper: { sx: { borderRadius: 4 } } }}
    >
      <DialogContent sx={{ px: 4, pt: 4, pb: 1 }}>
        <Stack alignItems="center" textAlign="center" spacing={1} sx={{ mb: 2.5 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: COLORS.brandSoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <Users size={30} color={COLORS.brand} />
          </Box>
          <Typography id={titleId} variant="h6" component="h2" fontWeight={600}>
            Iniciar reclamo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {sessionSummary}
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 1,
            mb: 3,
            borderRadius: 2,
            bgcolor: "#F4F3FB",
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <Lock size={16} color={COLORS.brand} style={{ flexShrink: 0 }} />
          <Typography variant="caption" color="text.secondary">
            Los fondos de la clase quedan retenidos hasta su resolución.
          </Typography>
        </Box>

        <Typography id={reasonLabelId} variant="subtitle2" fontWeight={600} mb={1.25}>
          ¿Qué sucedió en la clase?
          <Typography component="span" color="error" aria-hidden>
            {" "}
            *
          </Typography>
        </Typography>

        <Controller
          name="reason"
          control={control}
          render={({ field }) => (
            <Stack role="radiogroup" aria-labelledby={reasonLabelId} aria-required spacing={1.25}>
              {allowedReasons.map((reason) => {
                const selected = field.value === reason;
                return (
                  <FormControlLabel
                    key={reason}
                    disabled={isPending}
                    control={
                      <Radio
                        size="small"
                        name={field.name}
                        checked={selected}
                        onChange={() => field.onChange(reason)}
                        onBlur={field.onBlur}
                        sx={{ "&.Mui-checked": { color: COLORS.brand } }}
                      />
                    }
                    label={
                      <Typography variant="subtitle1" fontWeight={600}>
                        {CLAIM_REASON_LABEL[claimantRole][reason]}
                      </Typography>
                    }
                    sx={{
                      m: 0,
                      width: "100%",
                      px: 1.5,
                      py: 1,
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: selected ? COLORS.borderSelected : COLORS.border,
                      bgcolor: selected ? COLORS.surfaceSelected : COLORS.surface,
                      transition: "background-color 0.2s ease, border-color 0.2s ease",
                      "&:has(:focus-visible)": {
                        outline: `2px solid ${COLORS.brand}`,
                        outlineOffset: 2,
                      },
                    }}
                  />
                );
              })}
            </Stack>
          )}
        />

        <Stack
          direction="row"
          alignItems="baseline"
          justifyContent="space-between"
          sx={{ mt: 3, mb: 1 }}
        >
          <Typography variant="subtitle2" fontWeight={600} component="label" htmlFor="claim-comment">
            Comentario adicional{" "}
            <Typography component="span" variant="caption" color="text.secondary">
              (opcional)
            </Typography>
          </Typography>
          <Typography variant="caption" color="text.secondary" aria-live="polite">
            {comment.length} / {CLAIM_COMMENT_MAX_LENGTH}
          </Typography>
        </Stack>

        <TextField
          {...register("comment")}
          id="claim-comment"
          multiline
          minRows={3}
          fullWidth
          disabled={isPending}
          placeholder="Explicá brevemente lo ocurrido…"
          slotProps={{ htmlInput: { maxLength: CLAIM_COMMENT_MAX_LENGTH } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              bgcolor: COLORS.surface,
              "& fieldset": { borderColor: COLORS.border },
            },
          }}
        />

        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1} sx={{ mt: 1.5 }}>
          <Button
            component="label"
            tabIndex={-1}
            size="small"
            variant="outlined"
            disabled={isPending}
            startIcon={<Paperclip size={14} />}
            sx={{
              textTransform: "none",
              borderRadius: 5,
              fontSize: 12,
              color: "#494949",
              borderColor: COLORS.border,
              bgcolor: COLORS.surface,
              "&:focus-within": { outline: `2px solid ${COLORS.brand}`, outlineOffset: 2 },
            }}
          >
            Adjuntar comprobante o captura
            <Box
              component="input"
              type="file"
              accept={ATTACHMENT_ACCEPT}
              onChange={handleAttachmentChange}
              sx={visuallyHiddenInputSx}
            />
          </Button>

          {attachment && (
            <Chip
              size="small"
              label={attachment.name}
              onDelete={() => setValue("attachment", undefined, { shouldValidate: true })}
              disabled={isPending}
              sx={{ maxWidth: 220 }}
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 1.5, px: 4, pt: 2, pb: 3 }}>
        <AppButton appVariant="outline" onClick={onCancel} disabled={isPending} fullWidth>
          Cancelar
        </AppButton>
        <AppButton
          appVariant="primary"
          onClick={handleSubmit(onSubmit)}
          loading={isPending}
          disabled={!isValid}
          fullWidth
        >
          Enviar
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}