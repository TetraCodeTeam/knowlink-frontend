import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  asociacionesSchema,
  type AsociacionesFormData,
} from "@/modules/catalog/schemas/materia.schema";
import { useMateriasByInstitucion } from "@/modules/catalog/hooks/useMateriasByInstitucion";
import { useCarrerasByInstitucion } from "@/modules/catalog/hooks/useCarrerasByInstitucion";
import { useUpdateSubjectCareers } from "@/modules/catalog/hooks/useUpdateSubjectCareers";
import CareerMultiSelect from "@/modules/catalog/components/CareerMultiSelect";
import AppButton from "@/shared/components/AppButton";
import type { SubjectAssociationsFormProps } from "@/modules/catalog/components/interfaces/catalog-components.interface";
import { getErrorMessage } from "@/shared/utils/errors";

export default function SubjectAssociationsPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [searchParams] = useSearchParams();
  const institutionId = searchParams.get("institucion") ?? "";
  const navigate = useNavigate();

  const { data: subjects, isLoading } = useMateriasByInstitucion(institutionId);
  const { data: careers } = useCarrerasByInstitucion(institutionId);
  const { updateSubjectCareers, isPending } = useUpdateSubjectCareers();

  const subject = subjects?.find((item) => item.subjectId === subjectId);

  if (!institutionId) {
    return (
      <Box sx={{ maxWidth: 720, width: "100%" }}>
        <Typography color="error">
          No se pudo identificar la institución. Volvé al catálogo y probá de nuevo.
        </Typography>
        <AppButton appVariant="outline" type="button" onClick={() => navigate("/admin/catalogo")}>
          ← Volver al catálogo
        </AppButton>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress sx={{ color: "#5B6ED9" }} />
      </Box>
    );
  }

  if (!subject) {
    return (
      <Box sx={{ maxWidth: 720, width: "100%" }}>
        <Typography color="error">No se encontró la materia solicitada.</Typography>
        <AppButton appVariant="outline" type="button" onClick={() => navigate("/admin/catalogo")}>
          ← Volver al catálogo
        </AppButton>
      </Box>
    );
  }

  return (
    <SubjectAssociationsForm
      subjectName={subject.name}
      defaultCareerIds={subject.careerIds}
      careers={careers}
      isPending={isPending}
      onSubmit={async (data) => {
        try {
          await updateSubjectCareers({ subjectId: subject.subjectId, data });
          toast.success("Asociaciones actualizadas correctamente");
          navigate("/admin/catalogo");
        } catch (error: unknown) {
          toast.error(
            getErrorMessage(error, "No se pudieron actualizar las asociaciones. Intentá de nuevo.")
          );
        }
      }}
      onBack={() => navigate("/admin/catalogo")}
    />
  );
}


function SubjectAssociationsForm({
  subjectName,
  defaultCareerIds,
  careers,
  isPending,
  onSubmit,
  onBack,
}: SubjectAssociationsFormProps) {
  const { control, handleSubmit } = useForm<AsociacionesFormData>({
    resolver: zodResolver(asociacionesSchema),
    defaultValues: {
      careerIds: defaultCareerIds,
    },
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 2.5, maxWidth: 720, width: "100%" }}
    >
      <Box>
        <Typography variant="h5" component="h1" fontWeight={700}>
          Editar asociaciones
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {subjectName} · Asociá esta materia a las carreras de su institución.
        </Typography>
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

      <Box sx={{ display: "flex", gap: 2 }}>
        <AppButton appVariant="outline" fullWidth type="button" onClick={onBack}>
          ← Volver
        </AppButton>
        <AppButton appVariant="primary" fullWidth type="submit" loading={isPending}>
          Guardar asociaciones
        </AppButton>
      </Box>
    </Box>
  );
}