import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ClaimResolutionSection } from "@/modules/support/components/support-detail/ClaimResolutionSection";
import { makeClaimResolution } from "./fixtures";

describe("ClaimResolutionSection", () => {
  it("muestra el resultado a favor, la fecha y la justificación", () => {
    render(<ClaimResolutionSection resolution={makeClaimResolution({ inMyFavor: true })} />);

    expect(screen.getByText("Resolución del reclamo")).toBeInTheDocument();
    expect(screen.getByText("La resolución fue a tu favor.")).toBeInTheDocument();
    expect(
      screen.getByText(`Resuelto el ${new Date("2026-11-10T15:30:00").toLocaleString("es-AR")}`)
    ).toBeInTheDocument();
    expect(screen.getByText("Justificación del equipo académico:")).toBeInTheDocument();
    expect(screen.getByText("Se verificó la evidencia y el reclamo procede.")).toBeInTheDocument();
  });

  it("muestra el resultado en contra cuando inMyFavor es false", () => {
    render(<ClaimResolutionSection resolution={makeClaimResolution({ inMyFavor: false })} />);

    expect(screen.getByText("La resolución no fue a tu favor.")).toBeInTheDocument();
    expect(screen.queryByText("La resolución fue a tu favor.")).not.toBeInTheDocument();
  });

  it("renderiza una justificación larga completa, sin truncar", () => {
    const justification = "El equipo académico revisó el expediente completo. "
      .repeat(30)
      .slice(0, 800);

    render(<ClaimResolutionSection resolution={makeClaimResolution({ justification })} />);

    const quote = screen.getByText(justification);
    expect(quote).toBeInTheDocument();
    expect(quote).toHaveStyle({ whiteSpace: "pre-wrap", wordBreak: "break-word" });
  });
});
