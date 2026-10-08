import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogActions, DialogContent, Box, Typography, TextField } from "@mui/material";
import { Flag, Info } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import ReportReasonCard from "@/modules/student/tutorProfile/components/ReportReasonCard";
import {
  reportIconWrapperSx,
  reportInfoBoxSx,
} from "@/modules/student/tutorProfile/styles/reportMaterialStyles";
import {
  REPORT_REASON_OPTIONS,
  MAX_OTHER_REASON_LENGTH,
  MAX_REPORT_COMMENT_LENGTH,
} from "@/modules/student/tutorProfile/constants/reportMaterial.constants";
import {
  reportMaterialSchema,
  type ReportMaterialFormValues,
} from "@/modules/student/tutorProfile/schemas/reportMaterial.schema";

interface ReportMaterialDialogProps {
  open: boolean;
  materialTitle: string;
  isPending: boolean;
  onConfirm: (values: ReportMaterialFormValues) => void;
  onCancel: () => void;
}

const DEFAULT_VALUES: ReportMaterialFormValues = { reason: "", otherReasonText: "", comment: "" };

export default function ReportMaterialDialog({
  open,
  materialTitle,
  isPending,
  onConfirm,
  onCancel,
}: ReportMaterialDialogProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ReportMaterialFormValues>({
    resolver: zodResolver(reportMaterialSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) reset(DEFAULT_VALUES);
  }, [open, reset]);

  const reason = watch("reason");

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, textAlign: "center", pt: 1 } }}
    >
      <Box component="form" onSubmit={handleSubmit(onConfirm)}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 2, px: 4 }}
        >
          <Box sx={reportIconWrapperSx("#FBE2E2")}>
            <Flag size={32} color="#C62828" />
          </Box>

          <Typography variant="h6" fontWeight={700} mb={0.5}>
            Denunciar Material
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={2}>
            {materialTitle}
          </Typography>

          <Box sx={reportInfoBoxSx}>
            <Info size={24} color="#FF7700" style={{ flexShrink: 0 }} />
            <Typography sx={{ fontSize: "0.8rem", color: "#7A3E00", fontWeight: 500 }}>
              Podrás hacer el seguimiento en la sección &quot;Rec. y Solicitudes&quot;.
            </Typography>
          </Box>

          <Box sx={{ width: "100%", textAlign: "left" }}>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: "#333", mb: "10px" }}>
              ¿Por qué estás denunciando este material?*
            </Typography>

            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <Box role="radiogroup" sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {REPORT_REASON_OPTIONS.map((option) => (
                    <Box key={option.value}>
                      <ReportReasonCard
                        label={option.label}
                        selected={field.value === option.value}
                        onSelect={() => field.onChange(option.value)}
                      />
                      {option.value === "OTHER" && field.value === "OTHER" && (
                        <TextField
                          fullWidth
                          autoFocus
                          size="small"
                          disabled={isPending}
                          placeholder="Especificá el motivo de tu denuncia*"
                          error={!!errors.otherReasonText}
                          helperText={errors.otherReasonText?.message}
                          slotProps={{ htmlInput: { maxLength: MAX_OTHER_REASON_LENGTH } }}
                          sx={{ mt: "8px" }}
                          {...register("otherReasonText")}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            />

            {errors.reason && (
              <Typography sx={{ fontSize: "0.8rem", color: "#b91c1c", mt: "6px" }}>
                {errors.reason.message}
              </Typography>
            )}
          </Box>

          <Box sx={{ width: "100%", textAlign: "left", mt: "16px" }}>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 500, color: "#333", mb: "8px" }}>
              Comentario (opcional)
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              disabled={isPending}
              placeholder="Detallá lo que pasó lo más posible, esto ayuda a resolver el caso sin necesidad de citarte..."
              error={!!errors.comment}
              helperText={errors.comment?.message}
              slotProps={{ htmlInput: { maxLength: MAX_REPORT_COMMENT_LENGTH } }}
              {...register("comment")}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 1.5, px: 4, pb: 3 }}>
          <AppButton appVariant="outline" onClick={onCancel} disabled={isPending} fullWidth>
            Cancelar
          </AppButton>
          <AppButton
            type="submit"
            appVariant="primary"
            loading={isPending}
            disabled={reason === ""}
            fullWidth
          >
            Enviar
          </AppButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
