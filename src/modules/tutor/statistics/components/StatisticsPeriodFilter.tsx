import { useRef, useState } from "react";
import { Box, ButtonBase, Popover } from "@mui/material";
import { CalendarRange } from "lucide-react";
import { STATISTICS_COLORS } from "@/modules/tutor/statistics/constants/statistics-colors.constants";
import { QUICK_PERIOD_OPTIONS } from "@/modules/tutor/statistics/constants/statistics.constants";
import CustomPeriodForm from "@/modules/tutor/statistics/components/CustomPeriodForm";
import type { PeriodSelection } from "@/modules/tutor/statistics/interfaces/period-selection.interface";
import type { QuickStatisticsPeriodType } from "@/modules/tutor/statistics/types/statistics-period.type";
import { formatCompactRange, toIsoDate } from "@/modules/tutor/statistics/utils/period.utils";

const optionSx = (selected: boolean) =>
  ({
    px: 2,
    py: 1,
    borderRadius: 2,
    fontSize: 14,
    fontWeight: selected ? 600 : 400,
    color: selected ? "#fff" : STATISTICS_COLORS.textBody,
    bgcolor: selected ? STATISTICS_COLORS.primary : "transparent",
    display: "flex",
    alignItems: "center",
    gap: 0.75,
    whiteSpace: "nowrap",
    "&:hover": {
      bgcolor: selected ? STATISTICS_COLORS.primaryDark : STATISTICS_COLORS.primarySoft,
    },
    "&.Mui-focusVisible": {
      outline: `2px solid ${STATISTICS_COLORS.primaryDark}`,
      outlineOffset: 2,
    },
  }) as const;

interface StatisticsPeriodFilterProps {
  selection: PeriodSelection;
  onSelectQuick: (period: QuickStatisticsPeriodType) => void;
  onApplyCustom: (from: string, to: string) => void;
}

/** Fechas con las que arranca el formulario: el rango personalizado vigente o, si no hay, el último mes. */
function getInitialRange(selection: PeriodSelection): { from: string; to: string } {
  if (selection.period === "CUSTOM" && selection.from && selection.to) {
    return { from: selection.from, to: selection.to };
  }
  const today = new Date();
  const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  return { from: toIsoDate(monthAgo), to: toIsoDate(today) };
}

export default function StatisticsPeriodFilter({
  selection,
  onSelectQuick,
  onApplyCustom,
}: StatisticsPeriodFilterProps) {
  const customButtonRef = useRef<HTMLButtonElement>(null);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const isCustomSelected = selection.period === "CUSTOM";
  const initialRange = getInitialRange(selection);

  const handleApply = (from: string, to: string) => {
    setIsCustomOpen(false);
    onApplyCustom(from, to);
  };

  return (
    <Box
      role="group"
      aria-label="Período de las estadísticas"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 0.5,
        p: 0.5,
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: "0 1px 4px rgba(20, 20, 60, 0.12)",
        alignSelf: { xs: "stretch", lg: "flex-start" },
      }}
    >
      {QUICK_PERIOD_OPTIONS.map((option) => {
        const selected = selection.period === option.value;
        return (
          <ButtonBase
            key={option.value}
            aria-pressed={selected}
            onClick={() => onSelectQuick(option.value)}
            sx={optionSx(selected)}
          >
            {option.label}
          </ButtonBase>
        );
      })}

      <ButtonBase
        ref={customButtonRef}
        aria-pressed={isCustomSelected}
        aria-haspopup="dialog"
        aria-expanded={isCustomOpen}
        onClick={() => setIsCustomOpen(true)}
        sx={optionSx(isCustomSelected)}
      >
        <CalendarRange size={16} aria-hidden />
        {isCustomSelected && selection.from && selection.to
          ? formatCompactRange(selection.from, selection.to)
          : "Personalizado"}
      </ButtonBase>

      <Popover
        open={isCustomOpen}
        anchorEl={customButtonRef.current}
        onClose={() => setIsCustomOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { mt: 1, borderRadius: 3 } } }}
      >
        <CustomPeriodForm
          initialFrom={initialRange.from}
          initialTo={initialRange.to}
          onApply={handleApply}
          onCancel={() => setIsCustomOpen(false)}
        />
      </Popover>
    </Box>
  );
}
