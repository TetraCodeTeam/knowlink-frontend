import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { deleteMaterial, uploadMaterial } from "@/modules/tutor/materials/api/materials.api";
import { useGetMaterials } from "@/modules/tutor/materials/hooks/useGetMaterials";
import { useMySubjectsWithCatalogId } from "@/modules/tutor/materials/hooks/useMySubjectsWithCatalogId";
import {
  fetchMaterialBlob,
  getMaterialSignedUrl,
} from "@/shared/material-preview/api/materialPreview.api";
import MaterialsSection from "@/modules/tutor/materials/components/MaterialsSection";
import { makeMaterial } from "./fixtures";

vi.mock("@/modules/tutor/materials/api/materials.api", () => ({
  getMaterialsBySubject: vi.fn(),
  uploadMaterial: vi.fn(),
  deleteMaterial: vi.fn(),
}));

vi.mock("@/shared/lib/toast", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/modules/tutor/materials/hooks/useGetMaterials", () => ({
  useGetMaterials: vi.fn(),
}));

vi.mock("@/modules/tutor/materials/hooks/useMySubjectsWithCatalogId", () => ({
  useMySubjectsWithCatalogId: vi.fn(),
}));

vi.mock("@/shared/material-preview/api/materialPreview.api", () => ({
  getMaterialSignedUrl: vi.fn(),
  fetchMaterialBlob: vi.fn(),
}));

const mockedDelete = vi.mocked(deleteMaterial);
const mockedUpload = vi.mocked(uploadMaterial);
const mockedGetMaterials = vi.mocked(useGetMaterials);
const mockedSubjects = vi.mocked(useMySubjectsWithCatalogId);
const mockedSignedUrl = vi.mocked(getMaterialSignedUrl);
const mockedBlob = vi.mocked(fetchMaterialBlob);

const FIRST = makeMaterial({ id: "mat-1", name: "Primer material", originalFileName: "uno.pdf" });
const SECOND = makeMaterial({
  id: "mat-2",
  name: "Segundo material",
  originalFileName: "dos.pdf",
});

function renderSection() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  render(
    <QueryClientProvider client={client}>
      <MaterialsSection />
    </QueryClientProvider>
  );
}

/** Completa el formulario de subida y devuelve el botón de envío, sin tocarlo. */
async function fillUploadForm(user: UserEvent): Promise<HTMLElement> {
  const dialog = await screen.findByRole("dialog");

  await user.type(
    within(dialog).getByPlaceholderText("Ingresá el nombre del material"),
    "Resumen nuevo"
  );
  await user.click(within(dialog).getByRole("combobox"));
  await user.click(await screen.findByRole("option", { name: "Física" }));

  const fileInput = dialog.querySelector<HTMLInputElement>('input[type="file"]');
  if (!fileInput) throw new Error("No se encontró el input de archivo");
  fireEvent.change(fileInput, {
    target: { files: [new File(["x"], "resumen.pdf", { type: "application/pdf" })] },
  });

  return within(dialog).getByRole("button", { name: "Subir recurso" });
}

describe("MaterialsSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetMaterials.mockReturnValue({ materials: [FIRST, SECOND], isLoading: false });
    mockedSubjects.mockReturnValue({
      subjects: [
        {
          tutorSubjectId: "ts-1",
          subjectName: "Análisis Matemático",
          catalogSubjectId: "subject-1",
        },
        { tutorSubjectId: "ts-2", subjectName: "Física", catalogSubjectId: "subject-2" },
      ],
      isLoading: false,
    });
    mockedUpload.mockResolvedValue(makeMaterial());
    mockedSignedUrl.mockResolvedValue("https://storage.example.com/m.pdf?token=1");
    mockedBlob.mockResolvedValue(new Blob(["%PDF"], { type: "application/pdf" }));
  });

  it("muestra un botón de eliminar por cada material", () => {
    renderSection();

    expect(
      screen.getByRole("button", { name: "Eliminar Primer material.pdf" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Eliminar Segundo material.pdf" })
    ).toBeInTheDocument();
  });

  it("abre el diálogo con el material seleccionado", () => {
    renderSection();

    fireEvent.click(screen.getByRole("button", { name: "Eliminar Primer material.pdf" }));

    expect(
      screen.getByText("¿Estás seguro de que querés eliminar permanentemente Primer material.pdf?")
    ).toBeInTheDocument();
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).queryByText(/Segundo material/)).not.toBeInTheDocument();
  });

  it("cancelar cierra el diálogo sin llamar a la API", () => {
    renderSection();

    fireEvent.click(screen.getByRole("button", { name: "Eliminar Primer material.pdf" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(mockedDelete).not.toHaveBeenCalled();
  });

  it("muestra un botón Ver por cada material", () => {
    renderSection();

    expect(screen.getByRole("button", { name: "Ver Primer material.pdf" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver Segundo material.pdf" })).toBeInTheDocument();
  });

  it("el botón Ver abre el visor del material", async () => {
    const user = userEvent.setup();
    renderSection();

    await user.click(screen.getByRole("button", { name: "Ver Primer material.pdf" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(await screen.findByTitle("Vista previa de Primer material.pdf")).toBeInTheDocument();
  });

  it("al subir de otra materia el filtro pasa a esa materia", async () => {
    const user = userEvent.setup();
    renderSection();

    fireEvent.click(screen.getByRole("button", { name: "Análisis Matemático" }));
    fireEvent.click(screen.getByRole("button", { name: "Subir recurso" }));
    await user.click(await fillUploadForm(user));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Física" })).toHaveAttribute("aria-pressed", "true")
    );
    expect(screen.getByRole("button", { name: "Análisis Matemático" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("estando en Todo también pasa a la materia subida", async () => {
    const user = userEvent.setup();
    renderSection();

    expect(screen.getByRole("button", { name: "Todo" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "Subir recurso" }));
    await user.click(await fillUploadForm(user));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Física" })).toHaveAttribute("aria-pressed", "true")
    );
    expect(screen.getByRole("button", { name: "Todo" })).toHaveAttribute("aria-pressed", "false");
  });

  it("si la subida falla el filtro no cambia y el diálogo sigue abierto", async () => {
    const user = userEvent.setup();
    renderSection();

    fireEvent.click(screen.getByRole("button", { name: "Análisis Matemático" }));
    fireEvent.click(screen.getByRole("button", { name: "Subir recurso" }));

    let rejectUpload: (error: Error) => void = () => {};
    mockedUpload.mockReturnValue(
      new Promise<never>((_resolve, reject) => {
        rejectUpload = reject;
      })
    );

    const submit = await fillUploadForm(user);
    await user.click(submit);
    await waitFor(() => expect(submit).toBeDisabled());

    rejectUpload(new Error("fallo la subida"));
    await waitFor(() => expect(submit).toBeEnabled());

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Cancelar" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    expect(screen.getByRole("button", { name: "Análisis Matemático" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Física" })).toHaveAttribute("aria-pressed", "false");
  });
});
