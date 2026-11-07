import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Step1Account from "@/modules/auth/components/tutor-register/steps/Step1Account";
import { useCareers } from "@/modules/tutors/hooks/useCareers";

vi.mock("@/modules/tutors/hooks/useInstitutions", () => ({
  useInstitutions: () => ({
    data: [
      { institutionId: "institution-utn", name: "UTN FRVM" },
      { institutionId: "institution-unvm", name: "UNVM" },
    ],
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

vi.mock("@/modules/tutors/hooks/useCareers", () => ({
  useCareers: vi.fn((institutionId?: string) => ({
    data:
      institutionId === "institution-unvm"
        ? [{ careerId: "career-vet", name: "Medicina Veterinaria" }]
        : institutionId === "institution-utn"
          ? [{ careerId: "career-civil", name: "Ingeniería Civil" }]
          : undefined,
    isLoading: false,
  })),
}));

vi.mock("@/modules/auth/api/auth.api", () => ({
  checkAvailability: vi.fn().mockResolvedValue(undefined),
}));

function renderStep(defaultValues = {}) {
  render(<Step1Account defaultValues={defaultValues} onNext={vi.fn()} onBack={vi.fn()} />);
}

function careerSelect() {
  return screen.getAllByRole("combobox")[1];
}

describe("Step1Account", () => {
  it("deshabilita la carrera hasta elegir una institución", () => {
    renderStep();

    expect(careerSelect()).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByText("Elegí tu institución primero")).toBeInTheDocument();
  });

  it("al elegir una institución muestra solo sus carreras", async () => {
    const user = userEvent.setup();
    renderStep();

    await user.click(screen.getAllByRole("combobox")[0]);
    await user.click(await screen.findByRole("option", { name: "UNVM" }));

    expect(careerSelect()).not.toHaveAttribute("aria-disabled", "true");
    await user.click(careerSelect());
    expect(await screen.findByRole("option", { name: "Medicina Veterinaria" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Ingeniería Civil" })).not.toBeInTheDocument();
  });

  it("rehidrata la institución al volver desde el paso 2", () => {
    renderStep({ institutionId: "institution-unvm", career: "Medicina Veterinaria" });

    expect(vi.mocked(useCareers)).toHaveBeenCalledWith("institution-unvm");
    expect(careerSelect()).not.toHaveAttribute("aria-disabled", "true");
    expect(careerSelect()).toHaveTextContent("Medicina Veterinaria");
  });

  it("al cambiar de institución limpia la carrera elegida", async () => {
    const user = userEvent.setup();
    renderStep({ institutionId: "institution-utn", career: "Ingeniería Civil" });

    expect(careerSelect()).toHaveTextContent("Ingeniería Civil");

    await user.click(screen.getAllByRole("combobox")[0]);
    await user.click(await screen.findByRole("option", { name: "UNVM" }));

    expect(careerSelect()).toHaveTextContent("Elegí tu carrera");
  });
});
