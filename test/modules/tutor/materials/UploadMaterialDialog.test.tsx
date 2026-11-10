import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { uploadMaterial } from "@/modules/tutor/materials/api/materials.api";
import { useMySubjectsWithCatalogId } from "@/modules/tutor/materials/hooks/useMySubjectsWithCatalogId";
import UploadMaterialDialog from "@/modules/tutor/materials/components/UploadMaterialDialog";
import { makeMaterial } from "./fixtures";

vi.mock("@/modules/tutor/materials/api/materials.api", () => ({
  getMaterialsBySubject: vi.fn(),
  uploadMaterial: vi.fn(),
  deleteMaterial: vi.fn(),
}));

vi.mock("@/modules/tutor/materials/hooks/useMySubjectsWithCatalogId", () => ({
  useMySubjectsWithCatalogId: vi.fn(),
}));

vi.mock("@/shared/lib/toast", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockedUpload = vi.mocked(uploadMaterial);
const mockedSubjects = vi.mocked(useMySubjectsWithCatalogId);

/** Deja que el diálogo cierre de verdad, igual que en la pantalla del tutor. */
function DialogHost({ onUploaded }: { onUploaded: (catalogSubjectId: string) => void }) {
  const [open, setOpen] = useState(true);
  return (
    <UploadMaterialDialog open={open} onClose={() => setOpen(false)} onUploaded={onUploaded} />
  );
}

function renderDialog(onUploaded: (catalogSubjectId: string) => void) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <DialogHost onUploaded={onUploaded} />
    </QueryClientProvider>
  );
}

/** Completa el formulario y devuelve el botón de envío, todavía sin tocarlo. */
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

describe("UploadMaterialDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
  });

  it("llama a onUploaded con la materia elegida, después de subir", async () => {
    const order: string[] = [];
    mockedUpload.mockImplementation(() => {
      order.push("upload");
      return Promise.resolve(makeMaterial());
    });
    const onUploaded = vi.fn((catalogSubjectId: string) => {
      order.push(`onUploaded:${catalogSubjectId}`);
    });

    const user = userEvent.setup();
    renderDialog(onUploaded);
    await user.click(await fillUploadForm(user));

    await waitFor(() => expect(onUploaded).toHaveBeenCalledWith("subject-2"));
    expect(order).toEqual(["upload", "onUploaded:subject-2"]);
  });

  it("no llama a onUploaded si la subida falla", async () => {
    const onUploaded = vi.fn();
    let rejectUpload: (error: Error) => void = () => {};
    mockedUpload.mockReturnValue(
      new Promise<never>((_resolve, reject) => {
        rejectUpload = reject;
      })
    );

    const user = userEvent.setup();
    renderDialog(onUploaded);

    const submit = await fillUploadForm(user);
    await user.click(submit);
    await waitFor(() => expect(submit).toBeDisabled());

    rejectUpload(new Error("fallo la subida"));
    await waitFor(() => expect(submit).toBeEnabled());

    expect(onUploaded).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("no llama a onUploaded si el usuario cierra el diálogo", async () => {
    const onUploaded = vi.fn();
    renderDialog(onUploaded);

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(onUploaded).not.toHaveBeenCalled();
  });
});
