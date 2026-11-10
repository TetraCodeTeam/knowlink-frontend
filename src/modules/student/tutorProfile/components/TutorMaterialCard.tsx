import { useMemo, useState } from "react";
import { Box, Card, CardContent, IconButton, Stack, Typography } from "@mui/material";
import { Download, Eye, FolderLock, FolderOpen } from "lucide-react";

import type { TutorMaterialItem } from "@/modules/student/tutorProfile/interfaces/tutor.interface";
import { FILE_TYPE_ICON } from "@/modules/student/tutorProfile/utils/material-file-mapping";
import { formatMaterialMetadata } from "@/modules/student/tutorProfile/utils/materialFormatting";
import {
  buildMaterialPreview,
  groupBySubject,
} from "@/modules/student/tutorProfile/utils/materialTruncation";
import { TutorMaterialModal } from "@/modules/student/tutorProfile/components/TutorMaterialModal";
import ReportMaterialFlow from "@/modules/student/tutorProfile/components/ReportMaterialFlow";
import MaterialPreviewDialog from "@/shared/material-preview/components/MaterialPreviewDialog";

interface TutorMaterialCardProps {
  material: TutorMaterialItem[];
  hasConfirmedBooking: boolean;
  onDownload: (materialId: string) => void | Promise<void>;
}

export const TutorMaterialCard = ({
  material,
  hasConfirmedBooking,
  onDownload,
}: TutorMaterialCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialSubject, setModalInitialSubject] = useState<string | undefined>(undefined);
  const [previewItem, setPreviewItem] = useState<TutorMaterialItem | null>(null);

  const groupedMaterial = useMemo(() => groupBySubject(material), [material]);
  const { preview, hasMoreSubjects, subjectsWithMoreItems } = useMemo(
    () => buildMaterialPreview(groupedMaterial),
    [groupedMaterial]
  );

  const openModal = (subject?: string) => {
    setModalInitialSubject(subject);
    setIsModalOpen(true);
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 1.75, md: 2 }, "&:last-child": { pb: { xs: 1.75, md: 2 } } }}>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <FolderOpen size={20} color="#5865C8" />
          <Typography fontSize={18} fontWeight={500}>
            Material Académico
          </Typography>
        </Stack>

        {!hasConfirmedBooking ? (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Box sx={{ opacity: 0.5, display: "inline-flex" }}>
              <FolderLock size={28} color="#5865C8" />
            </Box>
            <Typography fontSize={14} fontWeight={600} mt={1}>
              Material Bloqueado
            </Typography>
            <Typography fontSize={12.5} color="text.secondary">
              Reservá y completá una sesión con este tutor para acceder a su material de estudio.
            </Typography>
          </Box>
        ) : (
          <>
            <Stack spacing={1.25}>
              {Object.entries(preview).map(([subject, items]) => (
                <Box key={subject}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                    mt={2}
                  >
                    <Typography fontSize={14} color="#494949" fontWeight={550}>
                      {subject}
                    </Typography>
                    {subjectsWithMoreItems.includes(subject) && (
                      <Typography
                        component="button"
                        onClick={() => openModal(subject)}
                        variant="subtitle2"
                        sx={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "primary.main",
                          fontWeight: 600,
                          p: 0,
                        }}
                      >
                        Ver más
                      </Typography>
                    )}
                  </Stack>
                  <Stack spacing={1.25}>
                    {items.map((item) => {
                      const FileIcon = FILE_TYPE_ICON[item.fileType];
                      return (
                        <Box
                          key={item.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: 1.25,
                            borderRadius: 3,
                            bgcolor: "#F4F3FB",
                            border: "1px solid #E0E0FA",
                          }}
                        >
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <FileIcon size={18} color="#5865C8" />
                            <Box>
                              <Typography fontSize={14} fontWeight={550}>
                                {item.title}
                              </Typography>
                              <Typography fontSize={12.5} color="text.secondary">
                                {formatMaterialMetadata(item)}
                              </Typography>
                            </Box>
                          </Stack>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <ReportMaterialFlow
                              materialId={item.id}
                              materialTitle={item.title}
                              alreadyReported={item.alreadyReported}
                            />
                            <IconButton
                              onClick={() => setPreviewItem(item)}
                              size="small"
                              aria-label={`Ver ${item.title}`}
                            >
                              <Eye size={18} color="#5865C8" />
                            </IconButton>
                            <IconButton
                              onClick={() => void onDownload(item.id)}
                              size="small"
                              aria-label={`Descargar ${item.title}`}
                            >
                              <Download size={18} color="#5865C8" />
                            </IconButton>
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              ))}
            </Stack>

            {hasMoreSubjects && (
              <Typography
                component="button"
                onClick={() => openModal(undefined)}
                variant="subtitle2"
                sx={{
                  display: "block",
                  mt: 1.5,
                  ml: "auto",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "primary.main",
                  fontWeight: 600,
                  p: 0,
                }}
              >
                Ver Todo
              </Typography>
            )}

            <TutorMaterialModal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              material={material}
              initialSubject={modalInitialSubject}
              onDownload={onDownload}
              onPreview={setPreviewItem}
            />
          </>
        )}

        <MaterialPreviewDialog
          open={previewItem !== null}
          onClose={() => setPreviewItem(null)}
          material={
            previewItem && {
              id: previewItem.id,
              title: previewItem.title,
              format: previewItem.fileType,
            }
          }
        />
      </CardContent>
    </Card>
  );
};
