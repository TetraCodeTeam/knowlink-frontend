import { useMemo } from "react";
import { MOCK_SUBJECTS } from "@/modules/student/booking/mockdata";

export function useBookingSubjects() {
  return useMemo(() => MOCK_SUBJECTS, []);
}
