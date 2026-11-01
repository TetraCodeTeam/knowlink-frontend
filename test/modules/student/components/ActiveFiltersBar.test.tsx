import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ActiveFiltersBar from "@/modules/student/components/ActiveFiltersBar";
import { EMPTY_SEARCH_FILTERS } from "@/modules/student/interfaces/search-filters.interface";
import type { SearchFilters } from "@/modules/student/interfaces/search-filters.interface";

const filters: SearchFilters = {
  modality: "VIRTUAL",
  compensation: "PAID",
  daysOfWeek: ["MONDAY", "TUESDAY"],
  verifiedOnly: true,
  minRating: 4,
};

describe("ActiveFiltersBar", () => {
  it("no renderiza nada sin filtros", () => {
    const { container } = render(
      <ActiveFiltersBar filters={EMPTY_SEARCH_FILTERS} onRemove={vi.fn()} onClear={vi.fn()} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("muestra una chip por filtro y por día", () => {
    render(<ActiveFiltersBar filters={filters} onRemove={vi.fn()} onClear={vi.fn()} />);

    expect(screen.getByText("Virtual")).toBeInTheDocument();
    expect(screen.getByText("Pago")).toBeInTheDocument();
    expect(screen.getByText("Lunes")).toBeInTheDocument();
    expect(screen.getByText("Martes")).toBeInTheDocument();
    expect(screen.getByText("Verificado")).toBeInTheDocument();
    expect(screen.getByText("4+ ★")).toBeInTheDocument();
  });

  it("quitar una chip llama onRemove con la chip correcta", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(<ActiveFiltersBar filters={filters} onRemove={onRemove} onClear={vi.fn()} />);

    await user.click(screen.getByLabelText("Quitar filtro Virtual"));

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onRemove.mock.calls[0][0]).toMatchObject({ key: "modality-VIRTUAL" });
  });

  it("quitar un día conserva los demás", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(<ActiveFiltersBar filters={filters} onRemove={onRemove} onClear={vi.fn()} />);

    await user.click(screen.getByLabelText("Quitar filtro Lunes"));

    const next = onRemove.mock.calls[0][0].remove(filters);
    expect(next.daysOfWeek).toEqual(["TUESDAY"]);
  });

  it("'Limpiar filtros' llama onClear", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(<ActiveFiltersBar filters={filters} onRemove={vi.fn()} onClear={onClear} />);

    await user.click(screen.getByRole("button", { name: "Limpiar filtros" }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
