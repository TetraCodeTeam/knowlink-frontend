import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import PerformancePanel from "@/modules/admin/home/components/PerformancePanel";
import type { PerformanceSummary } from "@/modules/admin/home/interfaces/responses/performance-summary.response";
import type { DashboardRange } from "@/modules/admin/types/dashboard-range.type";

const PERFORMANCE: PerformanceSummary = {
  avgResolutionHours: 3.8,
  avgResolutionDeltaPct: 18,
  unresolvedPct: 8.2,
  unresolvedLevel: "UNDER_CONTROL",
  volumeSplit: { claimsPct: 58, reportsPct: 42 },
};

function renderPanel(
  performance: PerformanceSummary = PERFORMANCE,
  range: DashboardRange = "WEEK"
) {
  const onRangeChange = vi.fn();

  render(
    <PerformancePanel performance={performance} range={range} onRangeChange={onRangeChange} />
  );

  return { onRangeChange };
}

describe("PerformancePanel", () => {
  it("muestra el TTR, las tareas sin resolver y la distribución", () => {
    renderPanel();

    expect(
      screen.getByRole("heading", { name: "Rendimiento y Salud del Servicio" })
    ).toBeInTheDocument();
    expect(screen.getByText("Eficiencia operativa y tiempos de respuesta")).toBeInTheDocument();
    expect(screen.getByText("3.8h")).toBeInTheDocument();
    expect(screen.getByText("+18% más rápido")).toBeInTheDocument();
    expect(screen.getByText("8.2%")).toBeInTheDocument();
    expect(screen.getByText("Bajo control")).toBeInTheDocument();
    expect(screen.getByText("Total: 100%")).toBeInTheDocument();
    expect(screen.getByText("58%")).toBeInTheDocument();
    expect(screen.getByText("42%")).toBeInTheDocument();
  });

  it("marca la opción activa y notifica el cambio de rango", () => {
    const { onRangeChange } = renderPanel();

    expect(screen.getByRole("button", { name: "Esta semana" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    fireEvent.click(screen.getByRole("button", { name: "30 días" }));

    expect(onRangeChange).toHaveBeenCalledWith("MONTH");
  });

  it("respeta el rango recibido por prop", () => {
    renderPanel(PERFORMANCE, "MONTH");

    expect(screen.getByRole("button", { name: "30 días" })).toHaveAttribute("aria-pressed", "true");
  });

  it("describe un delta negativo como más lento", () => {
    renderPanel({ ...PERFORMANCE, avgResolutionDeltaPct: -10 });

    expect(screen.getByText("10% más lento")).toBeInTheDocument();
  });

  it("no muestra delta sin base de comparación", () => {
    renderPanel({ ...PERFORMANCE, avgResolutionDeltaPct: null });

    expect(screen.queryByText(/más rápido|más lento/)).not.toBeInTheDocument();
  });

  it("muestra un guion cuando no hay horas de resolución", () => {
    renderPanel({ ...PERFORMANCE, avgResolutionHours: null });

    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("cambia la etiqueta según el nivel del backend", () => {
    renderPanel({ ...PERFORMANCE, unresolvedLevel: "ACCEPTABLE" });

    expect(screen.getByText("Aceptable")).toBeInTheDocument();
  });

  it("marca crítico cuando el backend lo indica", () => {
    renderPanel({ ...PERFORMANCE, unresolvedLevel: "CRITICAL" });

    expect(screen.getByText("Crítico")).toBeInTheDocument();
  });

  it("muestra el indicador de actualización al refrescar", () => {
    render(
      <PerformancePanel performance={PERFORMANCE} range="WEEK" onRangeChange={vi.fn()} isFetching />
    );

    expect(
      screen.getByRole("progressbar", { name: "Actualizando rendimiento" })
    ).toBeInTheDocument();
  });
});
