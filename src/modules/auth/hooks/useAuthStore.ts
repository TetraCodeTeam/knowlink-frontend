import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse } from "@/modules/auth/interfaces/responses/auth.interface";

interface AuthStore {
  authResponse?: AuthResponse;
  isAuthenticated: boolean;
  login: (authResponse: AuthResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      authResponse: undefined,
      isAuthenticated: false,

      login: (authResponse: AuthResponse) =>
        set({ authResponse, isAuthenticated: true }),

      logout: () =>
        set({ authResponse: undefined, isAuthenticated: false }),
    }),
    {
      name: "knowlink-auth",
    }
  )
);
