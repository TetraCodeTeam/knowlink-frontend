import { Box, ButtonBase } from "@mui/material";
import type { DashboardRange } from "@/modules/admin/types/dashboard-range.type";
import {
  rangeToggleButtonActiveSx,
  rangeToggleButtonSx,
  rangeToggleGroupSx,
} from "@/modules/admin/home/styles/admin-home.styles";

const RANGE_OPTIONS: { value: DashboardRange; label: string }[] = [
  { value: "WEEK", label: "Esta semana" },
  { value: "MONTH", label: "30 días" },
];

interface RangeToggleProps {
  value: DashboardRange;
  onChange: (range: DashboardRange) => void;
}

export default function RangeToggle({ value, onChange }: RangeToggleProps) {
  return (
    <Box role="group" aria-label="Rango de rendimiento" sx={rangeToggleGroupSx}>
      {RANGE_OPTIONS.map((option) => {
        const selected = option.value === value;

        return (
          <ButtonBase
            key={option.value}
            onClick={() => onChange(option.value)}
            aria-pressed={selected}
            sx={selected ? [rangeToggleButtonSx, rangeToggleButtonActiveSx] : rangeToggleButtonSx}
          >
            {option.label}
          </ButtonBase>
        );
      })}
    </Box>
  );
}
