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
  /** Se llama cuando la reserva quedó RESUELTA: el tutor confirmó con el
   * token, venció el plazo o se bloqueó por un reclamo. Cierra el popup
   * **y** registra la reserva en `resolvedBookingIds` para que no se
   * reabra mientras esté stale la caché de /bookings/mine.
   * Ojo: NO es para "simplemente cerrar" el popup — para eso está
   * `closeConfirmation`, que no registra la reserva como resuelta (si no,
   * cerrar sesión con el popup abierto bloquearía la clase hasta que
   * venza el TTL de 6 min).
   */
  clearConfirmation: () => void;
  /** Cierra el popup sin marcar la reserva como resuelta: la usa
   * useAutoOpenSessionConfirmation cuando desaparece la reserva elegible
   * sin que nadie haya confirmado (p. ej. al cerrar sesión, donde
   * queryClient.clear() vacía la caché de reservas). Así el popup puede
   * volver a abrirse en cuanto vuelva la reserva.
   */
  closeConfirmation: () => void;
  /** Vacia el store por completo (pending + resolvedBookingIds). Se llama
   * en login y logout para que el estado de un usuario no se filtre al
   * siguiente en la misma pestaña.
   */
  reset: () => void;
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
  closeConfirmation: () => set((state) => (state.pending ? { pending: null } : state)),
  reset: () => set({ pending: null, resolvedBookingIds: new Map() }),
  isResolved: (bookingId) => {
    const resolvedAt = get().resolvedBookingIds.get(bookingId);
    return resolvedAt !== undefined && Date.now() - resolvedAt < RESOLVED_BOOKING_TTL_MS;
  },
}));
