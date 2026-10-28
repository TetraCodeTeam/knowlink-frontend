import { create } from "zustand";

export interface ActiveStudentToken {
  sessionId: string;
  /** El código de 4 dígitos ya generado por el backend para esta
   * sesión — el estudiante solo lo muestra, no lo genera ni valida
   * acá. */
  code: string;
}

interface StudentTokenState {
  active: ActiveStudentToken | null;
  showToken: (data: ActiveStudentToken) => void;
  /** Se llama cuando el tutor ya confirmó la sesión con este código
   * (o cuando vence, si aplica esa regla del lado del estudiante
   * también) — el widget deja de tener sentido en pantalla. */
  hideToken: () => void;
}

export const useStudentTokenStore = create<StudentTokenState>((set) => ({
  active: null,
  showToken: (data) => set({ active: data }),
  hideToken: () => set({ active: null }),
}));
