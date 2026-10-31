import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { TutorOwnSubject } from "@/modules/tutor/profile/interfaces/tutor-own-profile.interface";
import ModalityChip from "@/modules/tutor/profile/components/ModalityChip";
import {
  editSubjectSchema,
  type EditSubjectFormValues,
} from "@/modules/tutor/schemas/editSubject.schema";
import {
  toEditSubjectFormValues,
  toUpdateTutorSubjectRequest,
} from "@/modules/tutor/utils/editSubject.utils";
import { useUpdateTutorSubject } from "@/modules/tutor/hooks/useUpdateTutorSubject";
import AppButton from "@/shared/components/AppButton";

interface EditSubjectModalProps {
  subject: TutorOwnSubject;
  onClose: () => void;
}

export default function EditSubjectModal({ subject, onClose }: EditSubjectModalProps) {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<EditSubjectFormValues>({
    resolver: zodResolver(editSubjectSchema),
    mode: "onChange",
    defaultValues: toEditSubjectFormValues(subject),
  });

  const [isFree, virtualSelected, inPersonSelected] = watch([
    "isFree",
    "virtualSelected",
    "inPersonSelected",
  ]);

  const { mutate, isPending } = useUpdateTutorSubject();

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleFreeChange = (checked: boolean) => {
    setValue("isFree", checked, { shouldDirty: true });
    void trigger();
  };

  const handleVirtualToggle = () => {
    setValue("virtualSelected", !virtualSelected, { shouldDirty: true });
    void trigger();
  };

  const handleInPersonToggle = () => {
    setValue("inPersonSelected", !inPersonSelected, { shouldDirty: true });
    void trigger();
  };

  const onSubmit = handleSubmit((values) => {
    mutate(
      {
        tutorSubjectId: subject.tutorSubjectId,
        request: toUpdateTutorSubjectRequest(values),
      },
      { onSuccess: onClose }
    );
  });

  const hasModalityError = !!errors.virtualSelected;

  return (
    <Dialog open onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
          fontSize: 24,
        }}
      >
        Editar materia
        <IconButton onClick={handleClose} aria-label="Cerrar">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={3}>
          <TextField
            label="Materia"
            value={subject.subjectName}
            disabled
            fullWidth
            helperText="El nombre de la materia no se puede modificar."
          />

          <Box>
            <Typography mb={1} fontWeight={500}>
              Precio por hora
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <FormControlLabel
                control={
                  <Switch
                    checked={isFree}
                    onChange={(event) => handleFreeChange(event.target.checked)}
                  />
                }
                label="Gratis"
              />

              <TextField
                type="number"
                disabled={isFree}
                error={!!errors.pricePerHour}
                helperText={errors.pricePerHour?.message}
                inputProps={{ min: 0, step: "0.01", "aria-label": "Precio por hora" }}
                sx={{ width: 160 }}
                {...register("pricePerHour")}
              />
            </Stack>
          </Box>

          <Box>
            <Typography mb={1} fontWeight={500}>
              Seleccioná una o ambas modalidades
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                border: hasModalityError ? "1px solid" : "1px solid transparent",
                borderColor: hasModalityError ? "error.main" : "transparent",
                borderRadius: 3,
                p: hasModalityError ? 1 : 0,
              }}
            >
              <ModalityChip
                modality="VIRTUAL"
                selected={virtualSelected}
                onClick={handleVirtualToggle}
              />

              <ModalityChip
                modality="IN_PERSON"
                selected={inPersonSelected}
                onClick={handleInPersonToggle}
              />
            </Box>

            {errors.virtualSelected && (
              <Typography color="error" fontSize={14} mt={1}>
                {errors.virtualSelected.message}
              </Typography>
            )}
          </Box>

          <Typography color="text.secondary" fontSize={14}>
            Los cambios no afectan las reservas ya confirmadas: se mantienen con las condiciones
            anteriores.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <AppButton appVariant="outline" onClick={handleClose} disabled={isPending} sx={{ px: 7 }}>
          Cancelar
        </AppButton>

        <AppButton
          appVariant="primary"
          onClick={onSubmit}
          loading={isPending}
          disabled={!isValid || isPending}
          sx={{ flex: 1, ml: 2 }}
        >
          Guardar cambios
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
