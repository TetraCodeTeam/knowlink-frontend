import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Step2AcademicProfile from "@/modules/auth/components/tutor-register/steps/Step2AcademicProfile";
import { useBasicSubjects } from "@/modules/tutors/hooks/useBasicSubjects";
import { useCareers } from "@/modules/tutors/hooks/useCareers";
import { useCareerSubjects } from "@/modules/tutors/hooks/useCareerSubjects";

vi.mock("@/modules/tutors/hooks/useCareers", () => ({
  useCareers: vi.fn(() => ({
    data: [{ careerId: "career-civil", name: "Ingeniería Civil" }],
    isLoading: false,
  })),
}));

vi.mock("@/modules/tutors/hooks/useBasicSubjects", () => ({
  useBasicSubjects: vi.fn(() => ({
    data: [{ subjectId: "shared-1", name: "Análisis Matemático", isBasic: true }],
    isLoading: false,
  })),
}));

vi.mock("@/modules/tutors/hooks/useCareerSubjects", () => ({
  useCareerSubjects: vi.fn(() => ({
    data: [{ subjectId: "subject-1", name: "Estática", isBasic: false }],
    isLoading: false,
  })),
}));

function renderStep() {
  render(
    <Step2AcademicProfile
      career="Ingeniería Civil"
      institutionId="institution-utn"
      defaultValues={{}}
      onNext={vi.fn()}
      onBack={vi.fn()}
    />
  );
}

describe("Step2AcademicProfile", () => {
  it("resuelve la carrera y las materias con la institución recibida", () => {
    renderStep();

    expect(vi.mocked(useCareers)).toHaveBeenCalledWith("institution-utn");
    expect(vi.mocked(useBasicSubjects)).toHaveBeenCalledWith("institution-utn");
    expect(vi.mocked(useCareerSubjects)).toHaveBeenCalledWith("career-civil");
  });

  it("el switch Básica cambia a las materias compartidas de la institución", async () => {
    const user = userEvent.setup();
    renderStep();

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "Estática" }));

    await user.click(screen.getAllByRole("switch")[0]);

    await user.click(screen.getByRole("combobox"));
    expect(await screen.findByRole("option", { name: "Análisis Matemático" })).toBeInTheDocument();
  });

  it("el precio por hora usa el campo compartido: sin paso forzado, mínimo 1 y admite centavos", async () => {
    const user = userEvent.setup();
    renderStep();

    // Por defecto la materia es gratuita: el campo de precio aparece al desactivar «Gratis».
    expect(screen.queryByPlaceholderText("Ej. 15000")).not.toBeInTheDocument();
    await user.click(screen.getAllByRole("switch")[1]);

    const price = await screen.findByPlaceholderText("Ej. 15000");
    expect(price).toHaveAttribute("type", "number");
    expect(price).toHaveAttribute("step", "any");
    expect(price).toHaveAttribute("min", "1");

    await user.type(price, "15250.5");
    expect(price).toHaveValue(15250.5);
  });
});
