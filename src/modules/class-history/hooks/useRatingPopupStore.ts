import { create } from "zustand";

interface RatingPopupState {
  bookingId: string | null;
  open: (bookingId: string) => void;
  close: () => void;
}

export const useRatingPopupStore = create<RatingPopupState>((set) => ({
  bookingId: null,
  open: (bookingId) => set({ bookingId }),
  close: () => set({ bookingId: null }),
}));
