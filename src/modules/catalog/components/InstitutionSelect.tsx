import { Box, FormControl, FormHelperText, MenuItem, Select, Typography } from "@mui/material";
import { useInstituciones } from "@/modules/catalog/hooks/useInstituciones";
import type { InstitutionSelectProps } from "@/modules/catalog/components/interfaces/catalog-components.interface";

export default function InstitutionSelect({
  value,
  onChange,
  label = "Institución activa",
}: InstitutionSelectProps) {
  const { data: institutions, isLoading } = useInstituciones();

  return (
    <Box>
      <Typography variant="body2" fontWeight={500} mb={0.5}>
        {label}
      </Typography>
      <FormControl fullWidth>
        <Select
          value={value}
          displayEmpty
          disabled={isLoading}
          sx={{ borderRadius: 2 }}
          onChange={(event) => onChange(event.target.value)}
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
        {isLoading && <FormHelperText>Cargando instituciones…</FormHelperText>}
      </FormControl>
    </Box>
  );
}