import { Box } from "@mui/material";
import { MaterialListItem } from "@/modules/support/components/MaterialListItem";
import { SupportEmptyState } from "@/modules/support/components/SupportEmptyState";
import { SupportListSection } from "@/modules/support/components/SupportListSection";
import type { ReportedMaterialResponse } from "@/modules/support/interfaces/responses/reported-material.response";
import { listSx } from "@/modules/support/styles/support.styles";

interface MaterialsTabProps {
  materials: ReportedMaterialResponse[];
  onViewDetail: (materialId: number) => void;
}

export function MaterialsTab({ materials, onViewDetail }: MaterialsTabProps) {
  if (materials.length === 0) {
    return <SupportEmptyState />;
  }

  return (
    <SupportListSection
      title="Historial de reclamos"
      subtitle="Visualizá el avance e intervenciones del equipo académico"
      count={materials.length}
    >
      <Box component="ul" sx={listSx}>
        {materials.map((material) => (
          <MaterialListItem key={material.id} material={material} onViewDetail={onViewDetail} />
        ))}
      </Box>
    </SupportListSection>
  );
}
