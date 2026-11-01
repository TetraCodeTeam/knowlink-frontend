import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import SearchResultsPage from "@/modules/student/pages/SearchResultsPage";
import { EMPTY_FILTERED_MESSAGE, EMPTY_SEARCH_MESSAGE } from "@/modules/student/constants";
import type { TutorSearchResult } from "@/modules/student/interfaces/tutor-search-result.interface";
import { tutorAna } from "../../../fixtures/busqueda/tutoresDePrueba";

vi.mock("@/modules/student/hooks/useSearchTutorsAndMaterias", () => ({
  useSearchTutorsAndMaterias: vi.fn(),
}));

import { useSearchTutorsAndMaterias } from "@/modules/student/hooks/useSearchTutorsAndMaterias";

const mockedHook = vi.mocked(useSearchTutorsAndMaterias);

type HookResult = ReturnType<typeof useSearchTutorsAndMaterias>;

interface HookOptions {
  enabled?: boolean;
}

function hookResult(data: TutorSearchResult[], isFetching = false): HookResult {
  return { data, isFetching } as unknown as HookResult;
}

interface MockSearchOptions {
  filtered?: TutorSearchResult[];
  base?: TutorSearchResult[];
  filteredFetching?: boolean;
  baseFetching?: boolean;
}

function mockSearch({
  filtered = [],
  base = [],
  filteredFetching = false,
  baseFetching = false,
}: MockSearchOptions = {}) {
  mockedHook.mockImplementation((_query, filters, options?: HookOptions) => {
    if (filters === undefined) {
      if (!options?.enabled) {
        return { data: undefined, isFetching: false } as unknown as HookResult;
      }
      return hookResult(base, baseFetching);
    }

    return hookResult(filtered, filteredFetching);
  });
}

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
}

function renderPage(entry: string) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <SearchResultsPage />
      <LocationProbe />
    </MemoryRouter>
  );
}

function currentLocation() {
  return screen.getByTestId("location").textContent ?? "";
}

describe("SearchResultsPage — US-49", () => {
  beforeEach(() => {
    mockedHook.mockReset();
  });

  it("con filtros en la URL el hook se llama con esos filtros", () => {
    mockSearch({ filtered: [tutorAna] });
    renderPage("/student/buscar?q=Ana&modality=VIRTUAL&minRating=4");

    expect(mockedHook).toHaveBeenCalledWith(
      "Ana",
      expect.objectContaining({ modality: "VIRTUAL", minRating: 4 })
    );
  });

  it("muestra las chips de filtros activos", () => {
    mockSearch({ filtered: [tutorAna] });
    renderPage("/student/buscar?q=Ana&modality=VIRTUAL&minRating=4");

    expect(screen.getByText("Virtual")).toBeInTheDocument();
    expect(screen.getByText("4+ ★")).toBeInTheDocument();
  });

  it("quitar una chip actualiza la URL", async () => {
    const user = userEvent.setup();
    mockSearch({ filtered: [tutorAna] });
    renderPage("/student/buscar?q=Ana&modality=VIRTUAL");

    await user.click(screen.getByLabelText("Quitar filtro Virtual"));

    expect(currentLocation()).toContain("q=Ana");
    expect(currentLocation()).not.toContain("modality");
  });

  it("AC-5: filtrado vacío con base con resultados muestra el mensaje de filtros", () => {
    mockSearch({ filtered: [], base: [tutorAna] });
    renderPage("/student/buscar?q=Ana&modality=VIRTUAL");

    expect(screen.getByText(EMPTY_FILTERED_MESSAGE)).toBeInTheDocument();
  });

  it("AC-5: filtrado vacío y base vacía muestra el mensaje de búsqueda", () => {
    mockSearch({ filtered: [], base: [] });
    renderPage("/student/buscar?q=Ana&modality=VIRTUAL");

    expect(screen.getByText(EMPTY_SEARCH_MESSAGE)).toBeInTheDocument();
  });

  it("sin filtros y vacío no consulta la base", () => {
    mockSearch({ filtered: [], base: [tutorAna] });
    renderPage("/student/buscar?q=zzz");

    expect(screen.getByText(EMPTY_SEARCH_MESSAGE)).toBeInTheDocument();

    const baseCalls = mockedHook.mock.calls.filter(([, filters]) => filters === undefined);
    expect(baseCalls.length).toBeGreaterThan(0);
    expect(baseCalls[baseCalls.length - 1][2]).toEqual({ enabled: false });
  });

  it("al hacer clic en una materia navega conservando los filtros", async () => {
    const user = userEvent.setup();
    mockSearch({ filtered: [tutorAna] });
    renderPage("/student/buscar?q=Ana&modality=VIRTUAL");

    await user.click(screen.getByText("Álgebra"));

    expect(currentLocation()).toContain("/student/tutores");
    expect(currentLocation()).toContain("materia=%C3%81lgebra");
    expect(currentLocation()).toContain("modality=VIRTUAL");
  });

  it("en modo tutores solo usa disponibilidad y calificación", () => {
    mockSearch({ filtered: [tutorAna] });
    renderPage("/student/buscar?q=Ana&mode=tutores&modality=VIRTUAL&daysOfWeek=MONDAY&minRating=4");

    const listCall = mockedHook.mock.calls[0];
    expect(listCall[1]).toMatchObject({
      daysOfWeek: ["MONDAY"],
      verifiedOnly: false,
      minRating: 4,
    });
    expect(listCall[1]).not.toHaveProperty("modality");
    expect(screen.queryByText("Virtual")).not.toBeInTheDocument();
  });

  it("el toggle escribe el modo en la URL", async () => {
    const user = userEvent.setup();
    mockSearch({ filtered: [tutorAna] });
    renderPage("/student/buscar?q=Ana");

    await user.click(screen.getByRole("button", { name: "Ver tutores" }));
    expect(currentLocation()).toContain("mode=tutores");

    await user.click(screen.getByRole("button", { name: "Ver materias" }));
    expect(currentLocation()).not.toContain("mode=tutores");
  });
});
