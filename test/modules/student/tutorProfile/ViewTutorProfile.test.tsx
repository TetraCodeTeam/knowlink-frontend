import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { TutorProfilePage } from "@/modules/student/tutorProfile/pages/ViewTutorProfile";
import { getTutorProfile } from "@/modules/student/tutorProfile/api/getTutorProfile";

vi.mock("@/modules/student/tutorProfile/api/getTutorProfile", () => ({
  getTutorProfile: vi.fn(),
  checkTutorMaterialAccess: vi.fn().mockResolvedValue(false),
  getAccessibleTutorMaterials: vi.fn().mockResolvedValue([]),
  getTutorRatingHistory: vi.fn().mockResolvedValue({
    subjects: [],
    comments: { content: [], totalElements: 0 },
    averageRating: null,
  }),
  getMaterialDownloadUrl: vi.fn(),
  mapRatingComments: vi.fn().mockReturnValue([]),
  mapTutorMaterials: vi.fn().mockReturnValue([]),
}));

const mockedGetTutorProfile = vi.mocked(getTutorProfile);

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/student/tutor/tutor-1"]}>
        <Routes>
          <Route path="/student/tutor/:tutorId" element={<TutorProfilePage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("TutorProfilePage pública", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra su estado de error cuando el backend responde 404 por un tutor desactivado", async () => {
    mockedGetTutorProfile.mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 404,
        data: { status: 404, message: "No encontrado", detail: "TUTOR_PROFILE_NOT_FOUND" },
      },
    });

    renderPage();

    expect(await screen.findByText("No se pudo cargar el perfil del tutor.")).toBeInTheDocument();
  });
});
