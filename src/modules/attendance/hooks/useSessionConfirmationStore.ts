import { create } from "zustand";

export interface PendingSessionConfirmation {
  sessionId: string;
  expiresAt: string;
  /** Texto ya formateado por el backend/caller, ej. "18:10 hs". No se
   * recalcula en vivo; el countdown usa expiresAt como fuente de verdad. */
  deadlineLabel: string;
}

interface SessionConfirmationState {
  pending: PendingSessionConfirmation | null;
  /** IDs de reservas ya resueltas (confirmadas o vencidas). Vive en este
   * store global, no en un ref del hook que la usa, para que sobreviva a
   * un remount del layout raíz: si no, un remount justo después de
   * confirmar podría reabrir el popup con datos de reserva stale del
   * último poll de /bookings/mine. */
  resolvedBookingIds: Set<string>;
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
  resolvedBookingIds: new Set(),
  openConfirmation: (data) => set({ pending: data }),
  clearConfirmation: () =>
    set((state) => {
      if (!state.pending) return state;
      const resolvedBookingIds = new Set(state.resolvedBookingIds);
      resolvedBookingIds.add(state.pending.sessionId);
      return { pending: null, resolvedBookingIds };
    }),
}));
