import { create } from "zustand";

interface TutorBadgesStore {
  requestsCount: number;
  setRequestsCount: (count: number) => void;
}

export const useTutorBadgesStore = create<TutorBadgesStore>((set) => ({
  requestsCount: 0,
  setRequestsCount: (count) => set({ requestsCount: count }),
}));
