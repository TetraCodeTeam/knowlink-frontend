import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import type { AuthResponse } from "@/modules/auth/interfaces/responses/auth.interface";

const mockAuthResponse: AuthResponse = {
  token: "eyJhbGciOiJIUzI1NiJ9.test.signature",
  email: "test@knowlink.com",
  firstName: "Test",
  lastName: "User",
  role: "USER",
};

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ authResponse: undefined, isAuthenticated: false });
  });

  it("should start unauthenticated", () => {
    const { isAuthenticated } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
  });

  it("should set auth state on login", () => {
    useAuthStore.getState().login(mockAuthResponse);
    const { isAuthenticated, authResponse } = useAuthStore.getState();
    expect(isAuthenticated).toBe(true);
    expect(authResponse?.email).toBe("test@knowlink.com");
  });

  it("should clear auth state on logout", () => {
    useAuthStore.getState().login(mockAuthResponse);
    useAuthStore.getState().logout();
    const { isAuthenticated, authResponse } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(authResponse).toBeUndefined();
  });
});
