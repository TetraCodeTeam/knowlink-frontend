import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StudentAccountForm from "@/modules/auth/components/student-register/StudentAccountForm";

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

function renderForm() {
  const onSubmit = vi.fn();
  render(<StudentAccountForm onSubmit={onSubmit} onBack={vi.fn()} isPending={false} />);
  return { onSubmit };
}

function institutionSelect() {
  return screen.getAllByRole("combobox")[0];
}

function careerSelect() {
  return screen.getAllByRole("combobox")[1];
}

async function chooseInstitution(user: ReturnType<typeof userEvent.setup>, name: string) {
  await user.click(institutionSelect());
  await user.click(await screen.findByRole("option", { name }));
}

async function chooseCareer(user: ReturnType<typeof userEvent.setup>, name: string) {
  await user.click(careerSelect());
  await user.click(await screen.findByRole("option", { name }));
}

describe("StudentAccountForm", () => {
  it("deshabilita la carrera hasta elegir una institución", () => {
    renderForm();

    expect(careerSelect()).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByText("Elegí tu institución primero")).toBeInTheDocument();
  });

  it("al elegir una institución muestra solo sus carreras", async () => {
    const user = userEvent.setup();
    renderForm();

    await chooseInstitution(user, "UNVM");

    expect(careerSelect()).not.toHaveAttribute("aria-disabled", "true");
    await user.click(careerSelect());
    expect(await screen.findByRole("option", { name: "Medicina Veterinaria" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Ingeniería Civil" })).not.toBeInTheDocument();
  });

  it("al cambiar de institución limpia la carrera elegida", async () => {
    const user = userEvent.setup();
    renderForm();

    await chooseInstitution(user, "UTN FRVM");
    await chooseCareer(user, "Ingeniería Civil");
    expect(careerSelect()).toHaveTextContent("Ingeniería Civil");

    await chooseInstitution(user, "UNVM");

    expect(careerSelect()).toHaveTextContent("Elegí tu carrera");
  });

  it("envía la institución y la carrera al confirmar el registro", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    await user.type(screen.getByPlaceholderText("Nombre"), "Ana");
    await user.type(screen.getByPlaceholderText("Apellido"), "García");
    await chooseInstitution(user, "UNVM");
    await chooseCareer(user, "Medicina Veterinaria");
    await user.type(screen.getByPlaceholderText("+54 9 3534138xxx"), "3534123456");
    await user.type(screen.getByPlaceholderText("43606xxx"), "40123456");

    await user.click(screen.getByRole("button", { name: /Finalizar registro/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        institutionId: "institution-unvm",
        career: "Medicina Veterinaria",
      })
    );
  });
});
