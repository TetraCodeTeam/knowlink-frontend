import { useEffect, useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchFiltersPopover from "@/modules/student/components/SearchFiltersPopover";
import { EMPTY_SEARCH_FILTERS } from "@/modules/student/interfaces/search-filters.interface";
import type {
  SearchFilters,
  SearchMode,
} from "@/modules/student/interfaces/search-filters.interface";

interface HarnessProps {
  open: boolean;
  mode: SearchMode;
  filters: SearchFilters;
  onApply: (next: SearchFilters) => void;
  onClose: () => void;
}

function Harness(props: HarnessProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setAnchor(anchorRef.current);
  }, []);

  return (
    <>
      <button ref={anchorRef} type="button">
        Ancla
      </button>
      <SearchFiltersPopover anchorEl={anchor} {...props} />
    </>
  );
}

function renderPopover(overrides: Partial<HarnessProps> = {}) {
  const onApply = overrides.onApply ?? vi.fn();
  const onClose = overrides.onClose ?? vi.fn();
  const props: HarnessProps = {
    open: true,
    mode: "materias",
    filters: EMPTY_SEARCH_FILTERS,
    ...overrides,
    onApply,
    onClose,
  };
  const view = render(<Harness {...props} />);

  return { ...view, props, onApply, onClose };
}

const completeFilters: SearchFilters = {
  modality: "VIRTUAL",
  compensation: "PAID",
  daysOfWeek: ["MONDAY"],
  verifiedOnly: true,
  minRating: 4,
};

describe("SearchFiltersPopover", () => {
  it("en modo materias muestra las 5 secciones", () => {
    renderPopover();

    expect(screen.getByText("Filtros Avanzados")).toBeInTheDocument();
    expect(screen.getByText("Modalidad")).toBeInTheDocument();
    expect(screen.getByText("Compensación")).toBeInTheDocument();
    expect(screen.getByText("Disponibilidad")).toBeInTheDocument();
    expect(screen.getByText("Tutor Verificado")).toBeInTheDocument();
    expect(screen.getByText("Calificación Mínima")).toBeInTheDocument();
  });

  it("en modo tutores solo muestra Disponibilidad y Calificación Mínima", () => {
    renderPopover({ mode: "tutores" });

    expect(screen.getByText("Disponibilidad")).toBeInTheDocument();
    expect(screen.getByText("Calificación Mínima")).toBeInTheDocument();
    expect(screen.queryByText("Modalidad")).not.toBeInTheDocument();
    expect(screen.queryByText("Compensación")).not.toBeInTheDocument();
    expect(screen.queryByText("Tutor Verificado")).not.toBeInTheDocument();
  });

  it("la modalidad es exclusiva y se deselecciona con un segundo clic", async () => {
    const user = userEvent.setup();
    renderPopover();

    const virtual = screen.getByRole("button", { name: "Virtual" });
    const presencial = screen.getByRole("button", { name: "Presencial" });

    await user.click(virtual);
    expect(virtual).toHaveAttribute("aria-pressed", "true");

    await user.click(presencial);
    expect(presencial).toHaveAttribute("aria-pressed", "true");
    expect(virtual).toHaveAttribute("aria-pressed", "false");

    await user.click(presencial);
    expect(presencial).toHaveAttribute("aria-pressed", "false");
  });

  it("los días son multi-selección", async () => {
    const user = userEvent.setup();
    renderPopover();

    const lunes = screen.getByRole("button", { name: "Lunes" });
    const martes = screen.getByRole("button", { name: "Martes" });

    await user.click(lunes);
    await user.click(martes);

    expect(lunes).toHaveAttribute("aria-pressed", "true");
    expect(martes).toHaveAttribute("aria-pressed", "true");

    await user.click(lunes);
    expect(lunes).toHaveAttribute("aria-pressed", "false");
    expect(martes).toHaveAttribute("aria-pressed", "true");
  });

  it("las estrellas fijan la calificación y un segundo clic en el mismo valor la borra", () => {
    renderPopover();

    const four = screen.getByRole("radio", { name: "4 estrellas" });

    fireEvent.click(four, { clientX: 10, clientY: 10 });
    expect(four).toBeChecked();

    fireEvent.click(four, { clientX: 10, clientY: 10 });
    expect(four).not.toBeChecked();
  });

  it("'Aplicar Filtros' llama onApply con el borrador elegido", async () => {
    const user = userEvent.setup();
    const { onApply } = renderPopover();

    await user.click(screen.getByRole("button", { name: "Virtual" }));
    await user.click(screen.getByText("Pago"));
    fireEvent.click(screen.getByRole("radio", { name: "4 estrellas" }), {
      clientX: 10,
      clientY: 10,
    });
    await user.click(screen.getByRole("button", { name: "Aplicar Filtros" }));

    expect(onApply).toHaveBeenCalledTimes(1);
    expect(onApply).toHaveBeenCalledWith({
      modality: "VIRTUAL",
      compensation: "PAID",
      daysOfWeek: [],
      verifiedOnly: false,
      minRating: 4,
    });
  });

  it("'Limpiar Filtros' llama onApply con los filtros vacíos", async () => {
    const user = userEvent.setup();
    const { onApply } = renderPopover({ filters: completeFilters });

    await user.click(screen.getByRole("button", { name: "Limpiar Filtros" }));

    expect(onApply).toHaveBeenCalledWith(EMPTY_SEARCH_FILTERS);
  });

  it("la X cierra sin aplicar", async () => {
    const user = userEvent.setup();
    const { onApply, onClose } = renderPopover();

    await user.click(screen.getByRole("button", { name: "Cerrar filtros avanzados" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onApply).not.toHaveBeenCalled();
  });

  it("Esc cierra sin aplicar", () => {
    const { onApply, onClose } = renderPopover();

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    expect(onClose).toHaveBeenCalled();
    expect(onApply).not.toHaveBeenCalled();
  });

  it("al reabrir muestra los filtros aplicados y descarta el borrador", async () => {
    const user = userEvent.setup();
    const { rerender, props } = renderPopover({ filters: completeFilters });

    await user.click(screen.getByRole("button", { name: "Martes" }));
    expect(screen.getByRole("button", { name: "Martes" })).toHaveAttribute("aria-pressed", "true");

    rerender(<Harness {...props} open={false} />);
    rerender(<Harness {...props} open />);

    expect(screen.getByRole("button", { name: "Lunes" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Martes" })).toHaveAttribute("aria-pressed", "false");
  });
});
