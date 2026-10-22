import { create } from "zustand";

export interface ReviewSubjectFilter {
  subjectId: string | null;
  subjectName: string;
}

interface ReviewsDialogState {
  isOpen: boolean;
  subjectFilter: ReviewSubjectFilter | null;
  openDialog: (subject?: ReviewSubjectFilter) => void;
  closeDialog: () => void;
}

export const useReviewDialogStore = create<ReviewsDialogState>((set) => ({
  isOpen: false,
  subjectFilter: null,
  openDialog: (subject) => set({ isOpen: true, subjectFilter: subject ?? null }),
  closeDialog: () => set({ isOpen: false, subjectFilter: null }),
}));
