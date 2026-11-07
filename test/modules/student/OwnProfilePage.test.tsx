import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { OwnProfilePage } from "@/modules/student/profile/pages/OwnProfilePage";
import { getMyStudentProfile } from "@/modules/student/profile/api/student-profile.api";
import type { StudentSelfProfileResponse } from "@/modules/student/profile/interfaces/ownProfileInterface";

vi.mock("@/modules/student/profile/api/student-profile.api", () => ({
  getMyStudentProfile: vi.fn(),
  updateMyStudentProfile: vi.fn(),
}));

const profile: StudentSelfProfileResponse = {
  userId: "user-1",
  fullName: "Ana García",
  firstName: "Ana",
  lastName: "García",
  email: "ana@example.com",
  phoneNumber: "3534123456",
  careerId: "career-1",
  career: "Ingeniería en Sistemas de Información",
  institutionId: "institution-1",
  institution: "UTN FRVM",
  dni: "40123456",
  institutionalId: "12345",
  profilePictureUrl: null,
  role: "STUDENT",
  hasTutorProfile: false,
};

const mockedGet = vi.mocked(getMyStudentProfile);

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/student/profile"]}>
        <OwnProfilePage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("OwnProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGet.mockResolvedValue(profile);
  });

  it("muestra la sección de gestión de cuenta con las acciones de desactivar y eliminar", async () => {
    renderPage();

    expect(await screen.findByText("Gestión de Cuenta")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Desactivar cuenta" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eliminar cuenta" })).toBeInTheDocument();
  });
});
