import { Dialog, DialogActions, DialogContent, Box, Typography } from "@mui/material";
import { Flag } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import { reportIconWrapperSx } from "@/modules/student/tutorProfile/styles/reportMaterialStyles";

interface ReportMaterialAlreadyReportedDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ReportMaterialAlreadyReportedDialog({
  open,
  onClose,
}: ReportMaterialAlreadyReportedDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, textAlign: "center", pt: 1 } }}
    >
      <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 2, px: 4 }}>
        <Box sx={reportIconWrapperSx("#FBE2E2")}>
          <Flag size={32} color="#C62828" />
        </Box>

        <Typography variant="h6" fontWeight={700} mb={1}>
          Ya denunciaste este material anteriormente
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Tu denuncia ya está siendo revisada por un administrador. Podés hacer el seguimiento desde
          &quot;Mis Reclamos&quot;.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", px: 4, pb: 3 }}>
        <AppButton appVariant="outline" onClick={onClose} fullWidth>
          Volver
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
