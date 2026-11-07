import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TutorRegisterPage from "@/modules/auth/pages/TutorRegisterPage";

vi.mock("@/modules/auth/layouts/AuthLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/modules/auth/components/RegistrationStepper", () => ({
  default: () => null,
}));

vi.mock("@/shared/frankie/FrankieIllustration", () => ({
  default: () => null,
}));

vi.mock("@/modules/auth/components/tutor-register/TutorRegisterWizard", () => ({
  default: ({ dualRoleInstitutionId }: { dualRoleInstitutionId?: string }) => (
    <div data-testid="wizard-institution">{dualRoleInstitutionId}</div>
  ),
}));

describe("TutorRegisterPage", () => {
  it("propaga la institución del rol dual al wizard", () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/auth/register/tutor",
            state: {
              startAtStep: 2,
              career: "Medicina Veterinaria",
              institutionId: "institution-unvm",
            },
          },
        ]}
      >
        <TutorRegisterPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId("wizard-institution")).toHaveTextContent("institution-unvm");
  });
});
