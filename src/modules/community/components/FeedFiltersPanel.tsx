import { useState, type ReactNode } from "react";
import {
  Box,
  Checkbox,
  ListItemText,
  MenuItem,
  Select,
  Typography,
  type SelectChangeEvent,
  type SxProps,
  type Theme,
} from "@mui/material";
import {
  BookOpen,
  Check,
  CircleHelp,
  Clock,
  GraduationCap,
  Lightbulb,
  MessagesSquare,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import { useCareers } from "@/modules/tutors/hooks/useCareers";
import {
  CLEARED_FEED_FILTERS,
  FEED_PERIOD_OPTIONS,
} from "@/modules/community/constants/feed-filters.constants";
import { useCommunitySubjects } from "@/modules/community/hooks/useCommunitySubjects";
import type {
  FeedFilters,
  FeedFiltersDraft,
} from "@/modules/community/interfaces/feed-filters.interface";
import type { FeedCounts } from "@/modules/community/interfaces/responses/feed-counts.interface";
import { COMMUNITY_COLORS, cardSx } from "@/modules/community/styles/community.styles";
import type { FeedPeriod } from "@/modules/community/types/feed-period.type";
import type { PostStatus } from "@/modules/community/types/post-status.type";
import type { PostType } from "@/modules/community/types/post-type.type";

interface FeedFiltersPanelProps {
  filters: FeedFilters;
  counts: FeedCounts | null;
  activeCount: number;
  onTypeChange: (type: PostType | null) => void;
  onApply: (draft: FeedFiltersDraft) => void;
  onClear: () => void;
}

interface TypeOption {
  value: PostType | null;
  label: string;
  icon: ReactNode;
  count: number | undefined;
}

const { type: _clearedType, ...CLEARED_DRAFT } = CLEARED_FEED_FILTERS;

const selectSx: SxProps<Theme> = {
  width: "100%",
  bgcolor: COMMUNITY_COLORS.panel,
  borderRadius: "8px",
  fontSize: 14,
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  "& .MuiSelect-select": { py: 1.1 },
};

const checkboxSx: SxProps<Theme> = {
  p: 0.25,
  color: COMMUNITY_COLORS.primary,
  "&.Mui-checked": { color: "#2E1FAF" },
};

function toDraft(filters: FeedFilters): FeedFiltersDraft {
  const { type: _type, ...draft } = filters;
  return draft;
}

function hasDraftValues(draft: FeedFiltersDraft): boolean {
  return (
    draft.period !== "ALL" ||
    draft.careerId !== null ||
    draft.subjectIds.length > 0 ||
    draft.status !== null
  );
}

function FilterSection({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <Box sx={{ borderTop: `1px solid ${COMMUNITY_COLORS.border}`, pt: 1.75, mt: 1.75 }}>
      <Typography
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          mb: 1,
          fontSize: 11.5,
          fontWeight: 700,
          letterSpacing: 0.6,
          textTransform: "uppercase",
          color: COMMUNITY_COLORS.subtle,
        }}
      >
        <Box component="span" aria-hidden sx={{ display: "inline-flex" }}>
          {icon}
        </Box>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

export default function FeedFiltersPanel({
  filters,
  counts,
  activeCount,
  onTypeChange,
  onApply,
  onClear,
}: FeedFiltersPanelProps) {
  const [draft, setDraft] = useState<FeedFiltersDraft>(() => toDraft(filters));
  const { data: careers = [] } = useCareers();
  const { subjects } = useCommunitySubjects(true, draft.careerId);

  const subjectNames = new Map(subjects.map((subject) => [subject.subjectId, subject.name]));
  // Mientras llega el catálogo de la carrera elegida no se pueden nombrar las materias ya seleccionadas.
  const selectedSubjects = draft.subjectIds.filter((id) => subjectNames.has(id));

  const typeOptions: TypeOption[] = [
    {
      value: null,
      label: "Todas",
      icon: <MessagesSquare size={17} />,
      count: counts?.total,
    },
    {
      value: "HELP_REQUEST",
      label: "Dudas",
      icon: <CircleHelp size={17} color={COMMUNITY_COLORS.warning} />,
      count: counts?.helpRequests,
    },
    {
      value: "SHARED_CONTENT",
      label: "Aportes",
      icon: <Lightbulb size={17} color={COMMUNITY_COLORS.primary} />,
      count: counts?.sharedContents,
    },
  ];

  const canClear = activeCount > 0 || hasDraftValues(draft);

  const handleCareerChange = (event: SelectChangeEvent) => {
    // Las materias elegidas pueden no pertenecer a la nueva carrera: se reinicia la selección.
    setDraft((current) => ({ ...current, careerId: event.target.value || null, subjectIds: [] }));
  };

  const handleSubjectsChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    setDraft((current) => ({
      ...current,
      subjectIds: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const toggleStatus = (status: PostStatus) => {
    setDraft((current) => ({ ...current, status: current.status === status ? null : status }));
  };

  const handleClear = () => {
    setDraft(CLEARED_DRAFT);
    onClear();
  };

  return (
    <Box component="section" aria-labelledby="feed-filters-title" sx={cardSx}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
          <SlidersHorizontal size={20} color={COMMUNITY_COLORS.primaryDark} aria-hidden />
          <Typography
            id="feed-filters-title"
            component="h2"
            sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.25 }}
          >
            Filtros de Búsqueda
          </Typography>
          {activeCount > 0 ? (
            <Box
              component="span"
              aria-label={`${activeCount} ${activeCount === 1 ? "filtro activo" : "filtros activos"}`}
              sx={{
                minWidth: 22,
                height: 22,
                px: 0.75,
                borderRadius: "11px",
                bgcolor: COMMUNITY_COLORS.lavender,
                color: COMMUNITY_COLORS.primaryDark,
                fontSize: 12,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {activeCount}
            </Box>
          ) : null}
        </Box>
        <Box
          component="button"
          type="button"
          onClick={handleClear}
          disabled={!canClear}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            border: "none",
            bgcolor: "transparent",
            p: 0,
            fontSize: 13,
            fontWeight: 600,
            color: COMMUNITY_COLORS.primaryDark,
            cursor: "pointer",
            "&:disabled": { opacity: 0.45, cursor: "default" },
          }}
        >
          <RotateCcw size={13} aria-hidden />
          Limpiar
        </Box>
      </Box>

      <FilterSection icon={<MessagesSquare size={13} />} label="Tipo de consulta">
        <Box role="group" aria-label="Tipo de consulta" sx={{ display: "grid", gap: 0.5 }}>
          {typeOptions.map((option) => {
            const selected = filters.type === option.value;
            return (
              <Box
                key={option.label}
                component="button"
                type="button"
                aria-pressed={selected}
                onClick={() => onTypeChange(option.value)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                  border: "none",
                  borderRadius: "8px",
                  px: 1.25,
                  py: 0.9,
                  fontSize: 14,
                  fontWeight: selected ? 700 : 500,
                  color: selected ? COMMUNITY_COLORS.primaryDark : COMMUNITY_COLORS.text,
                  bgcolor: selected ? "#E4E8FB" : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  "&:hover": { bgcolor: selected ? "#E4E8FB" : COMMUNITY_COLORS.panel },
                }}
              >
                <Box component="span" aria-hidden sx={{ display: "inline-flex" }}>
                  {option.icon}
                </Box>
                <Box component="span" sx={{ flex: 1 }}>
                  {option.label}
                </Box>
                <Box
                  component="span"
                  sx={{
                    minWidth: 28,
                    px: 0.9,
                    py: 0.1,
                    borderRadius: "11px",
                    bgcolor: selected ? "#CDD4F6" : COMMUNITY_COLORS.lavender,
                    fontSize: 12,
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  {option.count ?? "–"}
                </Box>
              </Box>
            );
          })}
        </Box>
      </FilterSection>

      <FilterSection icon={<Clock size={13} />} label="Período de tiempo">
        <Select
          value={draft.period}
          onChange={(event) =>
            setDraft((current) => ({ ...current, period: event.target.value as FeedPeriod }))
          }
          sx={selectSx}
          SelectDisplayProps={{ "aria-label": "Período de tiempo" }}
        >
          {FEED_PERIOD_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FilterSection>

      <FilterSection icon={<GraduationCap size={13} />} label="Carrera universitaria">
        <Select
          value={draft.careerId ?? ""}
          onChange={handleCareerChange}
          displayEmpty
          sx={selectSx}
          SelectDisplayProps={{ "aria-label": "Carrera universitaria" }}
        >
          <MenuItem value="">Todas las carreras</MenuItem>
          {careers.map((career) => (
            <MenuItem key={career.careerId} value={career.careerId}>
              {career.name}
            </MenuItem>
          ))}
        </Select>
      </FilterSection>

      <FilterSection icon={<BookOpen size={13} />} label="Materia">
        <Select
          multiple
          displayEmpty
          value={selectedSubjects}
          onChange={handleSubjectsChange}
          renderValue={(selected) =>
            selected.length === 0 ? (
              <Box component="span" sx={{ color: COMMUNITY_COLORS.muted }}>
                Selecciona las materias
              </Box>
            ) : (
              `${selected.length} ${selected.length === 1 ? "materia seleccionada" : "materias seleccionadas"}`
            )
          }
          sx={selectSx}
          SelectDisplayProps={{ "aria-label": "Materias" }}
          MenuProps={{ slotProps: { paper: { sx: { maxHeight: 320 } } } }}
        >
          {subjects.map((subject) => (
            <MenuItem key={subject.subjectId} value={subject.subjectId} dense>
              <Checkbox
                checked={draft.subjectIds.includes(subject.subjectId)}
                size="small"
                sx={checkboxSx}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText primary={subject.name} slotProps={{ primary: { fontSize: 14 } }} />
            </MenuItem>
          ))}
        </Select>

        {selectedSubjects.length > 0 ? (
          <Box sx={{ display: "grid", gap: 0.75, mt: 1.25 }}>
            {selectedSubjects.map((subjectId) => (
              <Box
                key={subjectId}
                component="label"
                sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
              >
                <Checkbox
                  checked
                  size="small"
                  sx={checkboxSx}
                  onChange={() =>
                    setDraft((current) => ({
                      ...current,
                      subjectIds: current.subjectIds.filter((id) => id !== subjectId),
                    }))
                  }
                />
                <Typography sx={{ fontSize: 14 }}>{subjectNames.get(subjectId)}</Typography>
              </Box>
            ))}
          </Box>
        ) : null}
      </FilterSection>

      <FilterSection icon={<CircleHelp size={13} />} label="Estado de la publicación">
        <Box sx={{ display: "grid", gap: 0.75 }}>
          {(
            [
              { value: "OPEN", label: "Solo preguntas abiertas" },
              { value: "RESOLVED", label: "Resueltas" },
            ] as const
          ).map((option) => (
            <Box
              key={option.value}
              component="label"
              sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
            >
              <Checkbox
                checked={draft.status === option.value}
                size="small"
                sx={checkboxSx}
                onChange={() => toggleStatus(option.value)}
              />
              <Typography sx={{ fontSize: 14 }}>{option.label}</Typography>
            </Box>
          ))}
        </Box>
      </FilterSection>

      <AppButton
        appVariant="soft"
        fullWidth
        startIcon={<Check size={16} aria-hidden />}
        onClick={() => onApply(draft)}
        sx={{ mt: 2.5 }}
      >
        Aplicar filtros
      </AppButton>
    </Box>
  );
}
