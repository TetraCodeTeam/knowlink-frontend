import { useCallback, useEffect, useState, type SyntheticEvent } from "react";
import { useSearchParams } from "react-router-dom";
import type { SupportDetailSelection } from "@/modules/support/interfaces/support-detail-selection.type";
import type { SupportTab } from "@/modules/support/constants/support.constants";

const SUPPORT_TAB_VALUES: readonly string[] = ["claims", "materials"];

function parseSupportTab(value: string | null): SupportTab | null {
  return value && SUPPORT_TAB_VALUES.includes(value) ? (value as SupportTab) : null;
}

export function useSupportSelection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<SupportTab>("claims");
  const [selectedDetail, setSelectedDetail] = useState<SupportDetailSelection>(null);

  const tabParam = searchParams.get("tab");
  const claimParam = searchParams.get("claim");
  const materialParam = searchParams.get("material");

  useEffect(() => {
    const tab = parseSupportTab(tabParam);
    if (tab) {
      setActiveTab(tab);
    }
    if (claimParam) {
      setSelectedDetail({ type: "claim", id: claimParam });
    } else if (materialParam) {
      setSelectedDetail({ type: "material", id: materialParam });
    }
  }, [tabParam, claimParam, materialParam]);

  const changeTab = useCallback(
    (_event: SyntheticEvent, value: SupportTab) => {
      setActiveTab(value);
      setSelectedDetail(null);
      setSearchParams({}, { replace: true });
    },
    [setSearchParams]
  );

  const selectClaim = useCallback(
    (claimId: string) => setSelectedDetail({ type: "claim", id: claimId }),
    []
  );
  const selectMaterial = useCallback(
    (materialId: string) => setSelectedDetail({ type: "material", id: materialId }),
    []
  );
  const clearSelection = useCallback(() => {
    setSelectedDetail(null);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return {
    activeTab,
    selectedDetail,
    changeTab,
    selectClaim,
    selectMaterial,
    clearSelection,
  };
}
