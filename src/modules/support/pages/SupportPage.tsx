import { useCallback, useState, type SyntheticEvent } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { ClaimsSidebar } from "@/modules/support/components/ClaimsSidebar";
import { ClaimsTab } from "@/modules/support/components/ClaimsTab";
import { FileRulesDialog } from "@/modules/support/components/FileRulesDialog";
import { MaterialsSidebar } from "@/modules/support/components/MaterialsSidebar";
import { MaterialsTab } from "@/modules/support/components/MaterialsTab";
import { SUPPORT_TABS, type SupportTab } from "@/modules/support/constants/support.constants";
import { MOCK_CLAIMS, MOCK_MATERIALS } from "@/modules/support/mocks/support.mocks";
import {
  mainCardSx,
  pageLayoutSx,
  pageTitleSx,
  tabsSx,
} from "@/modules/support/styles/support.styles";

export function SupportPage() {
  const [activeTab, setActiveTab] = useState<SupportTab>("claims");
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  // TODO: reemplazar por los hooks de TanStack Query (useClaims, useReportedMaterials).
  const claims = MOCK_CLAIMS;
  const materials = MOCK_MATERIALS;

  const openClaimsCount = claims.filter((claim) => claim.status === "OPEN").length;
  const inReviewClaimsCount = claims.filter((claim) => claim.status === "IN_REVIEW").length;
  const inReviewMaterialsCount = materials.filter(
    (material) => material.status === "IN_REVIEW"
  ).length;

  const handleTabChange = useCallback((_event: SyntheticEvent, value: SupportTab) => {
    setActiveTab(value);
  }, []);

  const handleOpenRules = useCallback(() => setIsRulesOpen(true), []);
  const handleCloseRules = useCallback(() => setIsRulesOpen(false), []);

  // TODO: navegar al detalle del reclamo / material cuando exista la ruta.
  const handleViewClaimDetail = useCallback((_claimId: number) => undefined, []);
  const handleViewMaterialDetail = useCallback((_materialId: number) => undefined, []);
  // TODO: navegar al historial de clases (inicio del flujo "nuevo reclamo").
  const handleGoToClassHistory = useCallback(() => undefined, []);

  return (
    <Box sx={pageLayoutSx}>
      <Box component="section" sx={mainCardSx}>
        <Typography component="h1" sx={pageTitleSx}>
          Soporte y solicitudes
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
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
          {activeTab === "claims" ? (
            <ClaimsTab claims={claims} onViewDetail={handleViewClaimDetail} />
          ) : (
            <MaterialsTab materials={materials} onViewDetail={handleViewMaterialDetail} />
          )}
        </Box>
      </Box>

      {activeTab === "claims" ? (
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
