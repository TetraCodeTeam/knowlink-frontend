import { Dialog, DialogContent, Box, IconButton, Typography } from "@mui/material";
import { BadgeCheck, X } from "lucide-react";
import { reportIconWrapperSx } from "@/modules/student/tutorProfile/styles/reportMaterialStyles";

interface ReportMaterialSuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ReportMaterialSuccessDialog({
  open,
  onClose,
}: ReportMaterialSuccessDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, textAlign: "center", pt: 1, position: "relative" } }}
    >
      <IconButton
        onClick={onClose}
        size="small"
        aria-label="Cerrar"
        sx={{ position: "absolute", top: "12px", right: "12px" }}
      >
        <X size={20} />
      </IconButton>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 3, px: 4, pb: 4 }}
      >
        <Box sx={reportIconWrapperSx("#DCEBFF")}>
          <BadgeCheck size={32} color="#0B2447" />
        </Box>

        <Typography variant="h6" fontWeight={700} mb={1}>
          Denuncia enviada
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Recibimos tu denuncia y un administrador la va a revisar.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
