import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Download, FileX, X } from "lucide-react";
import FrankieErrorState from "@/shared/frankie/FrankieErrorState";
import { useMaterialDownload } from "@/shared/material-preview/hooks/useMaterialDownload";
import { useMaterialPreview } from "@/shared/material-preview/hooks/useMaterialPreview";
import type { MaterialPreviewDialogProps } from "@/shared/material-preview/interfaces/previewable-material.interface";

const centeredSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
};

/**
 * Visor de materiales compartido por el tutor y el alumno (US-16, US-17 y US-26).
 * PDF e PNG se muestran desde una URL blob; el resto de los formatos no tiene vista
 * previa y solo ofrece descargar el archivo.
 */
export default function MaterialPreviewDialog({
  open,
  onClose,
  material,
}: MaterialPreviewDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { objectUrl, isLoading, isError, refetch, kind } = useMaterialPreview(material, open);
  const { downloadMaterial } = useMaterialDownload();

  if (!material) return null;

  const renderBody = () => {
    if (kind === "unsupported") {
      return (
        <Box sx={{ ...centeredSx, flexDirection: "column", gap: 1, textAlign: "center" }}>
          <FileX size={40} color="#8A8AA3" strokeWidth={1.5} />
          <Typography sx={{ fontSize: "15px", color: "#6B6B80" }}>
            No hay vista previa disponible para este formato.
          </Typography>
        </Box>
      );
    }
    if (isError) {
      return <FrankieErrorState message="No pudimos cargar la vista previa." onRetry={refetch} />;
    }
    if (!objectUrl || isLoading) {
      return (
        <Box sx={centeredSx}>
          <CircularProgress aria-label="Cargando vista previa" />
        </Box>
      );
    }
    if (kind === "pdf") {
      return (
        <iframe
          src={objectUrl}
          title={`Vista previa de ${material.title}`}
          style={{ width: "100%", height: "100%", border: 0 }}
        />
      );
    }
    return (
      <img
        src={objectUrl}
        alt={material.title}
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
      />
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          pr: 1.5,
        }}
      >
        <Typography
          variant="h6"
          component="span"
          noWrap
          title={material.title}
          sx={{ minWidth: 0, display: "block" }}
        >
          {material.title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
          <Button
            startIcon={<Download size={16} />}
            onClick={() => void downloadMaterial(material)}
            sx={{ color: "#5865C8", textTransform: "none", fontWeight: 600 }}
          >
            Descargar
          </Button>
          <IconButton size="small" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          height: { xs: "100%", md: "70vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "auto",
        }}
      >
        {renderBody()}
      </DialogContent>
    </Dialog>
  );
}
