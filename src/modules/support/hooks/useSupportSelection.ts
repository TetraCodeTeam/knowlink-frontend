import { useCallback, useState, type SyntheticEvent } from "react";
import type { SupportDetailSelection } from "@/modules/support/interfaces/support-detail-selection.type";
import type { SupportTab } from "@/modules/support/constants/support.constants";

export function useSupportSelection() {
  const [activeTab, setActiveTab] = useState<SupportTab>("claims");
  const [selectedDetail, setSelectedDetail] = useState<SupportDetailSelection>(null);

  const changeTab = useCallback((_event: SyntheticEvent, value: SupportTab) => {
    setActiveTab(value);
    setSelectedDetail(null);
  }, []);

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
