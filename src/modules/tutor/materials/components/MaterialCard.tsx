import { Box, Typography } from "@mui/material";
import type { Material } from "@/modules/tutor/materials/interfaces/material.interface";
import { getFileIconAndColor } from "@/modules/tutor/materials/utils/materials.utils";
import { fileIconContainerSx, materialRowSx } from "@/modules/tutor/materials/styles/materialsStyles";

interface MaterialCardProps {
  material: Material;
}

export default function MaterialCard({ material }: MaterialCardProps) {
  const { icon: Icon, bgColor, iconColor } = getFileIconAndColor(material.format);
  const fileExtension = material.originalFileName.split(".").pop()?.toUpperCase() || "";
  const displayName = `${material.name}.${fileExtension}`;

  return (
    <Box sx={materialRowSx}>
      <Box sx={fileIconContainerSx(bgColor)}>
        <Icon size={20} color={iconColor} strokeWidth={1.8} />
      </Box>
      <Typography
        sx={{
          fontSize: "17px",
          fontWeight: 500,
          color: "#231D58",
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {displayName}
      </Typography>
    </Box>
  );
}
