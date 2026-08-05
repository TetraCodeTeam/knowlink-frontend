import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchResultsPanel, { SearchResultsPanelProps } from "./SearchResultsPanel";
import type {
  SubjectSummary,
  TutorSearchResult,
} from "../interfaces/tutor-search-result.interface";

const materias: SubjectSummary[] = [
  { name: "Álgebra", career: "Ingeniería en Sistemas" },
  { name: "Física", career: "Ingeniería en Sistemas" },
];

const tutores: TutorSearchResult[] = [
  {
    tutorId: "t1",
    fullName: "Ana García",
    photoProfile: null,
    averageRating: 4.5,
    totalReviews: 2,
    subjects: [{ name: "Álgebra", career: "Ingeniería en Sistemas" }],
  },
  {
    tutorId: "t2",
    fullName: "Carlos López",
    photoProfile: null,
    averageRating: null,
    totalReviews: 0,
    subjects: [{ name: "Física", career: "Ingeniería en Sistemas" }],
  },
];

function getTextContent(text: string) {
  return (_content: string, element: Element | null) =>
    element != null && element.textContent === text;
}

function renderPanel(props: Partial<SearchResultsPanelProps> = {}) {
  const onSelectMateria = vi.fn();
  const onSelectTutor = vi.fn();
  render(
    <SearchResultsPanel
      query="a"
      materias={materias}
      tutors={tutores}
      loading={false}
      onSelectMateria={onSelectMateria}
      onSelectTutor={onSelectTutor}
      {...props}
    />
  );
  return { onSelectMateria, onSelectTutor };
}

describe("SearchResultsPanel", () => {
  it("shows loading message while fetching", () => {
    renderPanel({ loading: true });
    expect(screen.getByText("Buscando…")).toBeInTheDocument();
  });

  it("shows empty state when there are no results", () => {
    renderPanel({ materias: [], tutors: [] });
    expect(screen.getByText("No se encontraron resultados para tu búsqueda")).toBeInTheDocument();
  });

  it("renders Materias and Tutores sections with their rows", () => {
    renderPanel();
    expect(screen.getByText("Materias")).toBeInTheDocument();
    expect(screen.getByText("Tutores")).toBeInTheDocument();
    expect(screen.getByText(getTextContent("Álgebra"))).toBeInTheDocument();
    expect(screen.getByText(getTextContent("Física"))).toBeInTheDocument();
    expect(screen.getByText(getTextContent("Ana García"))).toBeInTheDocument();
    expect(screen.getByText(getTextContent("Carlos López"))).toBeInTheDocument();
  });

  it("shows rating when present and fallback otherwise", () => {
    renderPanel();
    expect(screen.getByText("4,5")).toBeInTheDocument();
    expect(screen.getByText("Sin reseñas aún")).toBeInTheDocument();
  });

  it("calls onSelectMateria when a materia is clicked", async () => {
    const user = userEvent.setup();
    const { onSelectMateria } = renderPanel();
    await user.click(screen.getByText(getTextContent("Álgebra")));
    expect(onSelectMateria).toHaveBeenCalledWith("Álgebra");
  });

  it("calls onSelectTutor when a tutor is clicked", async () => {
    const user = userEvent.setup();
    const { onSelectTutor } = renderPanel();
    await user.click(screen.getByText(getTextContent("Ana García")));
    expect(onSelectTutor).toHaveBeenCalledWith("t1");
  });
});
