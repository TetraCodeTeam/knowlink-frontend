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
import { studentAccountSchema, type StudentAccountData } from "@/modules/auth/schemas/user-register.schema";
import { useCareers } from "@/modules/tutors/hooks/useCareers";
import AppButton from "@/shared/components/AppButton";
import { checkAvailability } from "@/modules/auth/api/auth.api";

const inputSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 2 },
};

interface StudentAccountFormProps {
  onSubmit: (data: StudentAccountData) => void;
  onBack: () => void;
  isPending: boolean;
}

export default function StudentAccountForm({ onSubmit, onBack, isPending }: StudentAccountFormProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<StudentAccountData>({
    resolver: zodResolver(studentAccountSchema),
  });

  const { data: careers, isLoading: careersLoading } = useCareers();

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

  const handleAccountSubmit = async (data: StudentAccountData) => {
    try {
      await checkAvailability({ dni: data.dni });
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string; detail?: string } } })?.response?.data
          ?.message ?? "Este DNI ya está registrado.";
      setError("dni", { type: "manual", message });
      return;
    }

    onSubmit(data);
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

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <Box sx={{ position: "relative" }}>
          <Avatar src={avatarPreview} sx={{ width: 72, height: 72, bgcolor: "#eef2ff", color: "#5B6ED9" }}>
            {!avatarPreview && <Camera size={28} />}
          </Avatar>
          <IconButton
            size="small"
            onClick={() => fileInputRef.current?.click()}
            sx={{
              position: "absolute",
              bottom: -4,
              right: -4,
              bgcolor: "#5B6ED9",
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
          Carrera*
        </Typography>
        <FormControl fullWidth error={!!errors.career}>
          <Controller
            name="career"
            control={control}
            render={({ field }) => (
              <Select {...field} disabled={careersLoading} sx={{ borderRadius: 2 }}>
                {careers?.map((c) => (
                  <MenuItem key={c.careerId} value={c.name}>
                    {c.name}
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
          Teléfono celular*
        </Typography>
        <TextField
          placeholder="+54 9 3534138xxx"
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
          placeholder="43606xxx"
          fullWidth
          {...register("dni")}
          error={!!errors.dni}
          helperText={errors.dni?.message}
          sx={inputSx}
        />
      </Box>

      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Legajo institucional
        </Typography>
        <TextField fullWidth {...register("institutionalId")} sx={inputSx} />
      </Box>

      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
        <AppButton appVariant="outline" fullWidth onClick={onBack} type="button" disabled={isPending}>
          ← Volver
        </AppButton>
        <AppButton appVariant="primary" fullWidth type="submit" loading={isPending}>
          → Finalizar registro
        </AppButton>
      </Box>
    </Box>
  );
}