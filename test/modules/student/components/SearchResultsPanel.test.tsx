import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchResultsPanel, {
  SearchResultsPanelProps,
} from "@/modules/student/components/SearchResultsPanel";
import { materiasIngenieria, tutoresDePrueba } from "../../../fixtures/busqueda/tutoresDePrueba";

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
      materias={materiasIngenieria}
      tutors={tutoresDePrueba}
      loading={false}
      onSelectMateria={onSelectMateria}
      onSelectTutor={onSelectTutor}
      {...props}
    />
  );
  return { onSelectMateria, onSelectTutor };
}

describe("US-46 / CP-003 — Panel de resultados de búsqueda", () => {
  it("CP-003.05 — Muestra mensaje de carga mientras se busca", () => {
    renderPanel({ loading: true });
    expect(screen.getByText("Buscando…")).toBeInTheDocument();
  });

  it("CP-003.06 — Muestra estado vacío cuando no hay resultados", () => {
    renderPanel({ materias: [], tutors: [] });
    expect(screen.getByText("No se encontraron resultados para tu búsqueda")).toBeInTheDocument();
  });

  it("CP-003.07 — Renderiza secciones Materias y Tutores con sus filas", () => {
    renderPanel();
    expect(screen.getByText("Materias")).toBeInTheDocument();
    expect(screen.getByText("Tutores")).toBeInTheDocument();
    expect(screen.getByText(getTextContent("Álgebra"))).toBeInTheDocument();
    expect(screen.getByText(getTextContent("Física"))).toBeInTheDocument();
    expect(screen.getByText(getTextContent("Ana García"))).toBeInTheDocument();
    expect(screen.getByText(getTextContent("Carlos López"))).toBeInTheDocument();
  });

  it("CP-003.08 — Muestra rating cuando existe y fallback cuando no", () => {
    renderPanel();
    expect(screen.getByText("4,5")).toBeInTheDocument();
    expect(screen.getByText("Sin reseñas aún")).toBeInTheDocument();
  });

  it("CP-003.09 — Llama a onSelectMateria al hacer click en una materia", async () => {
    const user = userEvent.setup();
    const { onSelectMateria } = renderPanel();
    await user.click(screen.getByText(getTextContent("Álgebra")));
    expect(onSelectMateria).toHaveBeenCalledWith("Álgebra");
  });

  it("CP-003.10 — Llama a onSelectTutor al hacer click en un tutor", async () => {
    const user = userEvent.setup();
    const { onSelectTutor } = renderPanel();
    await user.click(screen.getByText(getTextContent("Ana García")));
    expect(onSelectTutor).toHaveBeenCalledWith("t1");
  });

  it("CP-003.11 — No renderiza sección Materias cuando no hay materias", () => {
    renderPanel({ materias: [], tutors: tutoresDePrueba });
    expect(screen.queryByText("Materias")).toBeNull();
    expect(screen.getByText("Tutores")).toBeInTheDocument();
  });

  it("CP-003.12 — No renderiza sección Tutores cuando no hay tutores", () => {
    renderPanel({ materias: materiasIngenieria, tutors: [] });
    expect(screen.getByText("Materias")).toBeInTheDocument();
    expect(screen.queryByText("Tutores")).toBeNull();
  });
});
