import { useState } from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PriceField from "@/shared/components/PriceField";

function ControlledPrice({ initial = "" }: { initial?: string }) {
  const [price, setPrice] = useState(initial);
  return (
    <PriceField
      value={price}
      onChange={(event) => setPrice(event.target.value)}
      slotProps={{ htmlInput: { "aria-label": "Precio por hora" } }}
    />
  );
}

/** Texto de todas las reglas CSS que emotion inyectó en la página. */
function injectedCss(): string {
  return Array.from(document.querySelectorAll("style"))
    .map((style) => style.textContent ?? "")
    .join("\n");
}

describe("PriceField", () => {
  it("es un campo numérico sin paso forzado y con teclado decimal", () => {
    render(<PriceField slotProps={{ htmlInput: { "aria-label": "Precio" } }} />);

    const input = screen.getByLabelText("Precio");
    expect(input).toHaveAttribute("type", "number");
    // Con "0.01" (o 1) las flechas y la rueda sumaban de a centésimos: no hay paso que cumplir.
    expect(input).toHaveAttribute("step", "any");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("inputmode", "decimal");
  });

  it("respeta lo que cada formulario define para el input y no pierde los valores por defecto", () => {
    render(<PriceField slotProps={{ htmlInput: { min: 1, "aria-label": "Precio" } }} />);

    const input = screen.getByLabelText("Precio");
    expect(input).toHaveAttribute("min", "1");
    expect(input).toHaveAttribute("step", "any");
  });

  it("oculta las flechitas del navegador", () => {
    render(<PriceField slotProps={{ htmlInput: { "aria-label": "Precio" } }} />);

    const css = injectedCss();
    expect(css).toMatch(/spin-button/);
    expect(css).toMatch(/appearance:\s*none/);
    expect(css).toMatch(/appearance:\s*textfield/);
  });

  it("acepta centavos al escribir", async () => {
    const user = userEvent.setup();
    render(<ControlledPrice />);

    await user.type(screen.getByLabelText("Precio por hora"), "15250.5");

    expect(screen.getByLabelText("Precio por hora")).toHaveValue(15250.5);
  });

  it("la rueda del mouse no cambia el valor: suelta el foco del campo", async () => {
    const user = userEvent.setup();
    render(<ControlledPrice initial="3000" />);
    const input = screen.getByLabelText("Precio por hora");
    await user.click(input);
    expect(input).toHaveFocus();

    fireEvent.wheel(input, { deltaY: -100 });

    expect(input).not.toHaveFocus();
    expect(input).toHaveValue(3000);
  });

  it("acepta un sx del formulario sin perder el estilo propio (objeto o arreglo)", () => {
    const { rerender } = render(
      <PriceField sx={{ width: 160 }} slotProps={{ htmlInput: { "aria-label": "Precio" } }} />
    );
    expect(screen.getByLabelText("Precio")).toBeInTheDocument();

    rerender(
      <PriceField
        sx={[{ width: 160 }, { mt: 1 }]}
        slotProps={{ htmlInput: { "aria-label": "Precio" } }}
      />
    );
    expect(screen.getByLabelText("Precio")).toBeInTheDocument();
    expect(injectedCss()).toMatch(/spin-button/);
  });

  it("se puede deshabilitar como cualquier campo (ej. con Gratis)", () => {
    render(<PriceField disabled slotProps={{ htmlInput: { "aria-label": "Precio" } }} />);

    expect(screen.getByLabelText("Precio")).toBeDisabled();
  });
});
