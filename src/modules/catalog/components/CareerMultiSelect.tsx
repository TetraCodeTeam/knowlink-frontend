import { Box, Chip, FormControl, FormHelperText, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import type { CareerMultiSelectProps } from "@/modules/catalog/components/interfaces/catalog-components.interface";

export default function CareerMultiSelect({
  careers,
  value,
  onChange,
  error,
  helperText,
}: CareerMultiSelectProps) {
  return (
    <FormControl fullWidth error={error}>
      <Select
        multiple
        value={value}
        onChange={(event) => onChange(event.target.value as string[])}
        input={<OutlinedInput />}
        displayEmpty
        sx={{ borderRadius: 2 }}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return (
              <Typography variant="body2" color="text.secondary">
                Seleccioná las carreras
              </Typography>
            );
          }
          return (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((careerId) => (
                <Chip
                  key={careerId}
                  label={careers?.find((career) => career.careerId === careerId)?.name}
                  size="small"
                />
              ))}
            </Box>
          );
        }}
      >
        <MenuItem value="" disabled>
          Seleccioná las carreras
        </MenuItem>
        {careers?.map((career) => (
          <MenuItem key={career.careerId} value={career.careerId}>
            {career.type === "COMPARTIDA" ? `${career.name} (Transversal)` : career.name}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}