import { useEffect, useMemo, useState } from "react";
import { Download, FolderOpen, X } from "lucide-react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import type { TutorMaterialItem } from "@/modules/student/tutorProfile/interfaces/tutor.interface";
import { FILE_TYPE_ICON } from "@/modules/student/tutorProfile/utils/material-file-mapping";
import { groupBySubject } from "@/modules/student/tutorProfile/utils/materialTruncation";

interface TutorMaterialModalProps {
  open: boolean;
  onClose: () => void;
  material: TutorMaterialItem[];
  initialSubject?: string;
  onDownload: (materialId: string) => void | Promise<void>;
}

const ALL_SUBJECTS_FILTER = "Todos";

const formatFileSize = (sizeMB: number) => {
  return sizeMB % 1 === 0
    ? `${sizeMB} MB`
    : `${sizeMB.toFixed(2).replace(/\.0+$/, "").replace(".", ",")} MB`;
};

const formatMaterialMetadata = (item: TutorMaterialItem) => {
  if (item.fileSizeMB > 0) {
    return `${item.fileType} · ${formatFileSize(item.fileSizeMB)}`;
  }
  return item.fileType;
};

/**
 * Modal con la lista completa de materiales del tutor, filtrable por
 * materia
 *
 * A diferencia de la card resumen, este modal nunca trunca: muestra
 * todos los ítems de la materia seleccionada sin límite.
 */
export const TutorMaterialModal = ({
  open,
  onClose,
  material,
  initialSubject,
  onDownload,
}: TutorMaterialModalProps) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(ALL_SUBJECTS_FILTER);

  const groupedMaterial = useMemo(() => groupBySubject(material), [material]);
  const subjectNames = useMemo(() => Object.keys(groupedMaterial), [groupedMaterial]);

  useEffect(() => {
    if (!open) return;

    setSelectedSubject(
      initialSubject && subjectNames.includes(initialSubject) ? initialSubject : ALL_SUBJECTS_FILTER
    );
  }, [initialSubject, open, subjectNames]);

  const visibleSubjects =
    selectedSubject === ALL_SUBJECTS_FILTER ? subjectNames : [selectedSubject];

  const getSubjectChipSx = (isSelected: boolean) => ({
    bgcolor: isSelected ? "#C7C8FF" : "#E0E0FA",
    color: "#3A48AD",
    fontWeight: 600,
    borderRadius: 3,
    fontSize: "16px",
    "&:hover": {
      bgcolor: "#DAD9FA",
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 3, pt: 2.5, pb: 1.5 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <FolderOpen size={22} color="#5865C8" />
          <Typography variant="h6" fontWeight={600}>
            Material Académico
          </Typography>
        </Stack>
        <IconButton size="small" onClick={onClose} aria-label="Cerrar">
          <X size={20} />
        </IconButton>
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        sx={{
          px: 3,
          py: 2,
          flexWrap: "wrap",
          rowGap: 1,
          bgcolor: "#F4F3FB",
          border: "1px solid #E0E0FA",
        }}
      >
        <Chip
          label={ALL_SUBJECTS_FILTER}
          onClick={() => setSelectedSubject(ALL_SUBJECTS_FILTER)}
          sx={getSubjectChipSx(selectedSubject === ALL_SUBJECTS_FILTER)}
        />
        {subjectNames.map((subject) => (
          <Chip
            key={subject}
            label={subject}
            onClick={() => setSelectedSubject(subject)}
            sx={getSubjectChipSx(selectedSubject === subject)}
          />
        ))}
      </Stack>

      <DialogContent dividers sx={{ maxHeight: 420 }}>
        <Stack spacing={2}>
          {visibleSubjects.map((subject) => (
            <Box key={subject}>
              <Typography variant="subtitle1" color="#494949" mb={1} fontWeight={550}>
                {subject}
              </Typography>
              <Stack spacing={2}>
                {groupedMaterial[subject].map((item) => {
                  const FileIcon = FILE_TYPE_ICON[item.fileType];
                  return (
                    <Box
                      key={item.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1.5,
                        borderRadius: 3,
                        bgcolor: "#F4F3FB",
                        border: "1px solid #E0E0FA",
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                        <FileIcon size={20} color="#5865C8" />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="subtitle1" fontWeight={600} noWrap>
                            {item.title}
                          </Typography>
                          <Typography variant="subtitle2" color="text.secondary">
                            {formatMaterialMetadata(item)}
                          </Typography>
                        </Box>
                      </Stack>
                      <Button
                        onClick={() => void onDownload(item.id)}
                        variant="contained"
                        size="small"
                        disableElevation
                        endIcon={<Download size={16} />}
                        sx={{ textTransform: "none", borderRadius: 3, flexShrink: 0 }}
                        aria-label={`Descargar ${item.title}`}
                      >
                        Descargar
                      </Button>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
