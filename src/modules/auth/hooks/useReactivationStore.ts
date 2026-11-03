import { create } from "zustand";
import type { LoginFormValues } from "@/modules/auth/schemas/login.schema";

interface ReactivationStore {
  pendingCredentials?: LoginFormValues;
  setPendingCredentials: (credentials: LoginFormValues) => void;
  clear: () => void;
}

/**
 * Credenciales del login que quedaron pendientes de reactivación.
 * Vive solo en memoria: no se persiste ni se expone en la URL.
 */
export const useReactivationStore = create<ReactivationStore>()((set) => ({
  pendingCredentials: undefined,
  setPendingCredentials: (pendingCredentials) => set({ pendingCredentials }),
  clear: () => set({ pendingCredentials: undefined }),
}));
