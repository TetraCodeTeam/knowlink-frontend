import { useEffect, useId, useState } from "react";
import type { ReactNode } from "react";
import {
  Box,
  Divider,
  FormControlLabel,
  IconButton,
  Popover,
  Radio,
  RadioGroup,
  Rating,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import type { SharedModality } from "@/shared/constants/modality";
import AppButton from "@/shared/components/AppButton";
import { WEEK_DAYS } from "../constants";
import type {
  CompensationFilter,
  SearchFilters,
  SearchMode,
  WeekDay,
} from "../interfaces/search-filters.interface";
import { clearForMode, mergeDraft, sortWeekDays } from "../utils/search-filters.utils";

const BRAND_COLOR = "#5865C8";
const SOFT_BRAND_COLOR = "#EDEBFA";

interface SearchFiltersPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  mode: SearchMode;
  filters: SearchFilters;
  onApply: (next: SearchFilters) => void;
  onClose: () => void;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}>
      {children}
    </Typography>
  );
}

function toRatingValue(value: number | null): SearchFilters["minRating"] {
  if (value === null || value < 1 || value > 5) return undefined;
  return value as 1 | 2 | 3 | 4 | 5;
}

export default function SearchFiltersPopover({
  anchorEl,
  open,
  mode,
  filters,
  onApply,
  onClose,
}: SearchFiltersPopoverProps) {
  const titleId = useId();
  const [draft, setDraft] = useState<SearchFilters>(filters);
  const isMateriasMode = mode === "materias";

  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  const handleApply = () => onApply(mergeDraft(filters, draft, mode));
  const handleClear = () => onApply(clearForMode(filters, mode));

  const handleDaysChange = (_event: unknown, next: WeekDay[]) => {
    if (!Array.isArray(next)) return;
    setDraft((previous) => ({ ...previous, daysOfWeek: sortWeekDays(next) }));
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{
        paper: {
          sx: {
            width: 300,
            mt: 1,
            borderRadius: "12px",
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.18)",
          },
        },
      }}
    >
      <Box role="dialog" aria-labelledby={titleId} sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}
        >
          <Typography id={titleId} variant="h6" sx={{ fontWeight: 700, fontSize: 18 }}>
            Filtros Avanzados
          </Typography>
          <IconButton aria-label="Cerrar filtros avanzados" size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stack spacing={2}>
          {isMateriasMode && (
            <Box>
              <SectionTitle>Modalidad</SectionTitle>
              <ToggleButtonGroup
                exclusive
                size="small"
                value={draft.modality ?? null}
                onChange={(_event, next: SharedModality | null) =>
                  setDraft((previous) => ({ ...previous, modality: next ?? undefined }))
                }
                sx={{
                  backgroundColor: "#F3F4F6",
                  borderRadius: "10px",
                  p: 0.5,
                  "& .MuiToggleButton-root": {
                    border: "none",
                    borderRadius: "8px !important",
                    textTransform: "none",
                    px: 2,
                    py: 0.5,
                    fontSize: 13,
                    "&.Mui-selected": {
                      backgroundColor: BRAND_COLOR,
                      color: "#fff",
                      "&:hover": { backgroundColor: "#4a54ad" },
                    },
                  },
                }}
              >
                <ToggleButton value="IN_PERSON">Presencial</ToggleButton>
                <ToggleButton value="VIRTUAL">Virtual</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}

          {isMateriasMode && (
            <Box>
              <SectionTitle>Compensación</SectionTitle>
              <RadioGroup
                row
                value={draft.compensation ?? ""}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    compensation: event.target.value as CompensationFilter,
                  }))
                }
              >
                <FormControlLabel
                  value="FREE"
                  control={<Radio size="small" />}
                  label="Gratuito"
                  slotProps={{ typography: { sx: { fontSize: 14 } } }}
                />
                <FormControlLabel
                  value="PAID"
                  control={<Radio size="small" />}
                  label="Pago"
                  slotProps={{ typography: { sx: { fontSize: 14 } } }}
                />
              </RadioGroup>
            </Box>
          )}

          <Box>
            <SectionTitle>Disponibilidad</SectionTitle>
            <ToggleButtonGroup
              value={draft.daysOfWeek}
              onChange={handleDaysChange}
              sx={{
                gap: 0.75,
                "& .MuiToggleButtonGroup-grouped": {
                  width: 30,
                  height: 30,
                  minWidth: 30,
                  p: 0,
                  mx: "0 !important",
                  border: "1px solid #E2E8F0 !important",
                  borderRadius: "50% !important",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#475569",
                  backgroundColor: "#fff",
                  "&.Mui-selected": {
                    backgroundColor: SOFT_BRAND_COLOR,
                    color: "#334155",
                    borderColor: `${BRAND_COLOR} !important`,
                    "&:hover": { backgroundColor: "#e4e0fa" },
                  },
                },
              }}
            >
              {WEEK_DAYS.map(({ letter, value, label }) => (
                <ToggleButton key={value} value={value} aria-label={label}>
                  {letter}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          {isMateriasMode && <Divider />}

          {isMateriasMode && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Box>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                  <CheckCircleOutlineIcon sx={{ fontSize: 18, color: BRAND_COLOR }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Tutor Verificado
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Sólo mostrar perfiles validados por la universidad
                </Typography>
              </Box>
              <Switch
                checked={draft.verifiedOnly}
                onChange={(event) =>
                  setDraft((previous) => ({ ...previous, verifiedOnly: event.target.checked }))
                }
                inputProps={{ "aria-label": "Tutor verificado" }}
              />
            </Box>
          )}

          <Box>
            <SectionTitle>Calificación Mínima</SectionTitle>
            <Rating
              name="min-rating"
              value={draft.minRating ?? 0}
              precision={1}
              onChange={(_event, value) => {
                const nextRating = toRatingValue(value);
                setDraft((previous) => ({
                  ...previous,
                  minRating: previous.minRating === nextRating ? undefined : nextRating,
                }));
              }}
              getLabelText={(value) => `${value} estrellas`}
              sx={{ color: "#FBBF24", "& .MuiRating-iconEmpty": { color: "#FBBF24" } }}
            />
          </Box>
        </Stack>

        <Stack direction="row" sx={{ justifyContent: "space-between", gap: 1, mt: 3 }}>
          <AppButton
            appVariant="outline"
            size="small"
            onClick={handleClear}
            sx={{ px: 1.5, fontSize: 13 }}
          >
            Limpiar Filtros
          </AppButton>
          <AppButton size="small" onClick={handleApply} sx={{ px: 1.5, fontSize: 13 }}>
            Aplicar Filtros
          </AppButton>
        </Stack>
      </Box>
    </Popover>
  );
}
