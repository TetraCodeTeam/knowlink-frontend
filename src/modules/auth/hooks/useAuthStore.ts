import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse } from "@/modules/auth/interfaces/responses/auth.interface";
import { queryClient } from "@/shared/lib/queryClient";

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

      login: (authResponse: AuthResponse) => {
        queryClient.clear();
        set({ authResponse, isAuthenticated: true });
      },

      logout: () => {
        queryClient.clear();
        set({ authResponse: undefined, isAuthenticated: false });
      },
    }),
    {
      name: "knowlink-auth",
    }
  )
);