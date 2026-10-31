import { Box } from "@mui/material";
import { StudentMaterialListItem } from "@/modules/student/support/components/StudentMaterialListItem";
import { SupportEmptyState } from "@/modules/support/components/SupportEmptyState";
import { SupportListSection } from "@/modules/support/components/SupportListSection";
import type { StudentMaterialReportResponse } from "@/modules/student/support/interfaces/responses/student-support.response";
import { listSx } from "@/modules/support/styles/supportList.styles";

interface StudentMaterialsTabProps {
  materials: StudentMaterialReportResponse[];
  onViewDetail: (reportId: string) => void;
  selectedMaterialId?: string;
}

export function StudentMaterialsTab({
  materials,
  onViewDetail,
  selectedMaterialId,
}: StudentMaterialsTabProps) {
  if (materials.length === 0) {
    return <SupportEmptyState />;
  }

  return (
    <SupportListSection
      title="Historial de denuncias"
      subtitle="Visualizá el avance e intervenciones del equipo académico"
      count={materials.length}
    >
      <Box component="ul" sx={listSx}>
        {materials.map((material) => (
          <StudentMaterialListItem
            key={material.reportId}
            material={material}
            onViewDetail={onViewDetail}
            selected={material.reportId === selectedMaterialId}
          />
        ))}
      </Box>
    </SupportListSection>
  );
}
