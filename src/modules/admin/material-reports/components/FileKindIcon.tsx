import { Box } from "@mui/material";
import { FILE_KIND_META } from "@/modules/admin/material-reports/constants/file-kind-meta";
import {
  fileIconBoxSx,
  fileIconWrapperSx,
} from "@/modules/admin/material-reports/styles/material-reports.styles";
import type { AdminMaterialFileKind } from "@/modules/admin/types/admin-material-report-status.type";

interface FileKindIconProps {
  kind: AdminMaterialFileKind;
}

export default function FileKindIcon({ kind }: FileKindIconProps) {
  const meta = FILE_KIND_META[kind] ?? FILE_KIND_META.OTHER;
  const Icon = meta.icon;

  return (
    <Box sx={fileIconWrapperSx}>
      <Box sx={{ ...fileIconBoxSx, backgroundColor: meta.bg, color: meta.fg }} aria-hidden="true">
        <Icon size={20} />
      </Box>
    </Box>
  );
}
