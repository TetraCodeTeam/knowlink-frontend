import { create } from "zustand";

export interface PendingSessionConfirmation {
  sessionId: string;
  expiresAt: string;
  /** Texto ya formateado por el backend/caller, ej. "18:10 hs". No se
   * recalcula en vivo; el countdown usa expiresAt como fuente de verdad. */
  deadlineLabel: string;
}

/** Más que el poll más lento de useEligibleConfirmationBooking (5 min),
 * para garantizar que ya llegó un fetch fresco (que excluye la reserva
 * resuelta del lado del backend) antes de podar su entrada acá. */
const RESOLVED_BOOKING_TTL_MS = 6 * 60 * 1000;

interface SessionConfirmationState {
  pending: PendingSessionConfirmation | null;
  /** IDs de reservas ya resueltas (confirmadas o vencidas) → timestamp en
   * que se resolvieron. Vive en este store global, no en un ref del hook
   * que lo usa, para que sobreviva a un remount del layout raíz: si no,
   * un remount justo después de confirmar podría reabrir el popup con
   * datos de reserva stale del último poll de /bookings/mine. Es un Map
   * con TTL (no un Set que solo crece) para no acumular entradas viejas
   * indefinidamente en una sesión larga del navegador.
   */
  resolvedBookingIds: Map<string, number>;
  openConfirmation: (data: PendingSessionConfirmation) => void;
  /** Se llama tanto al confirmar con éxito como al vencer el plazo:
   * en ambos casos el widget deja de tener sentido en pantalla. */
  clearConfirmation: () => void;
  isResolved: (bookingId: string) => boolean;
}

/**
 * Store global (no vive en hooks/ de un módulo de dominio particular)
 * porque el widget de confirmación debe persistir entre navegaciones
 * de cualquier pantalla de la app, montado una sola vez en el layout
 * raíz — ver SessionConfirmationWidget y su punto de montaje.
 */
export const useSessionConfirmationStore = create<SessionConfirmationState>((set, get) => ({
  pending: null,
  resolvedBookingIds: new Map(),
  openConfirmation: (data) => set({ pending: data }),
  clearConfirmation: () =>
    set((state) => {
      if (!state.pending) return state;
      const now = Date.now();
      const resolvedBookingIds = new Map(state.resolvedBookingIds);
      // Poda entradas vencidas antes de agregar la nueva, así el Map no
      // crece indefinidamente durante una sesión larga del navegador.
      for (const [bookingId, resolvedAt] of resolvedBookingIds) {
        if (now - resolvedAt >= RESOLVED_BOOKING_TTL_MS) resolvedBookingIds.delete(bookingId);
      }
      resolvedBookingIds.set(state.pending.sessionId, now);
      return { pending: null, resolvedBookingIds };
    }),
  isResolved: (bookingId) => {
    const resolvedAt = get().resolvedBookingIds.get(bookingId);
    return resolvedAt !== undefined && Date.now() - resolvedAt < RESOLVED_BOOKING_TTL_MS;
  },
}));
