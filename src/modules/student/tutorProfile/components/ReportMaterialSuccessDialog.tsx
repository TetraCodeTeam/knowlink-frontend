import { Dialog, DialogContent, IconButton, Typography } from "@mui/material";
import { X } from "lucide-react";
import FrankieHero from "@/shared/frankie/FrankieHero";

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
        <FrankieHero mood="happy" accessories={["sparkles"]} />

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
