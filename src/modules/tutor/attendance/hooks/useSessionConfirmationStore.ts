import { create } from "zustand";

export interface PendingSessionConfirmation {
  sessionId: string;
  /** Texto ya formateado por el backend/caller, ej. "18:10 hs". No se
   * recalcula en vivo — ver discusión en el chat sobre esta decisión. */
  deadlineLabel: string;
}

interface SessionConfirmationState {
  pending: PendingSessionConfirmation | null;
  openConfirmation: (data: PendingSessionConfirmation) => void;
  /** Se llama tanto al confirmar con éxito como al vencer el plazo:
   * en ambos casos el widget deja de tener sentido en pantalla. */
  clearConfirmation: () => void;
}

/**
 * Store global (no vive en hooks/ de un módulo de dominio particular)
 * porque el widget de confirmación debe persistir entre navegaciones
 * de cualquier pantalla de la app, montado una sola vez en el layout
 * raíz — ver SessionConfirmationWidget y su punto de montaje.
 */
export const useSessionConfirmationStore = create<SessionConfirmationState>((set) => ({
  pending: null,
  openConfirmation: (data) => set({ pending: data }),
  clearConfirmation: () => set({ pending: null }),
}));
