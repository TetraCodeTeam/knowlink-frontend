import { useEffect, useMemo, type ReactNode } from "react";
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
import { checkAvailability } from "@/modules/auth/api/auth.api";
import { useCareers } from "@/modules/tutors/hooks/useCareers";
import AppButton from "@/shared/components/AppButton";

const inputSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: 14 },
  "& .MuiOutlinedInput-input:not(textarea)": { py: 0.8 },
  "& .MuiFormHelperText-root": { fontSize: 11.5, mx: 0.25 },
};

interface FieldProps {
  label: string;
  children: ReactNode;
}

const Field = ({ label, children }: FieldProps) => (
  <Box>
    <Typography component="label" fontSize={13} fontWeight={500} sx={{ display: "block", mb: 0.5 }}>
      {label}
    </Typography>
    {children}
  </Box>
);

interface EditProfileFormProps {
  variant: "student" | "tutor";
  email: string;
  institutionId: string;
  institutionName: string;
  defaultValues: EditProfileFormValues;
  requiresAddress?: boolean;
  isPending: boolean;
  onSubmit: (
    values: EditProfileFormValues,
    setFieldError: UseFormSetError<EditProfileFormValues>
  ) => void;
}

export default function EditProfileForm({
  variant,
  email,
  institutionId,
  institutionName,
  defaultValues,
  requiresAddress = false,
  isPending,
  onSubmit,
}: EditProfileFormProps) {
  const schema = useMemo(() => createEditProfileSchema(requiresAddress), [requiresAddress]);

  const {
    register,
    handleSubmit,
    control,
    setError,
    trigger,
    watch,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "all",
  });

  const { data: careers } = useCareers(institutionId);
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

  const handleProfileSubmit = async (values: EditProfileFormValues) => {
    // Igual que en el registro, el DNI se verifica antes de guardar. Si no cambió se omite:
    // el endpoint de disponibilidad lo marcaría como ocupado por el propio usuario.
    if (values.dni.trim() !== defaultValues.dni) {
      try {
        await checkAvailability({ dni: values.dni.trim() });
      } catch (error: unknown) {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "No se pudo verificar la disponibilidad del DNI. Intentá nuevamente.";
        setError("dni", { type: "manual", message });
        return;
      }
    }

    onSubmit(values, setError);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleProfileSubmit)}
      noValidate
      sx={{ display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.4 }}>
        <Field label="Nombre*">
          <TextField
            placeholder="Nombre"
            fullWidth
            size="small"
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            sx={inputSx}
          />
        </Field>

        <Field label="Apellido*">
          <TextField
            placeholder="Apellido"
            fullWidth
            size="small"
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            sx={inputSx}
          />
        </Field>

        <Field label="Correo electrónico">
          <TextField
            fullWidth
            size="small"
            type="email"
            value={email}
            disabled
            helperText="El correo electrónico no puede modificarse."
            slotProps={{ htmlInput: { "data-testid": "email-field" } }}
            sx={inputSx}
          />
        </Field>

        <Field label="Institución">
          <TextField
            fullWidth
            size="small"
            value={institutionName}
            disabled
            helperText="La institución no puede modificarse."
            slotProps={{ htmlInput: { "data-testid": "institution-field" } }}
            sx={inputSx}
          />
        </Field>

        <Field label="Carrera*">
          <FormControl fullWidth size="small" error={!!errors.career}>
            <Controller
              name="career"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  sx={{ borderRadius: 2, fontSize: 14, "& .MuiSelect-select": { py: 0.8 } }}
                >
                  {careerOptions.map((career) => (
                    <MenuItem key={career.careerId} value={career.name} sx={{ fontSize: 14 }}>
                      {career.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.career && <FormHelperText>{errors.career.message}</FormHelperText>}
          </FormControl>
        </Field>

        <Field label="Teléfono celular*">
          <TextField
            placeholder="Teléfono celular"
            fullWidth
            size="small"
            {...register("phoneNumber")}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
            sx={inputSx}
          />
        </Field>

        <Field label="DNI*">
          <TextField
            placeholder="DNI"
            fullWidth
            size="small"
            {...register("dni")}
            error={!!errors.dni}
            helperText={errors.dni?.message}
            sx={inputSx}
          />
        </Field>

        <Field label="Legajo institucional">
          <TextField
            placeholder="Legajo institucional"
            fullWidth
            size="small"
            {...register("institutionalId")}
            error={!!errors.institutionalId}
            helperText={errors.institutionalId?.message}
            sx={inputSx}
          />
        </Field>

        {variant === "tutor" && (
          <>
            <Field
              label={
                requiresAddress
                  ? "Dirección para clases presenciales*"
                  : "Dirección para clases presenciales"
              }
            >
              <TextField
                placeholder="Dirección para clases presenciales"
                fullWidth
                size="small"
                {...register("address")}
                error={!!errors.address}
                helperText={errors.address?.message}
                sx={inputSx}
              />
            </Field>

            <Field label="Biografía">
              <TextField
                placeholder="Biografía"
                fullWidth
                size="small"
                multiline
                minRows={3}
                {...register("biography")}
                error={!!errors.biography}
                helperText={errors.biography?.message ?? `${biography.length}/300`}
                sx={inputSx}
              />
            </Field>
          </>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", pt: 2.5 }}>
        <AppButton
          appVariant="primary"
          type="submit"
          disabled={!isValid || !isDirty}
          loading={isPending || isSubmitting}
          sx={{ px: 7, py: 0.8, fontSize: 15 }}
        >
          Guardar
        </AppButton>
      </Box>
    </Box>
  );
}
