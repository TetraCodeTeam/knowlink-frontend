import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import MaterialReportListItem from "@/modules/admin/material-reports/components/MaterialReportListItem";
import { makeMaterialReportListItem } from "./fixtures";

const NOW = new Date(2026, 9, 28, 18, 20);

function renderItem(overrides: Parameters<typeof makeMaterialReportListItem>[0] = {}) {
  const onSelect = vi.fn();
  const report = makeMaterialReportListItem(overrides);

  render(
    <ul>
      <MaterialReportListItem report={report} selected={false} onSelect={onSelect} />
    </ul>
  );

  return { onSelect };
}

describe("MaterialReportListItem", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("muestra una denuncia pendiente con acción para revisar", () => {
    const { onSelect } = renderItem();

    expect(screen.getByText("Pendiente")).toBeInTheDocument();
    expect(screen.getByText("Análisis Matemático")).toBeInTheDocument();
    expect(screen.getByText("Silvina Rubio")).toBeInTheDocument();
    expect(screen.getByText("Hace 2 horas")).toBeInTheDocument();
    expect(screen.getByLabelText("4 denuncias")).toBeInTheDocument();
    expect(screen.queryByText(/Justificación del moderador/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Revisar denuncias" }));
    expect(onSelect).toHaveBeenCalledWith("mat-1");
  });

  it("muestra al admin asignado en una denuncia en revisión", () => {
    renderItem({
      status: "IN_REVIEW",
      assignedToName: "Moderador Carlos V.",
      assignedToMe: true,
    });

    expect(screen.getByText("En revisión")).toBeInTheDocument();
    expect(screen.getByText("Asignado a: Moderador Carlos V.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver detalle" })).toBeInTheDocument();
  });

  it("explica que el contenido es válido cuando la denuncia se desestimó", () => {
    renderItem({
      status: "DISMISSED",
      resolutionNote: "El archivo no infringe derechos de autor.",
    });

    expect(screen.getByText("Desestimado")).toBeInTheDocument();
    expect(screen.getByText("Contenido válido bajo revisión académica")).toBeInTheDocument();
    expect(screen.getByText("El archivo no infringe derechos de autor.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver detalle" })).toBeInTheDocument();
  });

  it("tacha el nombre y avisa el retiro cuando el material se eliminó", () => {
    renderItem({
      status: "REMOVED",
      resolutionNote: "Se retira por infracción de copyright.",
    });

    expect(screen.getByText("Eliminado")).toBeInTheDocument();
    expect(screen.getByText("Material retirado permanentemente")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver resolución" })).toBeInTheDocument();
    expect(screen.getByText("Guía de integrales.pdf")).toHaveStyle({
      textDecoration: "line-through",
    });
  });

  it("resalta la fila seleccionada", () => {
    const report = makeMaterialReportListItem();

    render(
      <ul>
        <MaterialReportListItem report={report} selected onSelect={vi.fn()} />
      </ul>
    );

    expect(screen.getByRole("listitem", { name: report.fileName })).toHaveStyle({
      backgroundColor: "#EEF2FF",
    });
  });

  it("muestra un texto de reemplazo si no hay justificación", () => {
    renderItem({ status: "DISMISSED", resolutionNote: null });

    expect(screen.getByText("Sin justificación registrada.")).toBeInTheDocument();
  });
});
