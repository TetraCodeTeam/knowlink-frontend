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
import { useInstitutions } from "@/modules/tutors/hooks/useInstitutions";
import { useCareers } from "@/modules/tutors/hooks/useCareers";
import FrankieEmptyState from "@/shared/frankie/FrankieEmptyState";
import FrankieErrorState from "@/shared/frankie/FrankieErrorState";
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

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    resetField,
    control,
    watch,
    formState: { errors },
    setError,
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues,
  });

  const {
    data: institutions,
    isLoading: institutionsLoading,
    isError: institutionsError,
    refetch: refetchInstitutions,
  } = useInstitutions();

  const institutionId = watch("institutionId");
  const { data: careers, isLoading: careersLoading } = useCareers(institutionId);

  const hasInstitutions = !!institutions?.length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    setValue("profilePictureUrl", url);
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
            render={({ field: f }) => (
              <Select
                {...f}
                value={f.value ?? ""}
                displayEmpty
                disabled={institutionsLoading || !hasInstitutions}
                onChange={(event) => {
                  f.onChange(event);
                  resetField("career", { defaultValue: "" });
                  clearErrors("career");
                }}
                renderValue={(selected) =>
                  selected
                    ? (institutions?.find((i) => i.institutionId === selected)?.name ?? "")
                    : "Elegí tu institución"
                }
                sx={{ borderRadius: 2 }}
              >
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
        {institutionsError && (
          <FrankieErrorState
            compact
            message="No pudimos cargar las instituciones. Sin este dato no podés continuar."
            onRetry={() => void refetchInstitutions()}
          />
        )}
        {!institutionsLoading && !institutionsError && institutions?.length === 0 && (
          <FrankieEmptyState
            compact
            message="Todavía no hay instituciones disponibles para registrarte."
          />
        )}
      </Box>

      {/* Carrera */}
      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Carrera*
        </Typography>
        <FormControl fullWidth error={!!errors.career}>
          <Controller
            name="career"
            control={control}
            render={({ field: f }) => (
              <Select
                {...f}
                value={f.value ?? ""}
                displayEmpty
                disabled={!institutionId || careersLoading}
                renderValue={(selected) => selected || "Elegí tu carrera"}
                sx={{ borderRadius: 2 }}
              >
                {careers?.map((c) => (
                  <MenuItem key={c.careerId} value={c.name}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.career ? (
            <FormHelperText>{errors.career.message}</FormHelperText>
          ) : !institutionId ? (
            <FormHelperText>Elegí tu institución primero</FormHelperText>
          ) : null}
        </FormControl>
        {institutionId && !careersLoading && careers?.length === 0 && (
          <FrankieEmptyState
            compact
            message="Esta institución todavía no tiene carreras cargadas."
          />
        )}
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
