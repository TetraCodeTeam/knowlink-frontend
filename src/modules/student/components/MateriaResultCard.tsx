import { Box, Card, CardActionArea, Typography } from "@mui/material";
import type { SubjectSummary } from "../interfaces/tutor-search-result.interface";
import { getCareerIcon } from "../icons/career-icon";

const BRAND_COLOR = "#5865C8";
const ICON_BOX_BG = "#EDEBFA";

interface MateriaResultCardProps {
  materia: SubjectSummary;
  onClick: () => void;
  highlighted?: boolean;
}

export default function MateriaResultCard({
  materia,
  onClick,
  highlighted,
}: MateriaResultCardProps) {
  const CareerIcon = getCareerIcon(materia.career);

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderColor: highlighted ? BRAND_COLOR : undefined,
        borderWidth: highlighted ? 2 : 1,
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 2,
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "10px",
            backgroundColor: ICON_BOX_BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CareerIcon size={20} color={BRAND_COLOR} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }} noWrap>
            {materia.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
            {materia.career}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}
