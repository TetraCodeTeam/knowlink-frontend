import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { useSessionConfirmationStore } from "@/modules/attendance/hooks/useSessionConfirmationStore";
import { useStudentTokenStore } from "@/modules/attendance/hooks/useStudentTokenStore";
import type { AuthResponse } from "@/modules/auth/interfaces/responses/auth.interface";

const AUTH_RESPONSE: AuthResponse = {
  userId: "tutor-1",
  email: "tutor@test.com",
  fullName: "Tutor de prueba",
  token: "token",
  role: "TUTOR",
};

/** Deja los stores de attendance como quedarían con el popup de token
 * abierto y una reserva ya resuelta, para verificar que login/logout los
 * limpian (Escenario 4: sin filtración entre sesiones de usuario). */
function seedAttendanceStores(): void {
  useSessionConfirmationStore.setState({
    pending: {
      sessionId: "booking-1",
      expiresAt: "2026-01-01T00:05:00",
      deadlineLabel: "00:05 hs",
    },
    resolvedBookingIds: new Map([["booking-0", Date.now()]]),
  });
  useStudentTokenStore.setState({ active: { sessionId: "booking-1", code: "1234" } });
}

describe("useAuthStore — reset de stores de attendance en login y logout (Escenario 4)", () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, authResponse: undefined });
    seedAttendanceStores();
  });

  it("logout deja pending en null, resolvedBookingIds vacío y el token del alumno en null", () => {
    useAuthStore.getState().logout();

    expect(useSessionConfirmationStore.getState().pending).toBeNull();
    expect(useSessionConfirmationStore.getState().resolvedBookingIds.size).toBe(0);
    expect(useStudentTokenStore.getState().active).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("login deja pending en null, resolvedBookingIds vacío y el token del alumno en null", () => {
    useAuthStore.getState().login(AUTH_RESPONSE);

    expect(useSessionConfirmationStore.getState().pending).toBeNull();
    expect(useSessionConfirmationStore.getState().resolvedBookingIds.size).toBe(0);
    expect(useStudentTokenStore.getState().active).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().authResponse).toEqual(AUTH_RESPONSE);
  });
});
