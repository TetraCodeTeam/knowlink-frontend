import { Box } from "@mui/material";
import FrankieEmptyState from "@/shared/frankie/FrankieEmptyState";
import { emptyStateSx } from "@/modules/tutor/materials/styles/materialsStyles";

export default function MaterialEmptyState() {
  return (
    <Box sx={emptyStateSx}>
      <FrankieEmptyState
        compact
        mood="happy"
        accessories={["sparkles"]}
        size={220}
        message="Actualmente no hay material de estudio cargado en esta sección"
      />
    </Box>
  );
}
