import { create } from "zustand";

interface RegistrationCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  role: "STUDENT" | "TUTOR";
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