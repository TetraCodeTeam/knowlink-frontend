import { useCallback, useState } from "react";
import { Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import AppButton from "@/shared/components/AppButton";
import { StudentClaimsSidebar } from "@/modules/student/support/components/StudentClaimsSidebar";
import { StudentClaimsTab } from "@/modules/student/support/components/StudentClaimsTab";
import { StudentFileRulesDialog } from "@/modules/student/support/components/StudentFileRulesDialog";
import { StudentMaterialsSidebar } from "@/modules/student/support/components/StudentMaterialsSidebar";
import { StudentMaterialsTab } from "@/modules/student/support/components/StudentMaterialsTab";
import { StudentSupportDetailPanel } from "@/modules/student/support/components/StudentSupportDetailPanel";
import { useStudentSupport } from "@/modules/student/support/hooks/useStudentSupport";
import { SUPPORT_TABS } from "@/modules/support/constants/support.constants";
import { useSupportSelection } from "@/modules/support/hooks/useSupportSelection";
import {
  mainCardSx,
  pageLayoutSx,
  pageTitleSx,
  tabsSx,
} from "@/modules/support/styles/supportPage.styles";

export function StudentSupportPage() {
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const { summary, claims, materials, isLoading, isError, refetch } = useStudentSupport();
  const { activeTab, selectedDetail, changeTab, selectClaim, selectMaterial, clearSelection } =
    useSupportSelection();

  const handleOpenRules = useCallback(() => setIsRulesOpen(true), []);
  const handleCloseRules = useCallback(() => setIsRulesOpen(false), []);

  return (
    <Box sx={pageLayoutSx}>
      <Box component="section" sx={mainCardSx}>
        <Typography component="h1" sx={pageTitleSx}>
          Mis reclamos
        </Typography>

        <Tabs
          value={activeTab}
          onChange={changeTab}
          aria-label="Secciones de mis reclamos"
          sx={tabsSx}
        >
          {SUPPORT_TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              id={`support-tab-${tab.value}`}
              aria-controls={`support-panel-${tab.value}`}
            />
          ))}
        </Tabs>

        <Box
          role="tabpanel"
          id={`support-panel-${activeTab}`}
          aria-labelledby={`support-tab-${activeTab}`}
        >
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : isError ? (
            <Box
              sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 8 }}
            >
              <Typography color="error">
                No se pudo cargar la información de tus reclamos.
              </Typography>
              <AppButton appVariant="outline" onClick={() => void refetch()}>
                Reintentar
              </AppButton>
            </Box>
          ) : activeTab === "claims" ? (
            <StudentClaimsTab
              claims={claims}
              onViewDetail={selectClaim}
              selectedClaimId={selectedDetail?.type === "claim" ? selectedDetail.id : undefined}
            />
          ) : (
            <StudentMaterialsTab
              materials={materials}
              onViewDetail={selectMaterial}
              selectedMaterialId={
                selectedDetail?.type === "material" ? selectedDetail.id : undefined
              }
            />
          )}
        </Box>
      </Box>

      {selectedDetail ? (
        <StudentSupportDetailPanel
          key={`${selectedDetail.type}-${selectedDetail.id}`}
          selection={selectedDetail}
          onClose={clearSelection}
        />
      ) : activeTab === "claims" ? (
        <StudentClaimsSidebar
          openCount={summary?.sessionClaims.pending ?? 0}
          inReviewCount={summary?.sessionClaims.inReview ?? 0}
        />
      ) : (
        <StudentMaterialsSidebar
          reportedCount={summary?.materialReports.total ?? 0}
          inReviewCount={summary?.materialReports.inReview ?? 0}
          onOpenFileRules={handleOpenRules}
        />
      )}

      <StudentFileRulesDialog open={isRulesOpen} onClose={handleCloseRules} />
    </Box>
  );
}
