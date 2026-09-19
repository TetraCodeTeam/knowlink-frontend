import { useRef, useState } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import AppButton from "@/shared/components/AppButton";
import { useUploadMaterial } from "@/modules/tutor/materials/hooks/useUploadMaterial";
import { useMySubjectsWithCatalogId } from "@/modules/tutor/materials/hooks/useMySubjectsWithCatalogId";
import { allowedFormatsSx, dropAreaSx } from "@/modules/tutor/materials/styles/materialsStyles";
import {
  DROP_AREA_COLORS,
  MAX_FILE_SIZE_BYTES,
  VALIDATION_MESSAGES,
} from "@/modules/tutor/materials/constants/materials.constants";
import { isValidFormat } from "@/modules/tutor/materials/utils/materials.utils";

interface UploadMaterialDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadMaterialDialog({ open, onClose }: UploadMaterialDialogProps) {
  const { uploadMaterial, isPending } = useUploadMaterial();
  const { subjects } = useMySubjectsWithCatalogId();

  const [materialName, setMaterialName] = useState("");
  const [selectedCatalogSubjectId, setSelectedCatalogSubjectId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!isValidFormat(file)) {
      toast.error(VALIDATION_MESSAGES.invalidFormat);
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(VALIDATION_MESSAGES.fileTooLarge);
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) handleFileSelect(file);
    e.currentTarget.value = "";
  };

  const handleSubmit = async () => {
    if (!materialName.trim()) {
      toast.error("Debés ingresar un nombre para el material");
      return;
    }
    if (!selectedCatalogSubjectId) {
      toast.error(VALIDATION_MESSAGES.noMaterial);
      return;
    }
    if (!selectedFile) return;
    try {
      await uploadMaterial({
        name: materialName.trim(),
        subjectId: selectedCatalogSubjectId,
        file: selectedFile,
      });
      toast.success("Material subido correctamente");
      handleClose();
    } catch {
      // httpClient interceptor already shows the server error message
    }
  };

  const handleClose = () => {
    if (isPending) return;
    setMaterialName("");
    setSelectedFile(null);
    setSelectedCatalogSubjectId("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle
        sx={{
          fontSize: "22px",
          fontWeight: 600,
          pt: 3,
          pb: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Agregar Recurso
        <IconButton size="small" onClick={handleClose} disabled={isPending} aria-label="Cerrar">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: "12px !important" }}>
        {/* Material name */}
        <Box>
          <Typography id="material-name-label" sx={{ fontSize: "14px", fontWeight: 600, mb: 1, color: "#333" }}>
            Nombre del material*
          </Typography>
          <TextField
            value={materialName}
            onChange={(e) => setMaterialName(e.target.value)}
            disabled={isPending}
            fullWidth
            placeholder="Ingresá el nombre del material"
            inputProps={{ "aria-labelledby": "material-name-label" }}
            sx={{
              "& .MuiInputBase-input": { fontSize: "16px" },
            }}
          />
        </Box>

        {/* Subject dropdown */}
        <Box>
          <Typography id="subject-select-label" sx={{ fontSize: "14px", fontWeight: 600, mb: 1, color: "#333" }}>
            Materia*
          </Typography>
          <FormControl fullWidth>
            <Select
              labelId="subject-select-label"
              value={selectedCatalogSubjectId}
              onChange={(e) => setSelectedCatalogSubjectId(e.target.value)}
              disabled={isPending}
              sx={{ fontSize: "16px" }}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Seleccionar materia
              </MenuItem>
              {subjects.map((subject) => (
                <MenuItem
                  key={subject.tutorSubjectId}
                  value={subject.catalogSubjectId}
                  sx={{ fontSize: "16px" }}
                >
                  {subject.subjectName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Drop area */}
        <Box
          onClick={() => !isPending && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          sx={{
            ...dropAreaSx,
            borderColor: isDragOver ? "#9597E4" : DROP_AREA_COLORS.border,
            backgroundColor: isDragOver ? "#EEEDFE" : DROP_AREA_COLORS.background,
            cursor: isPending ? "default" : "pointer",
          }}
        >
          {selectedFile ? (
            <>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                disabled={isPending}
                aria-label="Eliminar archivo"
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <Trash2 size={18} />
              </IconButton>
              <Upload size={34} color={DROP_AREA_COLORS.text} strokeWidth={1.5} />
              <Typography sx={{ color: DROP_AREA_COLORS.text, fontWeight: 500, mt: 1.5, fontSize: "16px" }}>
                {selectedFile.name}
              </Typography>
            </>
          ) : (
            <>
              <Upload size={34} color={DROP_AREA_COLORS.text} strokeWidth={1.5} />
              <Typography sx={{ color: DROP_AREA_COLORS.text, mt: 1.5, fontSize: "16px" }}>
                Arrastrá tu archivo o hacé click para elegirlo
              </Typography>
            </>
          )}
        </Box>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.xlsx"
          onChange={handleInputChange}
          hidden
        />

        <Typography sx={{ ...allowedFormatsSx, fontSize: "14px" }}>
          Formatos permitidos: PNG, PDF, XLSX
        </Typography>
      </DialogContent>

      <DialogActions sx={{ gap: 1.5, px: 3, pb: 3 }}>
        <AppButton appVariant="outline" onClick={handleClose} disabled={isPending} fullWidth>
          Cancelar
        </AppButton>
        <AppButton
          appVariant="primary"
          onClick={() => void handleSubmit()}
          loading={isPending}
          disabled={!selectedFile || !selectedCatalogSubjectId || !materialName.trim()}
          fullWidth
        >
          Subir recurso
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
