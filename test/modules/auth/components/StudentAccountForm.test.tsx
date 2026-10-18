import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StudentAccountForm from "@/modules/auth/components/student-register/StudentAccountForm";

vi.mock("@/modules/catalog/hooks/useInstituciones", () => ({
  useInstituciones: vi.fn(),
}));

vi.mock("@/modules/catalog/hooks/useCarrerasByInstitucion", () => ({
  useCarrerasByInstitucion: vi.fn(),
}));

vi.mock("@/modules/auth/api/auth.api", () => ({
  checkAvailability: vi.fn(),
}));

import { useInstituciones } from "@/modules/catalog/hooks/useInstituciones";
import { useCarrerasByInstitucion } from "@/modules/catalog/hooks/useCarrerasByInstitucion";

const mockedUseInstituciones = vi.mocked(useInstituciones);
const mockedUseCarrerasByInstitucion = vi.mocked(useCarrerasByInstitucion);

type HookResult = ReturnType<typeof useInstituciones>;
type CareersHookResult = ReturnType<typeof useCarrerasByInstitucion>;

const INSTITUTIONS = [
  { institutionId: "inst-utn", name: "UTN FRVM" },
  { institutionId: "inst-unvm", name: "UNVM" },
];

const UTN_CAREERS = [
  { careerId: "career-sis", name: "Ingeniería en Sistemas", type: "REGULAR" as const },
  { careerId: "career-comp", name: "Materias Compartidas", type: "COMPARTIDA" as const },
];

const UNVM_CAREERS = [
  { careerId: "career-ind", name: "Ingeniería Industrial", type: "REGULAR" as const },
];

function institutionsResult(): HookResult {
  return { data: INSTITUTIONS, isLoading: false } as unknown as HookResult;
}

function careersResult(institutionId?: string): CareersHookResult {
  const data =
    institutionId === "inst-utn"
      ? UTN_CAREERS
      : institutionId === "inst-unvm"
        ? UNVM_CAREERS
        : undefined;
  return { data, isLoading: false } as unknown as CareersHookResult;
}

function renderForm() {
  return render(
    <StudentAccountForm onSubmit={vi.fn()} onBack={vi.fn()} isPending={false} />
  );
}

describe("US-01 / CP-043 — Selección de institución en cascada en el registro de alumno", () => {
  beforeEach(() => {
    mockedUseInstituciones.mockReset();
    mockedUseCarrerasByInstitucion.mockReset();
    mockedUseInstituciones.mockReturnValue(institutionsResult());
    mockedUseCarrerasByInstitucion.mockImplementation((institutionId?: string) =>
      careersResult(institutionId)
    );
  });

  it("CP-043.1 — El selector de carrera está deshabilitado hasta elegir institución y muestra la ayuda", async () => {
    const user = userEvent.setup();
    renderForm();

    const helperTexts = await screen.findAllByText("Elegí tu institución primero");
    expect(helperTexts.length).toBeGreaterThanOrEqual(1);

    const [, careerSelect] = screen.getAllByRole("combobox");
    expect(careerSelect).toHaveAttribute("aria-disabled", "true");
    await user.click(careerSelect);
    expect(screen.queryByRole("option")).toBeNull();
  });

  it("CP-043.2 — Cambiar la institución limpia la carrera seleccionada y recarga sus carreras", async () => {
    const user = userEvent.setup();
    renderForm();

    const [institutionSelect] = screen.getAllByRole("combobox");

    await user.click(institutionSelect);
    await user.click(await screen.findByRole("option", { name: "UTN FRVM" }));

    const [, careerSelect] = screen.getAllByRole("combobox");
    await user.click(careerSelect);
    await user.click(await screen.findByRole("option", { name: "Ingeniería en Sistemas" }));
    expect(careerSelect).toHaveTextContent("Ingeniería en Sistemas");

    await user.click(institutionSelect);
    await user.click(await screen.findByRole("option", { name: "UNVM" }));

    expect(careerSelect).toHaveTextContent("Seleccioná una carrera");
    expect(mockedUseCarrerasByInstitucion).toHaveBeenCalledWith("inst-unvm");
  });

  it("CP-043.3 — No ofrece la carrera reservada como opción de carrera normal", async () => {
    const user = userEvent.setup();
    renderForm();

    const [institutionSelect] = screen.getAllByRole("combobox");
    await user.click(institutionSelect);
    await user.click(await screen.findByRole("option", { name: "UTN FRVM" }));

    const [, careerSelect] = screen.getAllByRole("combobox");
    await user.click(careerSelect);

    expect(await screen.findByRole("option", { name: "Ingeniería en Sistemas" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Materias Compartidas" })).toBeNull();
  });
});