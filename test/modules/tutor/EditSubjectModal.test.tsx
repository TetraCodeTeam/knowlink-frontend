import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EditSubjectModal from "@/modules/tutor/components/EditSubjectModal";
import { updateTutorSubject } from "@/modules/tutor/api/Tutorsubject.api";
import type { TutorOwnSubject } from "@/modules/tutor/profile/interfaces/tutor-own-profile.interface";

vi.mock("@/modules/tutor/api/Tutorsubject.api", () => ({
  updateTutorSubject: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const baseSubject: TutorOwnSubject = {
  tutorSubjectId: "ts-1",
  subjectName: "Física 1",
  averageRating: null,
  reviewCount: null,
  modality: "VIRTUAL",
  compensationType: "PAID",
  pricePerHour: 8000,
  verificationStatus: "ACTIVE",
  active: true,
};

const mockedUpdateTutorSubject = vi.mocked(updateTutorSubject);

function renderModal(overrides: Partial<TutorOwnSubject> = {}) {
  const subject = { ...baseSubject, ...overrides };
  const onClose = vi.fn();
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <EditSubjectModal subject={subject} onClose={onClose} />
    </QueryClientProvider>
  );

  return { subject, onClose };
}

describe("EditSubjectModal", () => {
  beforeEach(() => {
    mockedUpdateTutorSubject.mockReset();
    mockedUpdateTutorSubject.mockResolvedValue({
      tutorSubjectId: "ts-1",
      subjectName: "Física 1",
      modality: "VIRTUAL",
      compensationType: "PAID",
      pricePerHour: 8000,
      verificationStatus: "ACTIVE",
      active: true,
      averageRating: null,
      reviewCount: null,
    });
  });

  it("muestra los valores precargados y el nombre de la materia deshabilitado", async () => {
    renderModal();

    const nameInput = screen.getByRole("textbox", { name: "Materia" });
    expect(nameInput).toHaveValue("Física 1");
    expect(nameInput).toBeDisabled();
    expect(screen.getByLabelText("Precio por hora")).toHaveValue(8000);
    expect(screen.getByRole("button", { name: "Virtual" })).toHaveAttribute("aria-pressed", "true");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeEnabled()
    );
  });

  it("habilita Guardar cambios con datos válidos", async () => {
    renderModal();

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeEnabled()
    );
  });

  it("deshabilita Guardar cambios y muestra el error si el precio es cero", async () => {
    const user = userEvent.setup();
    renderModal();

    const priceInput = screen.getByLabelText("Precio por hora");
    await user.clear(priceInput);
    await user.type(priceInput, "0");

    expect(await screen.findByText("El precio debe ser mayor a cero")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeDisabled();
  });

  it("deshabilita Guardar cambios si no queda ninguna modalidad", async () => {
    const user = userEvent.setup();
    renderModal({ modality: "BOTH" });

    await user.click(screen.getByRole("button", { name: "Virtual" }));
    await user.click(screen.getByRole("button", { name: "Presencial" }));

    expect(await screen.findByText("Seleccioná al menos una modalidad")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeDisabled();
  });

  it("deshabilita el precio y habilita Guardar cambios al activar Gratis", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole("switch", { name: "Gratis" }));

    expect(screen.getByLabelText("Precio por hora")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeEnabled();
  });

  it("envía el PUT con los datos editados y cierra el modal", async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    await user.click(screen.getByRole("button", { name: "Presencial" }));
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await waitFor(() => {
      expect(mockedUpdateTutorSubject).toHaveBeenCalledWith("ts-1", {
        modality: "BOTH",
        compensationType: "PAID",
        pricePerHour: 8000,
      });
    });
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
