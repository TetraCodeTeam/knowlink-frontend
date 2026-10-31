import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { deactivateTutorSubject } from "@/modules/tutors/api/tutor-subjects.api";
import { useDeactivateTutorSubject } from "@/modules/tutors/hooks/useDeactivateTutorSubject";
import type { TutorSubjectResponse } from "@/modules/tutor/interfaces/TutorSubjectResponse";

vi.mock("@/modules/tutors/api/tutor-subjects.api", () => ({
  deactivateTutorSubject: vi.fn(),
  reactivateTutorSubject: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
}));

const mockedDeactivate = vi.mocked(deactivateTutorSubject);
const mockedToast = vi.mocked(toast);

const subject: TutorSubjectResponse = {
  tutorSubjectId: "ts-1",
  subjectName: "Física 1",
  modality: "VIRTUAL",
  compensationType: "PAID",
  pricePerHour: 8000,
  verificationStatus: "ACTIVE",
  averageRating: null,
  reviewCount: null,
  active: false,
};

function apiError(status: number, detail: string, message: string) {
  return {
    isAxiosError: true,
    response: { status, data: { status, message, detail } },
  };
}

function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const invalidateSpy = vi.spyOn(client, "invalidateQueries");
  const onBlockedByBookings = vi.fn();

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  const { result } = renderHook(() => useDeactivateTutorSubject({ onBlockedByBookings }), {
    wrapper,
  });

  return { result, invalidateSpy, onBlockedByBookings };
}

describe("useDeactivateTutorSubject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("al desactivar invalida el perfil propio y muestra un snackbar de éxito", async () => {
    mockedDeactivate.mockResolvedValue(subject);
    const { result, invalidateSpy } = setup();

    act(() => result.current.mutate("ts-1"));

    await waitFor(() =>
      expect(mockedToast.success).toHaveBeenCalledWith("La materia fue desactivada.")
    );
    expect(mockedDeactivate).toHaveBeenCalledWith("ts-1", expect.anything());
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["myTutorProfile"] });
  });

  it("ante un 409 con SUBJECT_HAS_ACTIVE_BOOKINGS avisa el bloqueo sin snackbar de error", async () => {
    mockedDeactivate.mockRejectedValue(
      apiError(409, "SUBJECT_HAS_ACTIVE_BOOKINGS", "La materia tiene reservas activas.")
    );
    const { result, onBlockedByBookings } = setup();

    act(() => result.current.mutate("ts-1"));

    await waitFor(() => expect(onBlockedByBookings).toHaveBeenCalledTimes(1));
    expect(mockedToast.error).not.toHaveBeenCalled();
    expect(mockedToast.success).not.toHaveBeenCalled();
  });

  it("ante otro error muestra el mensaje del backend", async () => {
    mockedDeactivate.mockRejectedValue(
      apiError(404, "TUTOR_SUBJECT_NOT_FOUND", "La materia no existe.")
    );
    const { result, onBlockedByBookings } = setup();

    act(() => result.current.mutate("ts-1"));

    await waitFor(() => expect(mockedToast.error).toHaveBeenCalledWith("La materia no existe."));
    expect(onBlockedByBookings).not.toHaveBeenCalled();
  });
});
