import { create } from "zustand";

interface StudentBadgesStore {
  complaintsCount: number;
  setComplaintsCount: (count: number) => void;
}

export const useStudentBadgesStore = create<StudentBadgesStore>((set) => ({
  complaintsCount: 0,
  setComplaintsCount: (count) => set({ complaintsCount: count }),
}));
