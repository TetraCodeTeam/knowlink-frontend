import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { toast } from "sonner";
import { StudentEditProfilePage } from "@/modules/student/profile/pages/StudentEditProfilePage";
import {
  getMyStudentProfile,
  updateMyStudentProfile,
} from "@/modules/student/profile/api/student-profile.api";
import type { StudentSelfProfileResponse } from "@/modules/student/profile/interfaces/ownProfileInterface";

vi.mock("@/modules/student/profile/api/student-profile.api", () => ({
  getMyStudentProfile: vi.fn(),
  updateMyStudentProfile: vi.fn(),
}));

vi.mock("@/modules/tutors/hooks/useCareers", () => ({
  useCareers: () => ({
    data: [
      { careerId: "career-1", name: "Ingeniería en Sistemas de Información" },
      { careerId: "career-2", name: "Licenciatura en Administración" },
    ],
    isLoading: false,
  }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const profile: StudentSelfProfileResponse = {
  userId: "user-1",
  fullName: "Ana García",
  firstName: "Ana",
  lastName: "García",
  email: "ana@example.com",
  phoneNumber: "3534123456",
  career: "Ingeniería en Sistemas de Información",
  dni: "40123456",
  institutionalId: "12345",
  profilePictureUrl: null,
  role: "STUDENT",
  hasTutorProfile: false,
};

const mockedGet = vi.mocked(getMyStudentProfile);
const mockedUpdate = vi.mocked(updateMyStudentProfile);
const mockedToast = vi.mocked(toast);

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/student/profile/edit"]}>
        <Routes>
          <Route path="/student/profile/edit" element={<StudentEditProfilePage />} />
          <Route path="/student/profile" element={<div>Perfil del alumno</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );

  return { queryClient };
}

describe("StudentEditProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGet.mockResolvedValue(profile);
  });

  it("carga el perfil y muestra el formulario precargado", async () => {
    renderPage();

    expect(await screen.findByDisplayValue("Ana")).toBeInTheDocument();
    expect(screen.getByDisplayValue("García")).toBeInTheDocument();
    expect(screen.getByText("Editar perfil")).toBeInTheDocument();
  });

  it("guarda sin enviar el email, muestra el toast y actualiza el cache", async () => {
    const user = userEvent.setup();
    const updatedProfile: StudentSelfProfileResponse = {
      ...profile,
      phoneNumber: "3534999999",
    };
    mockedUpdate.mockResolvedValue(updatedProfile);
    const { queryClient } = renderPage();

    const phoneInput = await screen.findByDisplayValue("3534123456");
    await user.clear(phoneInput);
    await user.type(phoneInput, "3534999999");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await waitFor(() =>
      expect(mockedUpdate).toHaveBeenCalledWith({
        firstName: "Ana",
        lastName: "García",
        dni: "40123456",
        phoneNumber: "3534999999",
        career: "Ingeniería en Sistemas de Información",
        institutionalId: "12345",
      })
    );

    expect(mockedToast.success).toHaveBeenCalledWith(
      "Datos personales actualizados correctamente."
    );
    expect(await screen.findByText("Perfil del alumno")).toBeInTheDocument();
    expect(queryClient.getQueryData(["myStudentProfile"])).toEqual(updatedProfile);
  });

  it("muestra el mensaje del backend en el DNI ante un 409 DUPLICATE_DNI y no navega", async () => {
    const user = userEvent.setup();
    mockedUpdate.mockRejectedValue({
      isAxiosError: true,
      response: {
        data: {
          status: 409,
          message: "El DNI ya está registrado por otro usuario",
          detail: "DUPLICATE_DNI",
        },
      },
    });
    renderPage();

    const phoneInput = await screen.findByDisplayValue("3534123456");
    await user.clear(phoneInput);
    await user.type(phoneInput, "3534888888");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(
      await screen.findByText("El DNI ya está registrado por otro usuario")
    ).toBeInTheDocument();
    expect(screen.queryByText("Perfil del alumno")).not.toBeInTheDocument();
    expect(screen.getByText("Editar perfil")).toBeInTheDocument();
  });
});
