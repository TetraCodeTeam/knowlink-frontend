import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SearchBar from "@/modules/student/components/SearchBar";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type { TutorSearchResult } from "@/modules/student/interfaces/tutor-search-result.interface";
import { tutorAna } from "../../../fixtures/search/testTutors";

vi.mock("@/modules/student/hooks/useSearchTutorsAndSubjects", () => ({
  useSearchTutorsAndSubjects: vi.fn(),
}));

import { useSearchTutorsAndSubjects } from "@/modules/student/hooks/useSearchTutorsAndSubjects";

const mockedHook = vi.mocked(useSearchTutorsAndSubjects);

function getTextContent(text: string) {
  return (_content: string, element: Element | null) =>
    element != null && element.textContent === text;
}

const SEARCH_PLACEHOLDER = "Busca tutores, materias";

type HookResult = ReturnType<typeof useSearchTutorsAndSubjects>;

function hookResult(data: TutorSearchResult[], isFetching = false): HookResult {
  return { data, isFetching } as unknown as HookResult;
}

function renderSearchBar() {
  return render(
    <MemoryRouter>
      <SearchBar />
    </MemoryRouter>
  );
}

describe("US-46 / CP-003 — Barra de búsqueda unificada", () => {
  beforeEach(() => {
    useAuthStore.setState({ authResponse: undefined, isAuthenticated: false });
    mockedHook.mockReset();
  });

  it("CP-003.13 — Renderiza el campo de búsqueda con su placeholder", () => {
    mockedHook.mockReturnValue(hookResult([]));
    renderSearchBar();
    expect(screen.getByPlaceholderText(SEARCH_PLACEHOLDER)).toBeInTheDocument();
  });

  it("CP-003.14 — Muestra sugerencias dinámicas (materias + tutores) al tipear", async () => {
    const user = userEvent.setup();
    mockedHook.mockImplementation((query: string) =>
      hookResult(query.includes("Alge") ? [tutorAna] : [])
    );

    renderSearchBar();
    await user.type(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), "Alge");

    expect(await screen.findByText("Materias")).toBeInTheDocument();
    expect(screen.getByText(getTextContent("Álgebra"))).toBeInTheDocument();
    expect(screen.getByText("Tutores")).toBeInTheDocument();
    expect(screen.getByText(getTextContent("Ana García"))).toBeInTheDocument();
    expect(mockedHook).toHaveBeenCalled();
  });

  it("CP-003.15 — Muestra tutores que matchean por nombre", async () => {
    const user = userEvent.setup();
    mockedHook.mockImplementation((query: string) =>
      hookResult(query.includes("Ana") ? [tutorAna] : [])
    );

    renderSearchBar();
    await user.type(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), "Ana");

    expect(await screen.findByText(getTextContent("Ana García"))).toBeInTheDocument();
  });

  it("CP-003.16 — Muestra estado vacío cuando no hay resultados", async () => {
    const user = userEvent.setup();
    mockedHook.mockReturnValue(hookResult([]));

    renderSearchBar();
    await user.type(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), "zzz");

    expect(
      await screen.findByText("No se encontraron resultados para tu búsqueda")
    ).toBeInTheDocument();
  });

  it("CP-003.17 — Deshabilita el campo y muestra caption para usuarios tutor", () => {
    useAuthStore.setState({
      authResponse: {
        userId: "u1",
        email: "tutor@test.com",
        fullName: "Tutor",
        token: "token",
        role: "TUTOR",
      },
      isAuthenticated: true,
    });
    mockedHook.mockReturnValue(hookResult([]));

    renderSearchBar();
    expect(screen.getByPlaceholderText(SEARCH_PLACEHOLDER)).toBeDisabled();
    expect(
      screen.getByText("Cambiá tu rol a alumno para buscar tutores y materias.")
    ).toBeInTheDocument();
  });

  it("CP-003.18 — Al seleccionar una materia, el panel se cierra (navega)", async () => {
    const user = userEvent.setup();
    mockedHook.mockImplementation((query: string) =>
      query.includes("Alge") ? hookResult([tutorAna]) : hookResult([])
    );

    renderSearchBar();
    await user.type(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), "Alge");

    expect(await screen.findByText(getTextContent("Álgebra"))).toBeInTheDocument();

    await user.click(screen.getByText(getTextContent("Álgebra")));

    expect(screen.queryByText("Materias")).not.toBeInTheDocument();
  });

  it("CP-003.19 — Al seleccionar un tutor, el panel se cierra (navega)", async () => {
    const user = userEvent.setup();
    mockedHook.mockImplementation((query: string) =>
      query.includes("Ana") ? hookResult([tutorAna]) : hookResult([])
    );

    renderSearchBar();
    await user.type(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), "Ana");

    expect(await screen.findByText(getTextContent("Ana García"))).toBeInTheDocument();

    await user.click(screen.getByText(getTextContent("Ana García")));

    expect(screen.queryByText("Tutores")).not.toBeInTheDocument();
  });
});
