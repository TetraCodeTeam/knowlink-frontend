import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  InputAdornment,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Plus, Trash2, Laptop, LibraryBig } from "lucide-react";
import { step2Schema, type Step2Data } from "@/modules/auth/schemas/tutor-register.schema";
import { useCareers } from "@/modules/tutors/hooks/use-careers";
import { useBasicSubjects } from "@/modules/tutors/hooks/use-basic-subjects";
import { useCareerSubjects } from "@/modules/tutors/hooks/use-career-subjects";
import AppButton from "@/shared/components/AppButton";

const inputSx = { "& .MuiOutlinedInput-root": { borderRadius: 2 } };

interface Step2Props {
  career: string;
  defaultValues: Partial<Step2Data>;
  onNext: (data: Step2Data) => void;
  onBack: () => void;
}

export default function Step2AcademicProfile({
  career,
  defaultValues,
  onNext,
  onBack,
}: Step2Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      biography: defaultValues.biography ?? "",
      subjects:
        defaultValues.subjects && defaultValues.subjects.length > 0
          ? defaultValues.subjects
          : [
              {
                subjectName: "",
                modality: "VIRTUAL",
                compensationType: "FREE",
                pricePerHour: null,
                isBasic: false,
              },
            ],
      address: defaultValues.address ?? "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "subjects" });
  const watchedSubjects = watch("subjects");

  const { data: careers } = useCareers();
  const selectedCareer = careers?.find((c) => c.name === career);

  const { data: basicSubjects, isLoading: basicLoading } = useBasicSubjects();
  const { data: careerSubjects, isLoading: careerLoading } = useCareerSubjects(
    selectedCareer?.careerId
  );

  const hasPresencial = watchedSubjects?.some(
    (s) => s.modality === "IN_PERSON" || s.modality === "BOTH"
  );
  const bioValue = watch("biography") ?? "";

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onNext)}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 2.5, width: "100%", maxWidth: 440 }}
    >
      <Typography variant="h4" component="h1" fontWeight={700} textAlign="center" mb={1}>
        Perfil académico
      </Typography>

      {/* Biografía */}
      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Biografía
        </Typography>
        <TextField
          placeholder="Contá un poco sobre tu trayecto académico..."
          fullWidth
          multiline
          rows={3}
          {...register("biography")}
          error={!!errors.biography}
          helperText={errors.biography?.message ?? `${bioValue.length}/300`}
          sx={inputSx}
        />
      </Box>

      {/* Materias */}
      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Materias que enseñás*
        </Typography>
        {typeof errors.subjects === "object" &&
          "message" in errors.subjects &&
          errors.subjects.message && (
            <Typography variant="caption" color="error" mb={1} display="block">
              {errors.subjects.message as string}
            </Typography>
          )}

        {fields.map((field, index) => {
          const subjectErrors = errors.subjects?.[index];
          const isGratuita = watchedSubjects?.[index]?.compensationType === "FREE";
          const isBasicWatched = watchedSubjects?.[index]?.isBasic;

          const subjectOptions = isBasicWatched ? basicSubjects : careerSubjects;
          const subjectsLoading = isBasicWatched ? basicLoading : careerLoading;

          return (
            <Box
              key={field.id}
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                p: 2,
                mb: 2,
                position: "relative",
              }}
            >
              {fields.length > 1 && (
                <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                  <AppButton
                    appVariant="soft-danger"
                    onClick={() => remove(index)}
                    type="button"
                    sx={{ minWidth: 0, px: 1, py: 0.5 }}
                  >
                    <Trash2 size={14} />
                  </AppButton>
                </Box>
              )}

              {/* Básica + Nombre de la materia */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                <FormControl fullWidth error={!!subjectErrors?.subjectName}>
                  <Controller
                    name={`subjects.${index}.subjectName`}
                    control={control}
                    render={({ field: f }) => (
                      <Select {...f} disabled={subjectsLoading} sx={{ borderRadius: 2 }}>
                        {subjectOptions?.map((s) => (
                          <MenuItem key={s.subjectId} value={s.name}>
                            {s.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {subjectErrors?.subjectName && (
                    <FormHelperText>{subjectErrors.subjectName.message}</FormHelperText>
                  )}
                </FormControl>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Básica
                  </Typography>
                  <Controller
                    name={`subjects.${index}.isBasic`}
                    control={control}
                    render={({ field: f }) => (
                      <Switch
                        checked={f.value}
                        onChange={(_, val) => {
                          f.onChange(val);

                          setValue(`subjects.${index}.subjectName`, "");
                        }}
                        size="small"
                        sx={{ "& .MuiSwitch-thumb": { bgcolor: "#4361ee" } }}
                      />
                    )}
                  />
                </Box>
              </Box>

              {/* Precio por hora */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 1.5,
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="body2" fontWeight={500} sx={{ minWidth: 100 }}>
                  Precio por hora*
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Gratis
                  </Typography>
                  <Controller
                    name={`subjects.${index}.compensationType`}
                    control={control}
                    render={({ field: f }) => (
                      <Switch
                        checked={f.value === "FREE"}
                        onChange={(_, val) => f.onChange(val ? "FREE" : "PAID")}
                        size="small"
                        sx={{ "& .MuiSwitch-thumb": { bgcolor: "#4361ee" } }}
                      />
                    )}
                  />
                </Box>
                {!isGratuita && (
                  <TextField
                    placeholder="Ej. 15000"
                    size="small"
                    type="number"
                    inputProps={{ min: 1, step: "0.01" }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    {...register(`subjects.${index}.pricePerHour`, { valueAsNumber: true })}
                    error={!!subjectErrors?.pricePerHour}
                    helperText={subjectErrors?.pricePerHour?.message}
                    sx={{ ...inputSx, width: 150 }}
                  />
                )}
              </Box>

              {/* Modalidad */}
              <Box>
                <Typography variant="body2" fontWeight={500} mb={0.5}>
                  Seleccioná una o ambas modalidades*
                </Typography>
                <Controller
                  name={`subjects.${index}.modality`}
                  control={control}
                  render={({ field: f }) => {
                    const isVirtualSelected = f.value === "VIRTUAL" || f.value === "BOTH";
                    const isInPersonSelected = f.value === "IN_PERSON" || f.value === "BOTH";

                    const combine = (virtual: boolean, inPerson: boolean) => {
                      if (virtual && inPerson) return "BOTH";
                      if (virtual) return "VIRTUAL";
                      if (inPerson) return "IN_PERSON";
                      return null; // no se permite dejar las dos sin marcar
                    };

                    const toggleVirtual = () => {
                      const next = combine(!isVirtualSelected, isInPersonSelected);
                      if (next) f.onChange(next);
                    };

                    const toggleInPerson = () => {
                      const next = combine(isVirtualSelected, !isInPersonSelected);
                      if (next) f.onChange(next);
                    };

                    return (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Chip
                          icon={<Laptop size={18} />}
                          label="Virtual"
                          onClick={toggleVirtual}
                          color={isVirtualSelected ? "primary" : "default"}
                          variant={isVirtualSelected ? "filled" : "outlined"}
                          sx={{
                            cursor: "pointer",
                            fontWeight: 500,
                            "& .MuiChip-icon": { color: isVirtualSelected ? "#fff" : undefined },
                          }}
                        />
                        <Chip
                          icon={<LibraryBig size={18} />}
                          label="Presencial"
                          onClick={toggleInPerson}
                          color={isInPersonSelected ? "primary" : "default"}
                          variant={isInPersonSelected ? "filled" : "outlined"}
                          sx={{
                            cursor: "pointer",
                            fontWeight: 500,
                            "& .MuiChip-icon": { color: isInPersonSelected ? "#fff" : undefined },
                          }}
                        />
                      </Box>
                    );
                  }}
                />
              </Box>
            </Box>
          );
        })}

        <AppButton
          appVariant="soft"
          fullWidth
          type="button"
          onClick={() =>
            append({
              subjectName: "",
              modality: "VIRTUAL",
              compensationType: "FREE",
              pricePerHour: null,
              isBasic: false,
            })
          }
          sx={{ mb: 0.5 }}
        >
          <Plus size={16} />
          &nbsp;Agregar otra materia
        </AppButton>
        <Typography variant="caption" color="text.secondary">
          Podrás gestionar y ampliar tus áreas de enseñanza en la sección de perfil.
        </Typography>
      </Box>

      {/* Dirección */}
      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Dirección para clases presenciales{hasPresencial ? "*" : ""}
        </Typography>
        <TextField
          placeholder="Biblioteca UTN"
          fullWidth
          size="medium"
          {...register("address")}
          error={!!errors.address}
          helperText={
            errors.address?.message ??
            "Podrás ingresar una dirección si seleccionas modalidad presencial"
          }
          disabled={!hasPresencial}
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
