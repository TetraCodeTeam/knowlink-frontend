import { useNavigate } from "react-router-dom";
import { Box, Chip, CircularProgress, Paper, Typography } from "@mui/material";
import { useMateriasByInstitucion } from "@/modules/catalog/hooks/useMateriasByInstitucion";
import AppButton from "@/shared/components/AppButton";
import type { CatalogSectionProps } from "@/modules/catalog/components/interfaces/catalog-components.interface";

export default function SubjectsList({ institutionId }: CatalogSectionProps) {
  const navigate = useNavigate();
  const { data: subjects, isLoading } = useMateriasByInstitucion(institutionId);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress sx={{ color: "#5B6ED9" }} />
      </Box>
    );
  }

  if (!subjects?.length) {
    return (
      <Typography variant="body2" color="text.secondary" py={2}>
        Esta institución aún no tiene materias.
      </Typography>
    );
  }

  return (
    <Paper elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, p: 2 }}>
      <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
        Materias
      </Typography>
      <Box component="ul" sx={{ pl: 2, m: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
        {subjects.map((subject) => (
          <Box
            component="li"
            key={subject.subjectId}
            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap>
                {subject.name}
              </Typography>
              {subject.isBasic && <Chip label="Básica" size="small" variant="outlined" />}
            </Box>
            <AppButton
              appVariant="outline"
              type="button"
              sx={{ minWidth: 0, px: 1.5, py: 0.5, flexShrink: 0 }}
              onClick={() =>
                navigate(
                  `/admin/catalogo/materias/${subject.subjectId}/asociaciones?institucion=${institutionId}`
                )
              }
            >
              Editar asociaciones
            </AppButton>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}