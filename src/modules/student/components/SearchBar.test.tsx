import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type { TutorSearchResult } from "../interfaces/tutor-search-result.interface";

vi.mock("../hooks/useSearchTutorsAndMaterias", () => ({
  useSearchTutorsAndMaterias: vi.fn(),
}));

import { useSearchTutorsAndMaterias } from "../hooks/useSearchTutorsAndMaterias";

const mockedHook = vi.mocked(useSearchTutorsAndMaterias);

function getTextContent(text: string) {
  return (_content: string, element: Element | null) =>
    element != null && element.textContent === text;
}

const SEARCH_PLACEHOLDER = "Busca tutores, materias";

type HookResult = ReturnType<typeof useSearchTutorsAndMaterias>;

function hookResult(data: TutorSearchResult[], isFetching = false): HookResult {
  return { data, isFetching } as unknown as HookResult;
}

const resultadoAlgebra: TutorSearchResult[] = [
  {
    tutorId: "t1",
    fullName: "Ana García",
    photoProfile: null,
    averageRating: 4.5,
    totalReviews: 2,
    subjects: [{ name: "Álgebra", career: "Ingeniería en Sistemas" }],
  },
];

const resultadoAna: TutorSearchResult[] = [
  {
    tutorId: "t1",
    fullName: "Ana García",
    photoProfile: null,
    averageRating: 4.5,
    totalReviews: 2,
    subjects: [{ name: "Álgebra", career: "Ingeniería en Sistemas" }],
  },
];

function renderSearchBar() {
  return render(
    <MemoryRouter>
      <SearchBar />
    </MemoryRouter>
  );
}

describe("SearchBar", () => {
  beforeEach(() => {
    useAuthStore.setState({ authResponse: undefined, isAuthenticated: false });
    mockedHook.mockReset();
  });

  it("renders the search field with its placeholder", () => {
    mockedHook.mockReturnValue(hookResult([]));
    renderSearchBar();
    expect(screen.getByPlaceholderText(SEARCH_PLACEHOLDER)).toBeInTheDocument();
  });

  it("shows dynamic suggestions (materias + tutores) while typing", async () => {
    const user = userEvent.setup();
    mockedHook.mockImplementation((query: string) =>
      hookResult(query.includes("Alge") ? resultadoAlgebra : [])
    );

    renderSearchBar();
    await user.type(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), "Alge");

    expect(await screen.findByText("Materias")).toBeInTheDocument();
    expect(screen.getByText(getTextContent("Álgebra"))).toBeInTheDocument();
    expect(screen.getByText("Tutores")).toBeInTheDocument();
    expect(screen.getByText(getTextContent("Ana García"))).toBeInTheDocument();
    expect(mockedHook).toHaveBeenCalled();
  });

  it("shows tutors matched by name", async () => {
    const user = userEvent.setup();
    mockedHook.mockImplementation((query: string) =>
      hookResult(query.includes("Ana") ? resultadoAna : [])
    );

    renderSearchBar();
    await user.type(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), "Ana");

    expect(await screen.findByText(getTextContent("Ana García"))).toBeInTheDocument();
  });

  it("shows the empty state when there are no results", async () => {
    const user = userEvent.setup();
    mockedHook.mockReturnValue(hookResult([]));

    renderSearchBar();
    await user.type(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), "zzz");

    expect(
      await screen.findByText("No se encontraron resultados para tu búsqueda")
    ).toBeInTheDocument();
  });

  it("disables the search field and shows a caption for tutor users", () => {
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
});
