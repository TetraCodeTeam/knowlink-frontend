import { create } from "zustand";
import type { Role } from "@/shared/types/role.type";

interface RegistrationCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

interface RegistrationStore {
  credentials: RegistrationCredentials | null;
  setCredentials: (credentials: RegistrationCredentials) => void;
  clearCredentials: () => void;
}

export const useRegistrationStore = create<RegistrationStore>()((set) => ({
  credentials: null,
  setCredentials: (credentials) => set({ credentials }),
  clearCredentials: () => set({ credentials: null }),
}));