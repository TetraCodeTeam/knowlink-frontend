import { Box, IconButton, Typography } from "@mui/material";
import { Trash2 } from "lucide-react";
import type { Material } from "@/modules/tutor/materials/interfaces/material.interface";
import { getMaterialDisplayName } from "@/modules/tutor/materials/utils/materials.utils";
import { getFileIconAndColor } from "@/modules/tutor/materials/utils/materials.utils";
import {
  fileIconContainerSx,
  materialRowSx,
} from "@/modules/tutor/materials/styles/materialsStyles";

interface MaterialCardProps {
  material: Material;
  onDelete: (material: Material) => void;
}

export default function MaterialCard({ material, onDelete }: MaterialCardProps) {
  const { icon: Icon, bgColor, iconColor } = getFileIconAndColor(material.format);
  const displayName = getMaterialDisplayName(material);

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
      <IconButton
        size="small"
        onClick={() => onDelete(material)}
        aria-label={`Eliminar ${displayName}`}
        sx={{
          color: "#7A2323",
          flexShrink: 0,
          "&:hover": { backgroundColor: "#F4E4E4" },
        }}
      >
        <Trash2 size={18} />
      </IconButton>
    </Box>
  );
}
