import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import type { UseFormSetError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  createEditProfileSchema,
  type EditProfileFormValues,
} from "@/modules/users/schemas/editProfile.schema";
import { useCareers } from "@/modules/tutors/hooks/useCareers";
import AppButton from "@/shared/components/AppButton";

const inputSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 2 },
};

interface EditProfileFormProps {
  variant: "student" | "tutor";
  email: string;
  defaultValues: EditProfileFormValues;
  requiresAddress?: boolean;
  isPending: boolean;
  onSubmit: (
    values: EditProfileFormValues,
    setFieldError: UseFormSetError<EditProfileFormValues>
  ) => void;
  onCancel: () => void;
}

export default function EditProfileForm({
  variant,
  email,
  defaultValues,
  requiresAddress = false,
  isPending,
  onSubmit,
  onCancel,
}: EditProfileFormProps) {
  const schema = useMemo(() => createEditProfileSchema(requiresAddress), [requiresAddress]);

  const {
    register,
    handleSubmit,
    control,
    setError,
    trigger,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "all",
  });

  const { data: careers } = useCareers();
  const currentCareer = defaultValues.career;

  const careerOptions = useMemo(() => {
    const options = careers ?? [];
    if (!currentCareer || options.some((career) => career.name === currentCareer)) {
      return options;
    }
    return [...options, { careerId: "current-career", name: currentCareer }];
  }, [careers, currentCareer]);

  useEffect(() => {
    void trigger();
  }, [trigger]);

  const biography = watch("biography") ?? "";

  return (
    <Box
      component="form"
      onSubmit={handleSubmit((values) => onSubmit(values, setError))}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 2.5, maxWidth: 560 }}
    >
      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Nombre*
        </Typography>
        <TextField
          placeholder="Nombre"
          fullWidth
          {...register("firstName")}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          sx={inputSx}
        />
      </Box>

      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Apellido*
        </Typography>
        <TextField
          placeholder="Apellido"
          fullWidth
          {...register("lastName")}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          sx={inputSx}
        />
      </Box>

      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Correo electrónico
        </Typography>
        <TextField
          fullWidth
          type="email"
          value={email}
          disabled
          helperText="El correo electrónico no puede modificarse."
          slotProps={{ htmlInput: { "data-testid": "email-field" } }}
          sx={inputSx}
        />
      </Box>

      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Teléfono celular*
        </Typography>
        <TextField
          placeholder="Teléfono celular"
          fullWidth
          {...register("phoneNumber")}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber?.message}
          sx={inputSx}
        />
      </Box>

      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          DNI*
        </Typography>
        <TextField
          placeholder="DNI"
          fullWidth
          {...register("dni")}
          error={!!errors.dni}
          helperText={errors.dni?.message}
          sx={inputSx}
        />
      </Box>

      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Carrera*
        </Typography>
        <FormControl fullWidth error={!!errors.career}>
          <Controller
            name="career"
            control={control}
            render={({ field }) => (
              <Select {...field} sx={{ borderRadius: 2 }}>
                {careerOptions.map((career) => (
                  <MenuItem key={career.careerId} value={career.name}>
                    {career.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.career && <FormHelperText>{errors.career.message}</FormHelperText>}
        </FormControl>
      </Box>

      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Legajo institucional
        </Typography>
        <TextField
          placeholder="Legajo institucional"
          fullWidth
          {...register("institutionalId")}
          error={!!errors.institutionalId}
          helperText={errors.institutionalId?.message}
          sx={inputSx}
        />
      </Box>

      {variant === "tutor" && (
        <>
          <Box>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              {requiresAddress
                ? "Dirección para clases presenciales*"
                : "Dirección para clases presenciales"}
            </Typography>
            <TextField
              placeholder="Dirección para clases presenciales"
              fullWidth
              {...register("address")}
              error={!!errors.address}
              helperText={errors.address?.message}
              sx={inputSx}
            />
          </Box>

          <Box>
            <Typography variant="body2" fontWeight={500} mb={0.5}>
              Biografía
            </Typography>
            <TextField
              placeholder="Biografía"
              fullWidth
              multiline
              minRows={3}
              {...register("biography")}
              error={!!errors.biography}
              helperText={errors.biography?.message ?? `${biography.length}/300`}
              sx={inputSx}
            />
          </Box>
        </>
      )}

      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
        <AppButton appVariant="outline" type="button" onClick={onCancel} disabled={isPending}>
          Cancelar
        </AppButton>
        <AppButton
          appVariant="primary"
          type="submit"
          disabled={!isValid || !isDirty}
          loading={isPending}
        >
          Guardar cambios
        </AppButton>
      </Box>
    </Box>
  );
}
