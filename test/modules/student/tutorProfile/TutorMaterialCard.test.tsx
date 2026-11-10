import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  fetchMaterialBlob,
  getMaterialSignedUrl,
} from "@/shared/material-preview/api/materialPreview.api";
import { TutorMaterialCard } from "@/modules/student/tutorProfile/components/TutorMaterialCard";
import type { TutorMaterialItem } from "@/modules/student/tutorProfile/interfaces/tutor.interface";

vi.mock("@/shared/material-preview/api/materialPreview.api", () => ({
  getMaterialSignedUrl: vi.fn(),
  fetchMaterialBlob: vi.fn(),
}));

const material: TutorMaterialItem[] = [
  {
    id: "m-1",
    title: "Resumen de Álgebra",
    subject: "Álgebra",
    fileUrl: "",
    fileType: "PDF",
    fileSizeMB: 1.2,
    alreadyReported: false,
  },
  {
    id: "m-2",
    title: "Guía de Física",
    subject: "Física",
    fileUrl: "",
    fileType: "PNG",
    fileSizeMB: 0.8,
    alreadyReported: false,
  },
  {
    id: "m-3",
    title: "Tabla de Química",
    subject: "Química",
    fileUrl: "",
    fileType: "PDF",
    fileSizeMB: 2.5,
    alreadyReported: false,
  },
];

function renderCard() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={client}>
      <TutorMaterialCard material={material} hasConfirmedBooking onDownload={vi.fn()} />
    </QueryClientProvider>
  );
}

describe("TutorMaterialCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getMaterialSignedUrl).mockResolvedValue("https://storage.example.com/m.pdf?token=1");
    vi.mocked(fetchMaterialBlob).mockResolvedValue(new Blob(["%PDF"], { type: "application/pdf" }));
  });

  it("Ver desde la card abre el visor del material", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole("button", { name: "Ver Resumen de Álgebra" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(await screen.findByTitle("Vista previa de Resumen de Álgebra")).toBeInTheDocument();
  });

  it("Ver desde el modal Ver Todo abre el visor del material", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole("button", { name: "Ver Todo" }));
    const modal = await screen.findByRole("dialog");

    await user.click(within(modal).getByRole("button", { name: "Ver Tabla de Química" }));

    expect(await screen.findByTitle("Vista previa de Tabla de Química")).toBeInTheDocument();
    expect(getMaterialSignedUrl).toHaveBeenCalledWith("m-3");
  });
});
