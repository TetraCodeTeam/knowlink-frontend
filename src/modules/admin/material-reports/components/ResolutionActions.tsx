import { Box, Typography } from "@mui/material";
import AppButton from "@/shared/components/AppButton";
import {
  detailNoteSx,
  resolutionActionsSx,
} from "@/modules/admin/material-reports/styles/material-reports.styles";

interface ResolutionActionsProps {
  onRemove: () => void;
  onDismiss: () => void;
}

export default function ResolutionActions({ onRemove, onDismiss }: ResolutionActionsProps) {
  return (
    <Box>
      <Box sx={resolutionActionsSx}>
        <AppButton appVariant="soft-danger" fullWidth onClick={onRemove}>
          Dar de baja
        </AppButton>
        <AppButton appVariant="outline" fullWidth onClick={onDismiss}>
          Desestimar
        </AppButton>
      </Box>
      <Typography sx={{ ...detailNoteSx, mt: 1.5 }}>
        Dar de baja remueve el archivo y notifica; Desestimar archiva los reportes.
      </Typography>
    </Box>
  );
}
