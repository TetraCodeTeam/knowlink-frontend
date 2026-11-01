import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { toast } from "sonner";
import {
  deactivateTutorSubject,
  reactivateTutorSubject,
} from "@/modules/tutors/api/tutor-subjects.api";
import SubjectActiveToggle from "@/modules/tutors/components/SubjectActiveToggle";
import type { TutorSubjectResponse } from "@/modules/tutor/interfaces/TutorSubjectResponse";

vi.mock("@/modules/tutors/api/tutor-subjects.api", () => ({
  deactivateTutorSubject: vi.fn(),
  reactivateTutorSubject: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

const mockedDeactivate = vi.mocked(deactivateTutorSubject);
const mockedReactivate = vi.mocked(reactivateTutorSubject);
const mockedToast = vi.mocked(toast);

const activeSubject: TutorSubjectResponse = {
  tutorSubjectId: "ts-1",
  subjectName: "Física 1",
  modality: "VIRTUAL",
  compensationType: "PAID",
  pricePerHour: 8000,
  verificationStatus: "ACTIVE",
  averageRating: 4.5,
  reviewCount: 10,
  active: true,
};

function renderToggle(subject: TutorSubjectResponse) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <SubjectActiveToggle subject={subject} />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("SubjectActiveToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("una materia activa muestra el botón Desactivar", () => {
    renderToggle(activeSubject);

    expect(screen.getByRole("button", { name: "Desactivar" })).toBeInTheDocument();
    expect(screen.queryByText("Desactivada")).toBeNull();
  });

  it("una materia inactiva muestra el chip Desactivada y el botón Reactivar", () => {
    renderToggle({ ...activeSubject, active: false });

    expect(screen.getByText("Desactivada")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reactivar" })).toBeInTheDocument();
  });

  it("cancelar el diálogo de confirmación no llama a la API", () => {
    renderToggle(activeSubject);

    fireEvent.click(screen.getByRole("button", { name: "Desactivar" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(mockedDeactivate).not.toHaveBeenCalled();
  });

  it("confirmar el diálogo desactiva la materia", async () => {
    mockedDeactivate.mockResolvedValue({ ...activeSubject, active: false });
    renderToggle(activeSubject);

    fireEvent.click(screen.getByRole("button", { name: "Desactivar" }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Desactivar" }));

    await waitFor(() => expect(mockedDeactivate).toHaveBeenCalledWith("ts-1", expect.anything()));
  });

  it("ante un 409 muestra el diálogo de reservas activas", async () => {
    mockedDeactivate.mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 409,
        data: {
          status: 409,
          message: "La materia tiene reservas activas.",
          detail: "SUBJECT_HAS_ACTIVE_BOOKINGS",
        },
      },
    });
    renderToggle(activeSubject);

    fireEvent.click(screen.getByRole("button", { name: "Desactivar" }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Desactivar" }));

    await waitFor(() => expect(screen.getByText("Reservas activas")).toBeInTheDocument());
    expect(mockedToast.error).not.toHaveBeenCalled();
  });

  it("reactivar llama a la API sin diálogo", async () => {
    mockedReactivate.mockResolvedValue({ ...activeSubject, active: true });
    renderToggle({ ...activeSubject, active: false });

    fireEvent.click(screen.getByRole("button", { name: "Reactivar" }));

    await waitFor(() => expect(mockedReactivate).toHaveBeenCalledWith("ts-1", expect.anything()));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
