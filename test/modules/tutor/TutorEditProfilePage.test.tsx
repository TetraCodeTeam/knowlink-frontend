import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { toast } from "sonner";
import { TutorEditProfilePage } from "@/modules/tutor/profile/pages/TutorEditProfilePage";
import { getMyTutorProfile } from "@/modules/tutor/profile/api/getMyTutorProfile";
import { updateMyTutorProfile } from "@/modules/tutor/profile/api/updateMyTutorProfile";
import type { TutorOwnProfileResponse } from "@/modules/tutor/profile/interfaces/tutor-own-profile.interface";

vi.mock("@/modules/tutor/profile/api/getMyTutorProfile", () => ({
  getMyTutorProfile: vi.fn(),
}));

vi.mock("@/modules/tutor/profile/api/updateMyTutorProfile", () => ({
  updateMyTutorProfile: vi.fn(),
}));

vi.mock("@/modules/tutors/hooks/useCareers", () => ({
  useCareers: () => ({
    data: [{ careerId: "career-1", name: "Ingeniería en Sistemas de Información" }],
    isLoading: false,
  }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const profile: TutorOwnProfileResponse = {
  userId: "tutor-1",
  fullName: "Carlos López",
  firstName: "Carlos",
  lastName: "López",
  email: "carlos@example.com",
  phoneNumber: "3534000000",
  career: "Ingeniería en Sistemas de Información",
  dni: "40123456",
  institutionalId: null,
  profilePictureUrl: null,
  address: null,
  mercadoPagoLinked: false,
  averageRating: null,
  biography: "Profesor de programación",
  subjects: [
    {
      tutorSubjectId: "ts-1",
      subjectName: "Programación I",
      averageRating: null,
      reviewCount: null,
      modality: "IN_PERSON",
      compensationType: "PAID",
      pricePerHour: 8000,
      verificationStatus: "ACTIVE",
      active: true,
    },
  ],
  hasStudentProfile: false,
};

const mockedGet = vi.mocked(getMyTutorProfile);
const mockedUpdate = vi.mocked(updateMyTutorProfile);
const mockedToast = vi.mocked(toast);

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/tutor/profile/edit"]}>
        <Routes>
          <Route path="/tutor/profile/edit" element={<TutorEditProfilePage />} />
          <Route path="/tutor/profile" element={<div>Perfil del tutor</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );

  return { queryClient };
}

describe("TutorEditProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGet.mockResolvedValue(profile);
  });

  it("exige la dirección cuando el tutor tiene materias presenciales", async () => {
    renderPage();

    expect(
      await screen.findByText("La dirección es obligatoria para clases presenciales")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeDisabled();
  });

  it("guarda biografía y dirección sin enviar el email y actualiza el cache", async () => {
    const user = userEvent.setup();
    const updatedProfile: TutorOwnProfileResponse = {
      ...profile,
      phoneNumber: "3534777777",
      address: "Av. Siempre Viva 123",
    };
    mockedUpdate.mockResolvedValue(updatedProfile);
    const { queryClient } = renderPage();

    const addressInput = await screen.findByPlaceholderText("Dirección para clases presenciales");
    await user.type(addressInput, "Av. Siempre Viva 123");
    const phoneInput = screen.getByPlaceholderText("Teléfono celular");
    await user.clear(phoneInput);
    await user.type(phoneInput, "3534777777");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await waitFor(() =>
      expect(mockedUpdate).toHaveBeenCalledWith({
        firstName: "Carlos",
        lastName: "López",
        dni: "40123456",
        phoneNumber: "3534777777",
        career: "Ingeniería en Sistemas de Información",
        institutionalId: "",
        biography: "Profesor de programación",
        address: "Av. Siempre Viva 123",
      })
    );

    expect(mockedToast.success).toHaveBeenCalledWith(
      "Datos personales actualizados correctamente."
    );
    expect(await screen.findByText("Perfil del tutor")).toBeInTheDocument();
    expect(queryClient.getQueryData(["myTutorProfile"])).toEqual(updatedProfile);
  });
});
