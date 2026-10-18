import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import SubjectCreateForm from "@/modules/catalog/components/SubjectCreateForm";

vi.mock("@/modules/catalog/hooks/useCarrerasByInstitucion", () => ({
  useCarrerasByInstitucion: vi.fn(),
}));

vi.mock("@/modules/catalog/hooks/useCreateSubject", () => ({
  useCreateSubject: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import { useCarrerasByInstitucion } from "@/modules/catalog/hooks/useCarrerasByInstitucion";
import { useCreateSubject } from "@/modules/catalog/hooks/useCreateSubject";
import { toast } from "sonner";

const mockedUseCarrerasByInstitucion = vi.mocked(useCarrerasByInstitucion);
const mockedUseCreateSubject = vi.mocked(useCreateSubject);
const mockedCreateSubject = vi.fn();
const mockedToast = vi.mocked(toast);

type CareersHookResult = ReturnType<typeof useCarrerasByInstitucion>;

const CAREERS = [
  { careerId: "career-sis", name: "Ingeniería en Sistemas", type: "REGULAR" as const },
  { careerId: "career-ind", name: "Ingeniería Industrial", type: "REGULAR" as const },
  { careerId: "career-comp", name: "Materias Compartidas", type: "COMPARTIDA" as const },
];

function axiosError(status: number, data: unknown): unknown {
  return Object.assign(new Error(`Request failed with status code ${status}`), {
    isAxiosError: true,
    response: { status, data },
  });
}

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
}

function renderForm() {
  return render(
    <MemoryRouter initialEntries={["/admin/catalogo"]}>
      <LocationDisplay />
      <SubjectCreateForm institutionId="inst-utn" />
    </MemoryRouter>
  );
}

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText("Ej. Análisis Matemático I"), "Análisis Matemático I");
  await user.click(screen.getByRole("combobox"));
  await user.click(await screen.findByRole("option", { name: "Ingeniería en Sistemas" }));
  await user.keyboard("{Escape}");
  await user.click(await screen.findByRole("button", { name: "Crear materia" }));
}

describe("US-43 — Alta de materia y manejo del 409 de materia duplicada", () => {
  beforeEach(() => {
    mockedUseCarrerasByInstitucion.mockReset();
    mockedUseCreateSubject.mockReset();
    mockedCreateSubject.mockReset();
    vi.mocked(toast.error).mockReset();
    vi.mocked(toast.success).mockReset();
    mockedUseCarrerasByInstitucion.mockReturnValue({
      data: CAREERS,
      isLoading: false,
    } as unknown as CareersHookResult);
    mockedUseCreateSubject.mockReturnValue({
      createSubject: mockedCreateSubject,
      isPending: false,
    });
  });

  it("muestra la carrera reservada etiquetada como Transversal, nunca con el nombre técnico del enum", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("combobox"));

    expect(
      await screen.findByRole("option", { name: "Materias Compartidas (Transversal)" })
    ).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("option", { name: "COMPARTIDA" })).toBeNull();
  });

  it("ante un 409 ofrece enlace directo a Editar asociaciones y no muestra un error genérico", async () => {
    const user = userEvent.setup();
    mockedCreateSubject.mockRejectedValue(
      axiosError(409, {
        error: "MATERIA_DUPLICADA",
        message: "Ya existe una materia con ese nombre en esta institución. ¿Querés agregarle esta carrera?",
        materiaExistenteId: "subject-42",
      })
    );
    renderForm();

    await fillAndSubmit(user);

    expect(
      await screen.findByText(
        "Ya existe una materia con ese nombre en esta institución. ¿Querés agregarle esta carrera?"
      )
    ).toBeInTheDocument();
    expect(mockedToast.error).not.toHaveBeenCalled();
    expect(mockedToast.success).not.toHaveBeenCalled();

    await user.click(
      screen.getByRole("button", { name: "Editar asociaciones de Análisis Matemático I" })
    );

    expect(screen.getByTestId("location")).toHaveTextContent(
      "/admin/catalogo/materias/subject-42/asociaciones?institucion=inst-utn"
    );
  });

  it("ante un error distinto del 409 muestra un mensaje de error genérico", async () => {
    const user = userEvent.setup();
    mockedCreateSubject.mockRejectedValue(
      axiosError(500, { message: "Error interno del servidor" })
    );
    renderForm();

    await fillAndSubmit(user);

    await vi.waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith("Error interno del servidor");
    });
    expect(screen.queryByRole("button", { name: /Editar asociaciones/ })).toBeNull();
  });
});