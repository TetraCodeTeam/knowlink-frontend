import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TutoresPorMateriaPage from "@/modules/student/pages/TutoresPorMateriaPage";
import { tutorAna, tutorCarlos } from "../../../fixtures/busqueda/tutoresDePrueba";

vi.mock("@/modules/student/hooks/useSearchTutorsAndMaterias", () => ({
  useSearchTutorsAndMaterias: vi.fn(),
}));

import { useSearchTutorsAndMaterias } from "@/modules/student/hooks/useSearchTutorsAndMaterias";

const mockedHook = vi.mocked(useSearchTutorsAndMaterias);

type HookResult = ReturnType<typeof useSearchTutorsAndMaterias>;

function hookResult(data: unknown[], isFetching = false): HookResult {
  return { data, isFetching } as unknown as HookResult;
}

function renderPage(materiaNombre = "Álgebra") {
  return render(
    <MemoryRouter initialEntries={[`/student/tutores?materia=${encodeURIComponent(materiaNombre)}`]}>
      <TutoresPorMateriaPage />
    </MemoryRouter>
  );
}

describe("TutoresPorMateriaPage", () => {
  beforeEach(() => {
    mockedHook.mockReset();
  });

  it("muestra el nombre de la materia en el título", () => {
    mockedHook.mockReturnValue(hookResult([]));
    renderPage("Álgebra");
    expect(screen.getByText(/Álgebra/)).toBeInTheDocument();
  });

  it("muestra estado de carga mientras busca", () => {
    mockedHook.mockReturnValue({ data: undefined, isFetching: true } as unknown as HookResult);
    renderPage();
    expect(screen.getByText("Buscando tutores…")).toBeInTheDocument();
  });

  it("muestra mensaje vacío cuando no hay tutores", () => {
    mockedHook.mockReturnValue(hookResult([]));
    renderPage();
    expect(
      screen.getByText("No hay tutores disponibles para esta materia todavía.")
    ).toBeInTheDocument();
  });

  it("renderiza una TutorResultCard por cada tutor", () => {
    mockedHook.mockReturnValue(hookResult([tutorAna, tutorCarlos]));
    renderPage();
    expect(screen.getByText("Ana García")).toBeInTheDocument();
    expect(screen.getByText("Carlos López")).toBeInTheDocument();
  });

  it("muestra las materias del tutor como chips", () => {
    mockedHook.mockReturnValue(hookResult([tutorAna]));
    renderPage();
    expect(screen.getByText("Álgebra")).toBeInTheDocument();
  });
});
