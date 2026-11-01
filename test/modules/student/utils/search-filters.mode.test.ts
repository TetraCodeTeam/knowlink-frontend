import { describe, expect, it } from "vitest";
import { EMPTY_SEARCH_FILTERS } from "@/modules/student/interfaces/search-filters.interface";
import type { SearchFilters } from "@/modules/student/interfaces/search-filters.interface";
import {
  clearForMode,
  getEffectiveFilters,
  mergeDraft,
} from "@/modules/student/utils/search-filters.utils";

const fullFilters: SearchFilters = {
  modality: "VIRTUAL",
  compensation: "PAID",
  daysOfWeek: ["MONDAY"],
  timeFrame: "MORNING",
  verifiedOnly: true,
  minRating: 4,
};

describe("search-filters por modo", () => {
  it("getEffectiveFilters en materias devuelve todos los filtros", () => {
    expect(getEffectiveFilters(fullFilters, "materias")).toEqual(fullFilters);
  });

  it("getEffectiveFilters en tutores descarta modalidad, compensación y verificado", () => {
    expect(getEffectiveFilters(fullFilters, "tutores")).toEqual({
      daysOfWeek: ["MONDAY"],
      timeFrame: "MORNING",
      verifiedOnly: false,
      minRating: 4,
    });
  });

  it("mergeDraft en tutores conserva los filtros ocultos de materia", () => {
    const draft: SearchFilters = {
      ...fullFilters,
      daysOfWeek: ["TUESDAY"],
      minRating: undefined,
    };

    expect(mergeDraft(fullFilters, draft, "tutores")).toEqual({
      ...fullFilters,
      daysOfWeek: ["TUESDAY"],
      minRating: undefined,
    });
  });

  it("clearForMode en tutores no borra los filtros de materia", () => {
    expect(clearForMode(fullFilters, "tutores")).toEqual({
      ...fullFilters,
      daysOfWeek: [],
      timeFrame: undefined,
      minRating: undefined,
    });
  });

  it("clearForMode en materias vacía todos los filtros", () => {
    expect(clearForMode(fullFilters, "materias")).toEqual(EMPTY_SEARCH_FILTERS);
  });
});
