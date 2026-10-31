import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { deleteMaterial } from "@/modules/tutor/materials/api/materials.api";
import { useGetMaterials } from "@/modules/tutor/materials/hooks/useGetMaterials";
import { useMySubjectsWithCatalogId } from "@/modules/tutor/materials/hooks/useMySubjectsWithCatalogId";
import MaterialsSection from "@/modules/tutor/materials/components/MaterialsSection";
import { makeMaterial } from "./fixtures";

vi.mock("@/modules/tutor/materials/api/materials.api", () => ({
  getMaterialsBySubject: vi.fn(),
  uploadMaterial: vi.fn(),
  deleteMaterial: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/modules/tutor/materials/hooks/useGetMaterials", () => ({
  useGetMaterials: vi.fn(),
}));

vi.mock("@/modules/tutor/materials/hooks/useMySubjectsWithCatalogId", () => ({
  useMySubjectsWithCatalogId: vi.fn(),
}));

const mockedDelete = vi.mocked(deleteMaterial);
const mockedGetMaterials = vi.mocked(useGetMaterials);
const mockedSubjects = vi.mocked(useMySubjectsWithCatalogId);

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
      ],
      isLoading: false,
    });
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
});
