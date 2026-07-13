import { create } from "zustand";

interface ReviewsDialogState {
  isOpen: boolean;
  subjectFilter: string | null;
  openDialog: (subject?: string) => void;
  closeDialog: () => void;
  setSubjectFilter: (subject: string | null) => void;
}

export const useReviewsDialogStore = create<ReviewsDialogState>((set) => ({
  isOpen: false,
  subjectFilter: null,
  openDialog: (subject) => set({ isOpen: true, subjectFilter: subject ?? null }),
  closeDialog: () => set({ isOpen: false, subjectFilter: null }),
  setSubjectFilter: (subject) => set({ subjectFilter: subject }),
}));