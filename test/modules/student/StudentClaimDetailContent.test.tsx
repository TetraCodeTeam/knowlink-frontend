import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StudentClaimDetailContent } from "@/modules/student/support/components/support-detail/StudentClaimDetailContent";
import { makeClaimResolution, makeStudentClaimDetail } from "../support/fixtures";

describe("StudentClaimDetailContent", () => {
  it("muestra la sección de resolución desde la perspectiva del alumno", () => {
    render(
      <StudentClaimDetailContent
        claim={makeStudentClaimDetail({
          status: "RESOLVED",
          resolution: makeClaimResolution({ favoredParty: "STUDENT", inMyFavor: true }),
        })}
      />
    );

    expect(screen.getByText("Resolución del reclamo")).toBeInTheDocument();
    expect(screen.getByText("La resolución fue a tu favor.")).toBeInTheDocument();
    expect(screen.getByText("Se verificó la evidencia y el reclamo procede.")).toBeInTheDocument();
  });

  it("no renderiza la sección de resolución cuando resolution es null", () => {
    render(<StudentClaimDetailContent claim={makeStudentClaimDetail()} />);

    expect(screen.queryByText("Resolución del reclamo")).not.toBeInTheDocument();
    expect(screen.getByText("Fase actual del reclamo")).toBeInTheDocument();
  });

  it("muestra la nota de fondos pendiente mientras el reclamo está en curso", () => {
    render(<StudentClaimDetailContent claim={makeStudentClaimDetail()} />);

    expect(
      screen.getByText("Los fondos se liberarán automáticamente al finalizar la revisión.")
    ).toBeInTheDocument();
  });

  it("no contradice el estado resuelto con la nota de fondos", () => {
    render(
      <StudentClaimDetailContent
        claim={makeStudentClaimDetail({
          status: "RESOLVED",
          funds: {
            originalAmount: 8000,
            protectedAmount: 0,
            protectedPercentage: 0,
            status: "REFUNDED_TO_STUDENT",
            retained: false,
            currency: "ARS",
          },
        })}
      />
    );

    expect(screen.getByText("Fondos liberados al alumno.")).toBeInTheDocument();
    expect(
      screen.queryByText("Los fondos se liberarán automáticamente al finalizar la revisión.")
    ).not.toBeInTheDocument();
  });
});
