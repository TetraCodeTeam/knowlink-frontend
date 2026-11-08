import { Outlet } from "react-router-dom";
import AppShell from "@/modules/app-shell/components/AppShell";
import { StudentTokenWidget } from "@/modules/attendance/components/StudentTokenWidget";
import { useAutoShowStudentToken } from "@/modules/attendance/hooks/useAutoShowStudentToken";
import RatingPopupHost from "@/modules/class-history/components/RatingPopupHost";
import ClaimPopupHost from "@/modules/claim/components/ClaimPopupHost";
import SearchBar from "@/modules/student/components/SearchBar";
import { STUDENT_NAVIGATION } from "@/modules/student/navigation/student-navigation.constants";
import { useStudentNavBadges } from "@/modules/student/navigation/useStudentNavBadges";
import { studentPaths } from "@/routes/paths";

export default function StudentLayout() {
  useAutoShowStudentToken();
  const badgeCounts = useStudentNavBadges();

  return (
    <>
      <AppShell
        navigation={STUDENT_NAVIGATION}
        badgeCounts={badgeCounts}
        showNotifications
        profilePath={studentPaths.profile}
        searchSlot={<SearchBar />}
      >
        <Outlet />
      </AppShell>
      <StudentTokenWidget />
      <RatingPopupHost />
      <ClaimPopupHost />
    </>
  );
}
