import { Box, Chip, CircularProgress, Paper, Typography } from "@mui/material";
import { useCarrerasByInstitucion } from "@/modules/catalog/hooks/useCarrerasByInstitucion";
import type { CatalogSectionProps } from "@/modules/catalog/components/interfaces/catalog-components.interface";

export default function CareersList({ institutionId }: CatalogSectionProps) {
  const { data: careers, isLoading } = useCarrerasByInstitucion(institutionId);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress sx={{ color: "#5B6ED9" }} />
      </Box>
    );
  }

  if (!careers?.length) {
    return (
      <Typography variant="body2" color="text.secondary" py={2}>
        Esta institución aún no tiene carreras.
      </Typography>
    );
  }

  return (
    <Paper elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, p: 2 }}>
      <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
        Carreras
      </Typography>
      <Box component="ul" sx={{ pl: 2, m: 0, display: "flex", flexDirection: "column", gap: 1 }}>
        {careers.map((career) => (
          <Box component="li" key={career.careerId} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">{career.name}</Typography>
            {career.type === "COMPARTIDA" && (
              <Chip label="Transversal" size="small" color="primary" variant="outlined" />
            )}
          </Box>
        ))}
      </Box>
    </Paper>
  );
}