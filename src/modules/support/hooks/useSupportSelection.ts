import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from "react";
import type { SupportDetailSelection } from "@/modules/support/interfaces/support-detail-selection.type";
import type { SupportTab } from "@/modules/support/constants/support.constants";
import type { ClaimResponse } from "@/modules/support/interfaces/responses/claim.response";
import type { ReportedMaterialResponse } from "@/modules/support/interfaces/responses/reported-material.response";

interface UseSupportSelectionParams {
  claims: ClaimResponse[];
  materials: ReportedMaterialResponse[];
  isLoading: boolean;
  isError: boolean;
}

export function useSupportSelection({
  claims,
  materials,
  isLoading,
  isError,
}: UseSupportSelectionParams) {
  const [activeTab, setActiveTab] = useState<SupportTab>("claims");
  const [selectedDetail, setSelectedDetail] = useState<SupportDetailSelection>(null);
  const initializedSelection = useRef(false);

  // Selects the first item of the active tab once, when the data first arrives.
  useEffect(() => {
    if (isLoading || isError || initializedSelection.current) return;
    initializedSelection.current = true;
    if (activeTab === "claims" && claims.length > 0) {
      setSelectedDetail({ type: "claim", id: claims[0].id });
    } else if (activeTab === "materials" && materials.length > 0) {
      setSelectedDetail({ type: "material", id: materials[0].id });
    }
  }, [activeTab, claims, isError, isLoading, materials]);

  const changeTab = useCallback(
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

  const selectClaim = useCallback(
    (claimId: string) => setSelectedDetail({ type: "claim", id: claimId }),
    []
  );
  const selectMaterial = useCallback(
    (materialId: string) => setSelectedDetail({ type: "material", id: materialId }),
    []
  );
  const clearSelection = useCallback(() => setSelectedDetail(null), []);

  return {
    activeTab,
    selectedDetail,
    changeTab,
    selectClaim,
    selectMaterial,
    clearSelection,
  };
}
