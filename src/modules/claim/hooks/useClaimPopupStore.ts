import { create } from "zustand";

interface ClaimPopupState {
  bookingId: string | null;
  open: (bookingId: string) => void;
  close: () => void;
}

export const useClaimPopupStore = create<ClaimPopupState>((set) => ({
  bookingId: null,
  open: (bookingId) => set({ bookingId }),
  close: () => set({ bookingId: null }),
}));
