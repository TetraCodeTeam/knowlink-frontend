import { useMemo } from "react";
import { Button, Chip, Stack } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import type { SearchFilters } from "../interfaces/search-filters.interface";
import { buildFilterChips } from "../utils/search-filters.utils";
import type { FilterChip } from "../utils/search-filters.utils";

interface ActiveFiltersBarProps {
  filters: SearchFilters;
  onRemove: (chip: FilterChip) => void;
  onClear: () => void;
}

export default function ActiveFiltersBar({ filters, onRemove, onClear }: ActiveFiltersBarProps) {
  const chips = useMemo(() => buildFilterChips(filters), [filters]);

  if (chips.length === 0) return null;

  return (
    <Stack direction="row" sx={{ flexWrap: "wrap", alignItems: "center", gap: 1, mb: 2 }}>
      {chips.map((chip) => {
        const deleteLabel = `Quitar filtro ${chip.ariaLabel ?? chip.label}`;

        return (
          <Chip
            key={chip.key}
            label={chip.label}
            size="small"
            onDelete={() => onRemove(chip)}
            deleteIcon={<CancelIcon titleAccess={deleteLabel} aria-label={deleteLabel} />}
            sx={{
              backgroundColor: "#EDEBFA",
              color: "#3f4a9e",
              fontWeight: 500,
              "& .MuiChip-deleteIcon": { color: "#5865C8" },
            }}
          />
        );
      })}
      <Button
        size="small"
        onClick={onClear}
        sx={{ textTransform: "none", color: "#5865C8", fontWeight: 600 }}
      >
        Limpiar filtros
      </Button>
    </Stack>
  );
}
