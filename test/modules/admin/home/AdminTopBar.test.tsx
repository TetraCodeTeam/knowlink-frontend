import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminTopBar from "@/modules/admin/home/components/AdminTopBar";

describe("AdminTopBar", () => {
  it("muestra el saludo y el subtítulo del diseño", () => {
    render(<AdminTopBar date={new Date(2026, 5, 15)} />);

    expect(screen.getByRole("heading", { level: 1, name: "Hola, Admin" })).toBeInTheDocument();
    expect(
      screen.getByText("Resumen general y métricas de moderación en tiempo real")
    ).toBeInTheDocument();
  });

  it("muestra la fecha formateada en español", () => {
    render(<AdminTopBar date={new Date(2026, 5, 15)} />);

    expect(screen.getByText("Lunes 15 de junio, 2026")).toBeInTheDocument();
  });
});
