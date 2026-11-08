import { Outlet } from "react-router-dom";
import { ADMIN_NAVIGATION } from "@/modules/admin/constants/admin-nav-items";
import { useAdminNavBadgeCounts } from "@/modules/admin/navigation/hooks/useAdminNavBadgeCounts";
import AppShell from "@/modules/app-shell/components/AppShell";

export default function AdminLayout() {
  const badgeCounts = useAdminNavBadgeCounts();

  return (
    <AppShell
      navigation={ADMIN_NAVIGATION}
      badgeCounts={badgeCounts}
      topbarLabel="Panel de administración"
    >
      <Outlet />
    </AppShell>
  );
}
