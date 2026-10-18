import type React from "react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Camera } from "lucide-react";
import { step1Schema, type Step1Data } from "@/modules/auth/schemas/tutor-register.schema";
import AppButton from "@/shared/components/AppButton";
import { useInstituciones } from "@/modules/catalog/hooks/useInstituciones";
import { useCarrerasByInstitucion } from "@/modules/catalog/hooks/useCarrerasByInstitucion";
import { checkAvailability } from "@/modules/auth/api/auth.api";

const inputSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 2 },
};

interface Step1Props {
  defaultValues: Partial<Step1Data>;
  onNext: (data: Step1Data) => void;
  onBack: () => void;
}

export default function Step1Account({ defaultValues, onNext, onBack }: Step1Props) {
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    defaultValues.profilePictureUrl
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: institutions, isLoading: institutionsLoading } = useInstituciones();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      institutionId: "",
      careerId: "",
      ...defaultValues,
    },
  });

  const selectedInstitutionId = watch("institutionId");
  const { data: careers, isLoading: careersLoading } =
    useCarrerasByInstitucion(selectedInstitutionId);
  const careerOptions = careers?.filter((career) => career.type !== "COMPARTIDA");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const handleInstitutionChange = (onChange: (value: string) => void) => (value: string) => {
    onChange(value);
    setValue("careerId", "", { shouldValidate: false });
  };

  const handleAccountSubmit = async (data: Step1Data) => {
    try {
      await checkAvailability({ dni: data.dni });
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "No se pudo verificar la disponibilidad del DNI. Intentá nuevamente.";
      setError("dni", { type: "manual", message });
      return;
    }

    onNext(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleAccountSubmit)}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 2.5, width: "100%", maxWidth: 400 }}
    >
      <Typography variant="h4" component="h1" fontWeight={700} textAlign="center" mb={1}>
        Cuenta
      </Typography>

      {/* Foto de perfil */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={avatarPreview}
            sx={{ width: 72, height: 72, bgcolor: "#eef2ff", color: "#4361ee" }}
          >
            {!avatarPreview && <Camera size={28} />}
          </Avatar>
          <IconButton
            size="small"
            onClick={() => fileInputRef.current?.click()}
            sx={{
              position: "absolute",
              bottom: -4,
              right: -4,
              bgcolor: "#4361ee",
              color: "#fff",
              width: 24,
              height: 24,
              "&:hover": { bgcolor: "#3451d1" },
            }}
          >
            <Typography fontSize={14} fontWeight={700} lineHeight={1}>
              +
            </Typography>
          </IconButton>
        </Box>
        <Typography variant="caption" color="text.secondary" textAlign="center">
          Agregá una foto de perfil haciendo clic en +
        </Typography>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
      </Box>

      {/* Nombre */}
      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Nombre*
        </Typography>
        <TextField
          placeholder="Nombre"
          fullWidth
          size="medium"
          {...register("firstName")}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          sx={inputSx}
        />
      </Box>

      {/* Apellido */}
      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Apellido*
        </Typography>
        <TextField
          placeholder="Apellido"
          fullWidth
          size="medium"
          {...register("lastName")}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          sx={inputSx}
        />
      </Box>

      {/* Institución */}
      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Institución*
        </Typography>
        <FormControl fullWidth error={!!errors.institutionId}>
          <Controller
            name="institutionId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                disabled={institutionsLoading}
                displayEmpty
                sx={{ borderRadius: 2 }}
                onChange={(event) =>
                  handleInstitutionChange(field.onChange)(event.target.value as string)
                }
              >
                <MenuItem value="" disabled>
                  Seleccioná una institución
                </MenuItem>
                {institutions?.map((institution) => (
                  <MenuItem key={institution.institutionId} value={institution.institutionId}>
                    {institution.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.institutionId && <FormHelperText>{errors.institutionId.message}</FormHelperText>}
        </FormControl>
      </Box>

      {/* Carrera */}
      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Carrera*
        </Typography>
        <FormControl fullWidth error={!!errors.careerId}>
          <Controller
            name="careerId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                sx={{ borderRadius: 2 }}
                disabled={!selectedInstitutionId || careersLoading}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  {selectedInstitutionId ? "Seleccioná una carrera" : "Elegí tu institución primero"}
                </MenuItem>
                {careerOptions?.map((career) => (
                  <MenuItem key={career.careerId} value={career.careerId}>
                    {career.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.careerId ? (
            <FormHelperText>{errors.careerId.message}</FormHelperText>
          ) : !selectedInstitutionId ? (
            <FormHelperText>Elegí tu institución primero</FormHelperText>
          ) : null}
        </FormControl>
      </Box>

      {/* Teléfono */}
      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Teléfono celular*
        </Typography>
        <TextField
          placeholder="+54 9 3534138xxx"
          fullWidth
          size="medium"
          {...register("phoneNumber")}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber?.message}
          sx={inputSx}
        />
      </Box>

      {/* DNI */}
      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          DNI*
        </Typography>
        <TextField
          placeholder="43606xxx"
          fullWidth
          size="medium"
          {...register("dni")}
          error={!!errors.dni}
          helperText={errors.dni?.message}
          sx={inputSx}
        />
      </Box>

      {/* Legajo institucional (opcional) */}
      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Legajo institucional
        </Typography>
        <TextField
          placeholder=""
          fullWidth
          size="medium"
          {...register("institutionalId")}
          error={!!errors.institutionalId}
          helperText={errors.institutionalId?.message}
          sx={inputSx}
        />
      </Box>

      {/* Botones */}
      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
        <AppButton appVariant="outline" fullWidth onClick={onBack} type="button">
          ← Volver
        </AppButton>
        <AppButton appVariant="primary" fullWidth type="submit">
          → Continuar
        </AppButton>
      </Box>
    </Box>
  );
}