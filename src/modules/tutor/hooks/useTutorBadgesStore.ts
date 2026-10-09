import { create } from "zustand";

interface TutorBadgesStore {
  notificationsCount: number;
  requestsCount: number;
  setNotificationsCount: (count: number) => void;
  setRequestsCount: (count: number) => void;
}

export const useTutorBadgesStore = create<TutorBadgesStore>((set) => ({
  notificationsCount: 0,
  requestsCount: 0,
  setNotificationsCount: (count) => set({ notificationsCount: count }),
  setRequestsCount: (count) => set({ requestsCount: count }),
}));
