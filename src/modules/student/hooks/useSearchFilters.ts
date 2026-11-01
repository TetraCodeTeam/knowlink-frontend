import { useCallback, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import type { SearchFilters, SearchMode } from "../interfaces/search-filters.interface";
import {
  applySearchFiltersToParams,
  clearForMode,
  countActiveFilters,
  getEffectiveFilters,
  parseSearchFilters,
} from "../utils/search-filters.utils";
import type { FilterChip } from "../utils/search-filters.utils";

export function useSearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();

  // En /student/tutores no hay toggle: el contexto siempre es una materia.
  const mode: SearchMode =
    pathname !== "/student/tutores" && searchParams.get("mode") === "tutores"
      ? "tutores"
      : "materias";

  const filters = useMemo(() => parseSearchFilters(searchParams), [searchParams]);
  const effectiveFilters = useMemo(() => getEffectiveFilters(filters, mode), [filters, mode]);
  const activeFilterCount = useMemo(() => countActiveFilters(effectiveFilters), [effectiveFilters]);

  const setFilters = useCallback(
    (next: SearchFilters) => {
      setSearchParams(applySearchFiltersToParams(searchParams, next));
    },
    [searchParams, setSearchParams]
  );

  const setMode = useCallback(
    (next: SearchMode) => {
      const params = new URLSearchParams(searchParams);
      if (next === "tutores") params.set("mode", "tutores");
      else params.delete("mode");
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const removeChip = useCallback(
    (chip: FilterChip) => setFilters(chip.remove(filters)),
    [filters, setFilters]
  );

  const clearFilters = useCallback(
    () => setFilters(clearForMode(filters, mode)),
    [filters, mode, setFilters]
  );

  return {
    filters,
    effectiveFilters,
    mode,
    setMode,
    setFilters,
    removeChip,
    clearFilters,
    hasActive: activeFilterCount > 0,
    activeFilterCount,
  };
}
