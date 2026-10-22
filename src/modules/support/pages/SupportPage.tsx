import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import { ClaimsSidebar } from "@/modules/support/components/ClaimsSidebar";
import { ClaimsTab } from "@/modules/support/components/ClaimsTab";
import { FileRulesDialog } from "@/modules/support/components/FileRulesDialog";
import { MaterialsSidebar } from "@/modules/support/components/MaterialsSidebar";
import { MaterialsTab } from "@/modules/support/components/MaterialsTab";
import { SupportDetailPanel } from "@/modules/support/components/SupportDetailPanel";
import { SUPPORT_TABS, type SupportTab } from "@/modules/support/constants/support.constants";
import { useTutorSupport } from "@/modules/support/hooks/useTutorSupport";
import {
  mainCardSx,
  pageLayoutSx,
  pageTitleSx,
  tabsSx,
} from "@/modules/support/styles/support.styles";

export function SupportPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SupportTab>("claims");
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<{
    type: "claim" | "material";
    id: string;
  } | null>(null);
  const { claims, materials, isLoading, isError, refetch } = useTutorSupport();
  const initializedSelection = useRef(false);

  useEffect(() => {
    if (isLoading || isError || initializedSelection.current) return;
    initializedSelection.current = true;
    if (activeTab === "claims" && claims.length > 0) {
      setSelectedDetail({ type: "claim", id: claims[0].id });
    } else if (activeTab === "materials" && materials.length > 0) {
      setSelectedDetail({ type: "material", id: materials[0].id });
    }
  }, [activeTab, claims, isError, isLoading, materials]);

  const openClaimsCount = claims.filter((claim) => claim.status === "OPEN").length;
  const inReviewClaimsCount = claims.filter((claim) => claim.status === "IN_REVIEW").length;
  const inReviewMaterialsCount = materials.filter(
    (material) => material.status === "IN_REVIEW"
  ).length;

  const handleTabChange = useCallback(
    (_event: SyntheticEvent, value: SupportTab) => {
      setActiveTab(value);
      if (value === "claims") {
        setSelectedDetail(claims[0] ? { type: "claim", id: claims[0].id } : null);
      } else {
        setSelectedDetail(materials[0] ? { type: "material", id: materials[0].id } : null);
      }
    },
    [claims, materials]
  );

  const handleOpenRules = useCallback(() => setIsRulesOpen(true), []);
  const handleCloseRules = useCallback(() => setIsRulesOpen(false), []);

  const handleViewClaimDetail = useCallback(
    (claimId: string) => setSelectedDetail({ type: "claim", id: claimId }),
    []
  );
  const handleViewMaterialDetail = useCallback(
    (materialId: string) => setSelectedDetail({ type: "material", id: materialId }),
    []
  );
  const handleGoToClassHistory = useCallback(() => navigate("/tutor/classes"), [navigate]);

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
              onViewDetail={handleViewClaimDetail}
              selectedClaimId={selectedDetail?.type === "claim" ? selectedDetail.id : undefined}
            />
          ) : (
            <MaterialsTab
              materials={materials}
              onViewDetail={handleViewMaterialDetail}
              selectedMaterialId={
                selectedDetail?.type === "material" ? selectedDetail.id : undefined
              }
            />
          )}
        </Box>
      </Box>

      {selectedDetail ? (
        <SupportDetailPanel selection={selectedDetail} onClose={() => setSelectedDetail(null)} />
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
