import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Box, TextField, Typography } from "@mui/material";
import { toast } from "sonner";
import { materiaSchema, type MateriaFormData } from "@/modules/catalog/schemas/materia.schema";
import { useCarrerasByInstitucion } from "@/modules/catalog/hooks/useCarrerasByInstitucion";
import { useCreateSubject } from "@/modules/catalog/hooks/useCreateSubject";
import DuplicatedSubjectAlert from "@/modules/catalog/components/DuplicatedSubjectAlert";
import CareerMultiSelect from "@/modules/catalog/components/CareerMultiSelect";
import AppButton from "@/shared/components/AppButton";
import { getErrorMessage } from "@/shared/utils/errors";
import type { CatalogSectionProps } from "@/modules/catalog/components/interfaces/catalog-components.interface";
import type { SubjectDuplicatedErrorResponse } from "@/modules/catalog/interfaces/responses/subject-duplicated-error.interface";

interface DuplicatedSubjectState {
  message: string;
  subjectId: string;
  subjectName: string;
}

export default function SubjectCreateForm({ institutionId }: CatalogSectionProps) {
  const navigate = useNavigate();
  const { data: careers } = useCarrerasByInstitucion(institutionId);
  const { createSubject, isPending } = useCreateSubject(institutionId);
  const [duplicated, setDuplicated] = useState<DuplicatedSubjectState | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MateriaFormData>({
    resolver: zodResolver(materiaSchema),
    defaultValues: {
      name: "",
      careerIds: [],
    },
  });

  const handleEditAssociations = () => {
    if (!duplicated) return;
    navigate(
      `/admin/catalogo/materias/${duplicated.subjectId}/asociaciones?institucion=${institutionId}`
    );
  };

  const handleCreate = async (data: MateriaFormData) => {
    setDuplicated(null);
    try {
      await createSubject(data);
      toast.success("Materia creada correctamente");
      reset({ name: "", careerIds: [] });
    } catch (error: unknown) {
      if (
        axios.isAxiosError<SubjectDuplicatedErrorResponse>(error) &&
        error.response?.status === 409 &&
        error.response.data?.materiaExistenteId
      ) {
        setDuplicated({
          message: error.response.data.message,
          subjectId: error.response.data.materiaExistenteId,
          subjectName: data.name,
        });
        return;
      }
      toast.error(getErrorMessage(error, "No se pudo crear la materia. Intentá de nuevo."));
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleCreate)}
      noValidate
      sx={{
        border: "1px solid #e2e8f0",
        borderRadius: 3,
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="subtitle2" fontWeight={700}>
        Alta de materia
      </Typography>

      {duplicated && (
        <DuplicatedSubjectAlert
          message={duplicated.message}
          subjectName={duplicated.subjectName}
          onEditAssociations={handleEditAssociations}
          onClose={() => setDuplicated(null)}
        />
      )}

      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Nombre de la materia*
        </Typography>
        <TextField
          placeholder="Ej. Análisis Matemático I"
          fullWidth
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />
      </Box>

      <Box>
        <Typography variant="body2" fontWeight={500} mb={0.5}>
          Carreras asociadas*
        </Typography>
        <Controller
          name="careerIds"
          control={control}
          render={({ field, fieldState }) => (
            <CareerMultiSelect
              careers={careers}
              value={field.value}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Box>

      <AppButton appVariant="primary" fullWidth type="submit" loading={isPending}>
        Crear materia
      </AppButton>
    </Box>
  );
}