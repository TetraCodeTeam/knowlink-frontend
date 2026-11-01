import { MODALITY_LABEL } from "@/shared/constants/modality";
import { COMPENSATION_LABEL, TIME_FRAME_LABEL, WEEK_DAYS } from "../constants";
import { EMPTY_SEARCH_FILTERS } from "../interfaces/search-filters.interface";
import type { SearchFilters, SearchMode, WeekDay } from "../interfaces/search-filters.interface";
import {
  compensationParamSchema,
  minRatingParamSchema,
  modalityParamSchema,
  timeFrameParamSchema,
  verifiedOnlyParamSchema,
  weekDayParamSchema,
} from "../schemas/search-filters.schema";

export const FILTER_PARAM_KEYS = [
  "modality",
  "compensation",
  "daysOfWeek",
  "timeFrame",
  "verifiedOnly",
  "minRating",
] as const;

const WEEK_DAY_ORDER: WeekDay[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export interface FilterChip {
  key: string;
  label: string;
  /** Texto accesible cuando `label` usa símbolos (ej. "4+ ★"). */
  ariaLabel?: string;
  remove: (filters: SearchFilters) => SearchFilters;
}

export function sortWeekDays(days: WeekDay[]): WeekDay[] {
  const unique = new Set(days);
  return WEEK_DAY_ORDER.filter((day) => unique.has(day));
}

export function parseSearchFilters(params: URLSearchParams): SearchFilters {
  const modality = modalityParamSchema.safeParse(params.get("modality"));
  const compensation = compensationParamSchema.safeParse(params.get("compensation"));
  const timeFrame = timeFrameParamSchema.safeParse(params.get("timeFrame"));
  const verifiedOnly = verifiedOnlyParamSchema.safeParse(params.get("verifiedOnly"));
  const minRating = minRatingParamSchema.safeParse(params.get("minRating"));

  const days = new Set<WeekDay>();
  const rawDays = params.get("daysOfWeek");
  if (rawDays) {
    for (const token of rawDays.split(",")) {
      const parsedDay = weekDayParamSchema.safeParse(token.trim().toUpperCase());
      if (parsedDay.success) days.add(parsedDay.data);
    }
  }

  const filters: SearchFilters = {
    daysOfWeek: WEEK_DAY_ORDER.filter((day) => days.has(day)),
    verifiedOnly: verifiedOnly.success,
  };

  if (modality.success) filters.modality = modality.data;
  if (compensation.success) filters.compensation = compensation.data;
  if (timeFrame.success) filters.timeFrame = timeFrame.data;
  if (minRating.success) {
    filters.minRating = minRating.data as NonNullable<SearchFilters["minRating"]>;
  }

  return filters;
}

export function toApiParams(filters: SearchFilters): Record<string, string> {
  const params: Record<string, string> = {};

  if (filters.modality) params.modality = filters.modality;
  if (filters.compensation) params.compensation = filters.compensation;
  if (filters.daysOfWeek.length > 0) params.daysOfWeek = filters.daysOfWeek.join(",");
  if (filters.timeFrame) params.timeFrame = filters.timeFrame;
  if (filters.verifiedOnly) params.verifiedOnly = "true";
  if (filters.minRating) params.minRating = String(filters.minRating);

  return params;
}

export function applySearchFiltersToParams(
  params: URLSearchParams,
  filters: SearchFilters
): URLSearchParams {
  const next = new URLSearchParams(params);

  for (const key of FILTER_PARAM_KEYS) next.delete(key);
  for (const [key, value] of Object.entries(toApiParams(filters))) next.set(key, value);

  return next;
}

export function countActiveFilters(filters: SearchFilters): number {
  let count = 0;

  if (filters.modality) count += 1;
  if (filters.compensation) count += 1;
  if (filters.daysOfWeek.length > 0 || filters.timeFrame) count += 1;
  if (filters.verifiedOnly) count += 1;
  if (filters.minRating) count += 1;

  return count;
}

export function hasActiveFilters(filters: SearchFilters): boolean {
  return countActiveFilters(filters) > 0;
}

export function buildFilterChips(filters: SearchFilters): FilterChip[] {
  const chips: FilterChip[] = [];

  if (filters.modality) {
    const modality = filters.modality;
    chips.push({
      key: `modality-${modality}`,
      label: MODALITY_LABEL[modality],
      remove: (current) => ({ ...current, modality: undefined }),
    });
  }

  if (filters.compensation) {
    const compensation = filters.compensation;
    chips.push({
      key: `compensation-${compensation}`,
      label: COMPENSATION_LABEL[compensation],
      remove: (current) => ({ ...current, compensation: undefined }),
    });
  }

  for (const day of filters.daysOfWeek) {
    const label = WEEK_DAYS.find((weekDay) => weekDay.value === day)?.label ?? day;
    chips.push({
      key: `day-${day}`,
      label,
      remove: (current) => ({
        ...current,
        daysOfWeek: current.daysOfWeek.filter((value) => value !== day),
      }),
    });
  }

  if (filters.timeFrame) {
    const timeFrame = filters.timeFrame;
    chips.push({
      key: `timeFrame-${timeFrame}`,
      label: TIME_FRAME_LABEL[timeFrame],
      remove: (current) => ({ ...current, timeFrame: undefined }),
    });
  }

  if (filters.verifiedOnly) {
    chips.push({
      key: "verifiedOnly",
      label: "Verificado",
      remove: (current) => ({ ...current, verifiedOnly: false }),
    });
  }

  if (filters.minRating) {
    const minRating = filters.minRating;
    chips.push({
      key: `minRating-${minRating}`,
      label: `${minRating}+ ★`,
      ariaLabel: `${minRating}+ estrellas`,
      remove: (current) => ({ ...current, minRating: undefined }),
    });
  }

  return chips;
}

/**
 * Los filtros de materia (modalidad, compensación y verificado) no aplican en
 * modo Tutores: sin una materia concreta no tienen sentido.
 */
export function getEffectiveFilters(filters: SearchFilters, mode: SearchMode): SearchFilters {
  if (mode === "materias") return filters;

  return {
    daysOfWeek: filters.daysOfWeek,
    timeFrame: filters.timeFrame,
    verifiedOnly: false,
    minRating: filters.minRating,
  };
}

export function mergeDraft(
  current: SearchFilters,
  draft: SearchFilters,
  mode: SearchMode
): SearchFilters {
  if (mode === "materias") {
    return { ...draft, daysOfWeek: [...draft.daysOfWeek] };
  }

  return {
    ...current,
    daysOfWeek: [...draft.daysOfWeek],
    timeFrame: draft.timeFrame,
    minRating: draft.minRating,
  };
}

export function clearForMode(current: SearchFilters, mode: SearchMode): SearchFilters {
  if (mode === "materias") {
    return { ...EMPTY_SEARCH_FILTERS, daysOfWeek: [] };
  }

  return {
    ...current,
    daysOfWeek: [],
    timeFrame: undefined,
    minRating: undefined,
  };
}
