import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse } from "@/modules/auth/interfaces/responses/auth.interface";
import { queryClient } from "@/shared/lib/queryClient";
import { useSessionConfirmationStore } from "@/modules/attendance/hooks/useSessionConfirmationStore";
import { useStudentTokenStore } from "@/modules/attendance/hooks/useStudentTokenStore";

interface AuthStore {
  authResponse?: AuthResponse;
  isAuthenticated: boolean;
  login: (authResponse: AuthResponse) => void;
  logout: () => void;
}

/** Los stores de attendance viven en memoria (no en la caché de TanStack),
 * así que `queryClient.clear()` no los alcanza: hay que resetearlos a mano
 * en cada cambio de usuario para que `pending`, `resolvedBookingIds` y el
 * token del alumno activo no se filtren de una sesión a la siguiente en la
 * misma pestaña. */
function resetAttendanceStores(): void {
  useSessionConfirmationStore.getState().reset();
  useStudentTokenStore.getState().hideToken();
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      authResponse: undefined,
      isAuthenticated: false,

      login: (authResponse: AuthResponse) => {
        queryClient.clear();
        resetAttendanceStores();
        set({ authResponse, isAuthenticated: true });
      },

      logout: () => {
        queryClient.clear();
        resetAttendanceStores();
        set({ authResponse: undefined, isAuthenticated: false });
      },
    }),
    {
      name: "knowlink-auth",
    }
  )
);
