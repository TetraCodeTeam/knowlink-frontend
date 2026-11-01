import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SessionClaimListItem from "@/modules/admin/session-claims/components/SessionClaimListItem";
import { makeSessionClaimListItem } from "./fixtures";

function renderItem(overrides: Parameters<typeof makeSessionClaimListItem>[0] = {}) {
  const onSelect = vi.fn();
  const claim = makeSessionClaimListItem(overrides);

  render(
    <ul>
      <SessionClaimListItem claim={claim} selected={false} onSelect={onSelect} />
    </ul>
  );

  return { onSelect };
}

describe("SessionClaimListItem", () => {
  it("muestra un reclamo pendiente con sus partes, fecha y acción", () => {
    const { onSelect } = renderItem();

    expect(screen.getByText("Pendiente")).toBeInTheDocument();
    expect(screen.getByText("Análisis Matemático")).toBeInTheDocument();
    expect(screen.getByText("Silvina Rubio (Tutor)")).toBeInTheDocument();
    expect(screen.getByText("Bruno Peralta (Alumno)")).toBeInTheDocument();
    expect(screen.getByText("Sesión del 22 de julio")).toBeInTheDocument();
    expect(screen.queryByText(/Asignado a:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Justificación del administrador/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Revisar" }));
    expect(onSelect).toHaveBeenCalledWith("claim-1");
  });

  it("muestra al admin asignado cuando el reclamo está en revisión", () => {
    renderItem({
      status: "IN_REVIEW",
      assignedToName: "Moderador Carlos V.",
      assignedToMe: true,
    });

    expect(screen.getByText("En revisión")).toBeInTheDocument();
    expect(screen.getByText("Asignado a: Moderador Carlos V.")).toBeInTheDocument();
  });

  it("muestra la justificación del administrador en un reclamo resuelto", () => {
    renderItem({
      status: "RESOLVED",
      resolutionJustification: "Se verificó la asistencia del alumno.",
    });

    expect(screen.getByText("Resuelto")).toBeInTheDocument();
    expect(screen.getByText("Justificación del administrador:")).toBeInTheDocument();
    expect(screen.getByText("Se verificó la asistencia del alumno.")).toBeInTheDocument();
  });

  it("resalta la fila seleccionada sin tachar el título", () => {
    const claim = makeSessionClaimListItem({ status: "RESOLVED" });

    render(
      <ul>
        <SessionClaimListItem claim={claim} selected onSelect={vi.fn()} />
      </ul>
    );

    const row = screen.getByRole("listitem", { name: claim.subjectName });
    expect(row).toHaveStyle({ backgroundColor: "#EEF2FF" });
    expect(screen.getByText("Análisis Matemático")).not.toHaveStyle({
      textDecoration: "line-through",
    });
  });
});