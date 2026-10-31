import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ClaimPartyMessage from "@/modules/admin/session-claims/components/ClaimPartyMessage";
import type { AdminClaimParty } from "@/modules/admin/session-claims/interfaces/responses/admin-claim-party.response";

function makeParty(overrides: Partial<AdminClaimParty> = {}): AdminClaimParty {
  return {
    fullName: "Silvina Rubio",
    role: "TUTOR",
    message: "Esperé conectada 20 minutos.",
    ...overrides,
  };
}

describe("ClaimPartyMessage", () => {
  it("muestra el nombre, el rol y el mensaje de la parte", () => {
    render(<ClaimPartyMessage party={makeParty()} />);

    expect(screen.getByText("Silvina Rubio")).toBeInTheDocument();
    expect(screen.getByText("(Tutor)")).toBeInTheDocument();
    expect(screen.getByText("Esperé conectada 20 minutos.")).toBeInTheDocument();
  });

  it("avisa cuando la parte no dejó un mensaje", () => {
    render(
      <ClaimPartyMessage
        party={makeParty({ fullName: "Bruno Peralta", message: null, role: "STUDENT" })}
      />
    );

    expect(screen.getByText("Bruno Peralta")).toBeInTheDocument();
    expect(screen.getByText("(Alumno)")).toBeInTheDocument();
    expect(screen.getByText("No se registró un mensaje")).toBeInTheDocument();
  });
});