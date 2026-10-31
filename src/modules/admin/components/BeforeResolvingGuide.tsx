import { Box, Typography } from "@mui/material";
import {
  guideItemSx,
  guideListSx,
  guideNumberSx,
  guideSx,
  guideTextSx,
  guideTitleSx,
} from "@/modules/admin/styles/admin-list.styles";

interface BeforeResolvingGuideProps {
  guidelines: string[];
  title?: string;
}

export default function BeforeResolvingGuide({
  guidelines,
  title = "Antes de resolver",
}: BeforeResolvingGuideProps) {
  return (
    <Box sx={guideSx}>
      <Typography component="h3" sx={guideTitleSx}>
        {title}
      </Typography>
      <Box component="ol" sx={guideListSx}>
        {guidelines.map((guideline, index) => (
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
