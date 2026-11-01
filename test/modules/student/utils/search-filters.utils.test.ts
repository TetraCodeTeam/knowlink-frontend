import { describe, expect, it } from "vitest";
import { buildMateriaTutorsRoute, buildSearchResultsRoute } from "@/modules/student/constants";
import { EMPTY_SEARCH_FILTERS } from "@/modules/student/interfaces/search-filters.interface";
import type { SearchFilters } from "@/modules/student/interfaces/search-filters.interface";
import {
  applySearchFiltersToParams,
  buildFilterChips,
  countActiveFilters,
  parseSearchFilters,
  toApiParams,
} from "@/modules/student/utils/search-filters.utils";

const completeFilters: SearchFilters = {
  modality: "VIRTUAL",
  compensation: "PAID",
  daysOfWeek: ["MONDAY", "WEDNESDAY"],
  timeFrame: "MORNING",
  verifiedOnly: true,
  minRating: 4,
};

describe("search-filters.utils", () => {
  it("parse → serialize → parse es idempotente", () => {
    const params = applySearchFiltersToParams(new URLSearchParams("q=algo"), completeFilters);
    const parsed = parseSearchFilters(params);

    expect(parsed).toEqual(completeFilters);
    expect(applySearchFiltersToParams(params, parsed).toString()).toBe(params.toString());
  });

  it("ignora los valores inválidos de la URL", () => {
    const parsed = parseSearchFilters(
      new URLSearchParams(
        "modality=XXX&minRating=9&daysOfWeek=MONDAY,FOO&verifiedOnly=no&timeFrame=NOON&compensation=X"
      )
    );

    expect(parsed).toEqual({ daysOfWeek: ["MONDAY"], verifiedOnly: false });
  });

  it("ordena los días L→D y elimina duplicados", () => {
    const parsed = parseSearchFilters(
      new URLSearchParams("daysOfWeek=SUNDAY,MONDAY,SUNDAY,WEDNESDAY")
    );

    expect(parsed.daysOfWeek).toEqual(["MONDAY", "WEDNESDAY", "SUNDAY"]);
  });

  it("applySearchFiltersToParams conserva q y el resto de las claves, sin mutar el original", () => {
    const current = new URLSearchParams("q=algo&otra=1&modality=XXX");
    const next = applySearchFiltersToParams(current, EMPTY_SEARCH_FILTERS);

    expect(next.get("q")).toBe("algo");
    expect(next.get("otra")).toBe("1");
    expect(next.has("modality")).toBe(false);
    expect(current.get("modality")).toBe("XXX");
  });

  it("toApiParams manda daysOfWeek con comas y omite los valores vacíos", () => {
    expect(toApiParams(EMPTY_SEARCH_FILTERS)).toEqual({});
    expect(toApiParams({ daysOfWeek: ["TUESDAY", "WEDNESDAY"], verifiedOnly: false })).toEqual({
      daysOfWeek: "TUESDAY,WEDNESDAY",
    });
    expect(toApiParams(completeFilters)).toEqual({
      modality: "VIRTUAL",
      compensation: "PAID",
      daysOfWeek: "MONDAY,WEDNESDAY",
      timeFrame: "MORNING",
      verifiedOnly: "true",
      minRating: "4",
    });
  });

  it("cuenta grupos activos: días y franja suman un solo filtro", () => {
    expect(countActiveFilters(EMPTY_SEARCH_FILTERS)).toBe(0);
    expect(
      countActiveFilters({ ...EMPTY_SEARCH_FILTERS, daysOfWeek: ["MONDAY"], timeFrame: "MORNING" })
    ).toBe(1);
    expect(countActiveFilters(completeFilters)).toBe(5);
  });

  it("buildFilterChips genera una chip por día y remove no toca las demás", () => {
    const filters: SearchFilters = {
      daysOfWeek: ["MONDAY", "TUESDAY"],
      verifiedOnly: false,
    };
    const chips = buildFilterChips(filters);

    expect(chips.map((chip) => chip.label)).toEqual(["Lunes", "Martes"]);

    const withoutMonday = chips[0].remove(filters);

    expect(withoutMonday.daysOfWeek).toEqual(["TUESDAY"]);
    expect(filters.daysOfWeek).toEqual(["MONDAY", "TUESDAY"]);
  });

  it("buildFilterChips usa etiquetas accesibles para la calificación", () => {
    const chips = buildFilterChips({ ...EMPTY_SEARCH_FILTERS, minRating: 4 });

    expect(chips[0].label).toBe("4+ ★");
    expect(chips[0].ariaLabel).toBe("4+ estrellas");
  });

  it("buildSearchResultsRoute sin filtros conserva la URL actual", () => {
    expect(buildSearchResultsRoute("x")).toBe("/student/buscar?q=x");
    expect(buildSearchResultsRoute("Sistemas Operativos")).toBe(
      "/student/buscar?q=Sistemas%20Operativos"
    );
  });

  it("buildSearchResultsRoute y buildMateriaTutorsRoute agregan los filtros", () => {
    const url = buildSearchResultsRoute("x", { ...EMPTY_SEARCH_FILTERS, modality: "VIRTUAL" });
    const parsed = new URL(url, "http://localhost");

    expect(parsed.pathname).toBe("/student/buscar");
    expect(parsed.searchParams.get("q")).toBe("x");
    expect(parsed.searchParams.get("modality")).toBe("VIRTUAL");

    const materiaUrl = buildMateriaTutorsRoute("Álgebra", completeFilters);
    const materiaParsed = new URL(materiaUrl, "http://localhost");

    expect(materiaParsed.pathname).toBe("/student/tutores");
    expect(materiaParsed.searchParams.get("materia")).toBe("Álgebra");
    expect(materiaParsed.searchParams.get("daysOfWeek")).toBe("MONDAY,WEDNESDAY");
    expect(materiaParsed.searchParams.get("minRating")).toBe("4");
  });
});
