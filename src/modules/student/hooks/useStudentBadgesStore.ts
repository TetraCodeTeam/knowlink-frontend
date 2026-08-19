import { create } from "zustand";

interface StudentBadgesStore {
  notificationsCount: number;
  complaintsCount: number;
  setNotificationsCount: (count: number) => void;
  setComplaintsCount: (count: number) => void;
}

export const useStudentBadgesStore = create<StudentBadgesStore>((set) => ({
  notificationsCount: 0,
  complaintsCount: 0,
  setNotificationsCount: (count) => set({ notificationsCount: count }),
  setComplaintsCount: (count) => set({ complaintsCount: count }),
}));
