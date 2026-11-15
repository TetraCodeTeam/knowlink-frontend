import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ClaimDetailContent } from "@/modules/support/components/support-detail/ClaimDetailContent";
import { makeClaimResolution, makeTutorClaimDetail } from "./fixtures";

describe("ClaimDetailContent", () => {
  it("muestra la sección de resolución cuando el reclamo tiene resolution", () => {
    render(
      <ClaimDetailContent
        claim={makeTutorClaimDetail({ status: "RESOLVED", resolution: makeClaimResolution() })}
      />
    );

    expect(screen.getByText("Resolución del reclamo")).toBeInTheDocument();
    expect(screen.getByText("La resolución fue a tu favor.")).toBeInTheDocument();
    expect(screen.getByText("Se verificó la evidencia y el reclamo procede.")).toBeInTheDocument();
  });

  it("no renderiza la sección de resolución cuando resolution es null", () => {
    render(<ClaimDetailContent claim={makeTutorClaimDetail()} />);

    expect(screen.queryByText("Resolución del reclamo")).not.toBeInTheDocument();
    expect(screen.getByText("Fase actual del reclamo")).toBeInTheDocument();
  });

  it("muestra la nota de fondos pendiente mientras el reclamo está en curso", () => {
    render(<ClaimDetailContent claim={makeTutorClaimDetail()} />);

    expect(
      screen.getByText("Los fondos se liberarán automáticamente al finalizar la revisión.")
    ).toBeInTheDocument();
  });

  it("no contradice el estado resuelto con la nota de fondos", () => {
    render(
      <ClaimDetailContent
        claim={makeTutorClaimDetail({
          status: "RESOLVED",
          funds: {
            originalAmount: 8000,
            protectedAmount: 0,
            status: "RELEASED_TO_TUTOR",
            currency: "ARS",
          },
        })}
      />
    );

    expect(screen.getByText("Fondos liberados al tutor.")).toBeInTheDocument();
    expect(
      screen.queryByText("Los fondos se liberarán automáticamente al finalizar la revisión.")
    ).not.toBeInTheDocument();
  });

  it("omite la nota de fondos si funds no indica todavía a quién se liberó", () => {
    render(
      <ClaimDetailContent
        claim={makeTutorClaimDetail({
          status: "RESOLVED",
          funds: { originalAmount: 8000, protectedAmount: 0, status: null, currency: "ARS" },
        })}
      />
    );

    expect(
      screen.queryByText("Los fondos se liberarán automáticamente al finalizar la revisión.")
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Fondos liberados/)).not.toBeInTheDocument();
  });
});
