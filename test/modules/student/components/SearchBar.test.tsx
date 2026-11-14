import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import SearchBar from "@/modules/student/components/SearchBar";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type {
  SubjectSummary,
  TutorSearchResult,
} from "@/modules/student/interfaces/tutor-search-result.interface";
import { tutorAna } from "../../../fixtures/busqueda/tutoresDePrueba";

vi.mock("@/modules/student/hooks/useSearchTutorsAndMaterias", () => ({
  useSearchTutorsAndMaterias: vi.fn(),
}));

import { useSearchTutorsAndMaterias } from "@/modules/student/hooks/useSearchTutorsAndMaterias";

const mockedHook = vi.mocked(useSearchTutorsAndMaterias);

vi.mock("@/modules/student/hooks/useSearchSubjects", () => ({
  useSearchSubjects: vi.fn(),
}));

import { useSearchSubjects } from "@/modules/student/hooks/useSearchSubjects";

const mockedSubjectsHook = vi.mocked(useSearchSubjects);

function getTextContent(text: string) {
  return (_content: string, element: Element | null) =>
    element != null && element.textContent === text;
}

const SEARCH_PLACEHOLDER = "Busca tutores, materias";

type HookResult = ReturnType<typeof useSearchTutorsAndMaterias>;

function hookResult(data: TutorSearchResult[], isFetching = false): HookResult {
  return { data, isFetching } as unknown as HookResult;
}

type SubjectsHookResult = ReturnType<typeof useSearchSubjects>;

function subjectsResult(data: SubjectSummary[], isFetching = false): SubjectsHookResult {
  return { data, isFetching } as unknown as SubjectsHookResult;
}

function tutor(id: string, fullName: string): TutorSearchResult {
  return {
    tutorId: id,
    fullName,
    photoProfile: null,
    averageRating: null,
    totalReviews: 0,
    subjects: [],
  };
}

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
}

function renderSearchBar(initialEntries: string[] = ["/"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SearchBar />
      <LocationProbe />
    </MemoryRouter>
  );
}

