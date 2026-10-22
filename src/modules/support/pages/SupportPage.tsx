import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import { ClaimsSidebar } from "@/modules/support/components/ClaimsSidebar";
import { ClaimsTab } from "@/modules/support/components/ClaimsTab";
import { FileRulesDialog } from "@/modules/support/components/FileRulesDialog";
import { MaterialsSidebar } from "@/modules/support/components/MaterialsSidebar";
import { MaterialsTab } from "@/modules/support/components/MaterialsTab";
import { SupportDetailPanel } from "@/modules/support/components/SupportDetailPanel";
import { SUPPORT_TABS } from "@/modules/support/constants/support.constants";
import { useSupportSelection } from "@/modules/support/hooks/useSupportSelection";
import { useTutorSupport } from "@/modules/support/hooks/useTutorSupport";
import {
  mainCardSx,
  pageLayoutSx,
  pageTitleSx,
  tabsSx,
} from "@/modules/support/styles/supportPage.styles";

export function SupportPage() {
  const navigate = useNavigate();
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const { claims, materials, isLoading, isError, refetch } = useTutorSupport();
  const { activeTab, selectedDetail, changeTab, selectClaim, selectMaterial, clearSelection } =
    useSupportSelection({ claims, materials, isLoading, isError });

  const openClaimsCount = claims.filter((claim) => claim.status === "OPEN").length;
  const inReviewClaimsCount = claims.filter((claim) => claim.status === "IN_REVIEW").length;
  const inReviewMaterialsCount = materials.filter(
    (material) => material.status === "IN_REVIEW"
  ).length;

  const handleOpenRules = useCallback(() => setIsRulesOpen(true), []);
  const handleCloseRules = useCallback(() => setIsRulesOpen(false), []);
  const handleGoToClassHistory = useCallback(() => navigate("/tutor/classes"), [navigate]);

  return (
    <Box sx={pageLayoutSx}>
      <Box component="section" sx={mainCardSx}>
        <Typography component="h1" sx={pageTitleSx}>
          Soporte y solicitudes
        </Typography>

        <Tabs
          value={activeTab}
          onChange={changeTab}
          aria-label="Secciones de soporte y solicitudes"
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
              <Typography color="error">No se pudo cargar la información de soporte.</Typography>
              <Button variant="outlined" onClick={() => void refetch()}>
                Reintentar
              </Button>
            </Box>
          ) : activeTab === "claims" ? (
            <ClaimsTab
              claims={claims}
              onViewDetail={selectClaim}
              selectedClaimId={selectedDetail?.type === "claim" ? selectedDetail.id : undefined}
            />
          ) : (
            <MaterialsTab
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
        <SupportDetailPanel selection={selectedDetail} onClose={clearSelection} />
      ) : activeTab === "claims" ? (
        <ClaimsSidebar
          openCount={openClaimsCount}
          inReviewCount={inReviewClaimsCount}
          onGoToClassHistory={handleGoToClassHistory}
        />
      ) : (
        <MaterialsSidebar
          reportedCount={materials.length}
          inReviewCount={inReviewMaterialsCount}
          onOpenFileRules={handleOpenRules}
        />
      )}

      <FileRulesDialog open={isRulesOpen} onClose={handleCloseRules} />
    </Box>
  );
}
