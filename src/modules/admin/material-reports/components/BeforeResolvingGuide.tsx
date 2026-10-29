import { Box, Typography } from "@mui/material";
import {
  guideItemSx,
  guideListSx,
  guideNumberSx,
  guideSx,
  guideTextSx,
  guideTitleSx,
} from "@/modules/admin/material-reports/styles/material-reports.styles";

const GUIDELINES = [
  "Descargá y auditá el archivo: los motivos denunciados no siempre reflejan con precisión el contenido real.",
  "Dar de baja retira el material para todos los alumnos y notifica al tutor (y a quien denunció). Desestimar mantiene la visibilidad y registra tu nota en auditoría interna.",
  "Resolución unificada: si un archivo tiene varias denuncias, tu decisión resuelve todos los tickets simultáneamente.",
];

export default function BeforeResolvingGuide() {
  return (
    <Box sx={guideSx}>
      <Typography component="h3" sx={guideTitleSx}>
        Antes de resolver
      </Typography>
      <Box component="ol" sx={guideListSx}>
        {GUIDELINES.map((guideline, index) => (
          <Box component="li" key={guideline} sx={guideItemSx}>
            <Box component="span" sx={guideNumberSx} aria-hidden="true">
              {index + 1}
            </Box>
            <Typography sx={guideTextSx}>{guideline}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