describe("US-46 / CP-003 — Barra de búsqueda unificada", () => {
  beforeEach(() => {
    useAuthStore.setState({ authResponse: undefined, isAuthenticated: false });
    mockedHook.mockReset();
    mockedSubjectsHook.mockReset();
    mockedSubjectsHook.mockReturnValue(subjectsResult([]));
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
    mockedSubjectsHook.mockImplementation((query: string) =>
      subjectsResult(
        query.includes("Alge") ? [{ name: "Álgebra", career: "Ingeniería en Sistemas" }] : []
      )
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
    mockedSubjectsHook.mockImplementation((query: string) =>
      subjectsResult(
        query.includes("Alge") ? [{ name: "Álgebra", career: "Ingeniería en Sistemas" }] : []
      )
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
  it("US-06 — Con materias en el catálogo y sin tutores muestra solo Materias", async () => {
    const user = userEvent.setup();
    mockedHook.mockReturnValue(hookResult([]));
    mockedSubjectsHook.mockReturnValue(
      subjectsResult([{ name: "Álgebra", career: "Ingeniería en Sistemas" }])
    );

    renderSearchBar();
    await user.type(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), "alg");

    expect(await screen.findByText("Materias")).toBeInTheDocument();
    expect(screen.queryByText("Tutores")).toBeNull();
    expect(screen.queryByText("No se encontraron resultados para tu búsqueda")).toBeNull();
  });

  it("US-06 — Lista los tutores en el orden que devuelve el backend", async () => {
    const user = userEvent.setup();
    mockedHook.mockReturnValue(
      hookResult([
        tutor("t1", "Agustina Díaz"),
        tutor("t2", "Ana López"),
        tutor("t3", "Claudia Pereyra"),
        tutor("t4", "Elena Ruiz"),
      ])
    );

    renderSearchBar();
    await user.type(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), "a");

    expect(screen.getAllByRole("button").map((element) => element.textContent)).toEqual([
      "AAgustina DíazSin reseñas aún",
      "AAna LópezSin reseñas aún",
      "CClaudia PereyraSin reseñas aún",
      "EElena RuizSin reseñas aún",
    ]);
  });

  it("US-06 — No reordena lo que manda el backend (tutores ni materias)", async () => {
    const user = userEvent.setup();
    mockedHook.mockReturnValue(hookResult([tutor("t3", "Elena Ruiz"), tutor("t1", "Agustina Díaz")]));
    mockedSubjectsHook.mockReturnValue(
      subjectsResult([
        { name: "Zoología", career: "Ingeniería en Sistemas" },
        { name: "Álgebra", career: "Ingeniería en Sistemas" },
      ])
    );

    renderSearchBar();
    await user.type(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), "a");

    const elena = screen.getByText(getTextContent("Elena Ruiz"));
    const agustina = screen.getByText(getTextContent("Agustina Díaz"));
    const zoologia = screen.getByText(getTextContent("Zoología"));
    const algebra = screen.getByText(getTextContent("Álgebra"));

    // Si el frontend reordenara alfabéticamente, Agustina vendría antes que
    // Elena y Álgebra antes que Zoología.
    expect(elena.compareDocumentPosition(agustina) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(zoologia.compareDocumentPosition(algebra) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("US-06 — Un fallo del catálogo no oculta la sección Tutores", async () => {
    const user = userEvent.setup();
    mockedHook.mockReturnValue(hookResult([tutorAna]));
    mockedSubjectsHook.mockReturnValue({
      data: undefined,
      isFetching: false,
      isError: true,
    } as unknown as SubjectsHookResult);

    renderSearchBar();
    await user.type(screen.getByPlaceholderText(SEARCH_PLACEHOLDER), "alg");

    expect(await screen.findByText("Tutores")).toBeInTheDocument();
    expect(screen.getByText(getTextContent("Ana García"))).toBeInTheDocument();
    expect(screen.queryByText("Materias")).toBeNull();
  });

});

describe("US-49 — botón de filtros en la barra", () => {
  beforeEach(() => {
    useAuthStore.setState({ authResponse: undefined, isAuthenticated: false });
    mockedHook.mockReset();
    mockedSubjectsHook.mockReset();
    mockedSubjectsHook.mockReturnValue(subjectsResult([]));
    mockedHook.mockReturnValue(hookResult([]));
  });

  it("no muestra el ícono fuera de las rutas de búsqueda", () => {
    renderSearchBar(["/student/home"]);

    expect(screen.queryByRole("button", { name: "Filtros avanzados" })).not.toBeInTheDocument();
  });

  it("muestra el ícono en /student/buscar", () => {
    renderSearchBar(["/student/buscar?q=Ana"]);

    expect(screen.getByRole("button", { name: "Filtros avanzados" })).toBeInTheDocument();
  });

  it("muestra el ícono en /student/tutores", () => {
    renderSearchBar(["/student/tutores?materia=%C3%81lgebra"]);

    expect(screen.getByRole("button", { name: "Filtros avanzados" })).toBeInTheDocument();
  });

  it("no muestra el ícono en modo TUTOR", () => {
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

    renderSearchBar(["/student/buscar?q=Ana"]);

    expect(screen.queryByRole("button", { name: "Filtros avanzados" })).not.toBeInTheDocument();
  });

  it("'Aplicar' escribe los params en la URL conservando q", async () => {
    const user = userEvent.setup();
    renderSearchBar(["/student/buscar?q=Sistemas"]);

    await user.click(screen.getByRole("button", { name: "Filtros avanzados" }));
    await user.click(screen.getByRole("button", { name: "Virtual" }));
    await user.click(screen.getByRole("button", { name: "Aplicar Filtros" }));

    const location = screen.getByTestId("location").textContent ?? "";
    expect(location).toContain("q=Sistemas");
    expect(location).toContain("modality=VIRTUAL");
  });
});
