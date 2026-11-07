import { Outlet } from "react-router-dom";
import AppShell from "@/modules/app-shell/components/AppShell";
import { TutorSessionConfirmationWidget } from "@/modules/attendance/components/TutorSessionconfirmationwidget";
import { useAutoOpenSessionConfirmation } from "@/modules/attendance/hooks/useAutoOpenSessionConfirmation";
import { useConfirmSessionAttendance } from "@/modules/attendance/hooks/useConfirmSessionAttendance";
import RatingPopupHost from "@/modules/class-history/components/RatingPopupHost";
import ClaimPopupHost from "@/modules/claim/components/ClaimPopupHost";
import { TUTOR_NAVIGATION } from "@/modules/tutor/navigation/tutor-navigation.constants";
import { useTutorNavBadges } from "@/modules/tutor/navigation/useTutorNavBadges";
import { tutorPaths } from "@/routes/paths";

export default function TutorLayout() {
  useAutoOpenSessionConfirmation();
  const { mutateAsync: confirmSessionAttendance } = useConfirmSessionAttendance();
  const badgeCounts = useTutorNavBadges();

  return (
    <>
      <AppShell
        navigation={TUTOR_NAVIGATION}
        badgeCounts={badgeCounts}
        showNotifications
        profilePath={tutorPaths.profile}
      >
        <Outlet />
      </AppShell>
      <TutorSessionConfirmationWidget
        onConfirm={({ sessionId, code }) => confirmSessionAttendance({ sessionId, code })}
      />
      <RatingPopupHost />
      <ClaimPopupHost />
    </>
  );
}
