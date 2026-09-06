import { useMemo, useState } from "react";
import { Box, Card, CardContent, IconButton, Link, Stack, Typography } from "@mui/material";
import { Download, FolderLock, FolderOpen } from "lucide-react";

import type { TutorMaterialItem } from "@/modules/student/tutorProfile/interfaces/tutor.interface";
import { FILE_TYPE_ICON } from "@/modules/student/tutorProfile/utils/material-file-mapping";
import { buildMaterialPreview, groupBySubject } from "@/modules/student/tutorProfile/utils/materialTruncation";
import { TutorMaterialModal } from "@/modules/student/tutorProfile/components/TutorMaterialModal";

interface TutorMaterialCardProps {
  material: TutorMaterialItem[];
  hasConfirmedBooking: boolean;
}

const formatFileSize = (sizeMB: number) => {
  return sizeMB % 1 === 0 ? `${sizeMB} MB` : `${sizeMB.toString().replace(".", ",")} MB`;
};

const formatMaterialMetadata = (item: TutorMaterialItem) => {
  if (item.fileSizeMB > 0) {
    return `${item.fileType} · ${formatFileSize(item.fileSizeMB)}`;
  }

  return item.fileType;
};

export const TutorMaterialCard = ({ material, hasConfirmedBooking }: TutorMaterialCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialSubject, setModalInitialSubject] = useState<string | undefined>(undefined);

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
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
          <FolderOpen size={25} color="#5865C8" />
          <Typography variant="h5" fontWeight={500}>
            Material Académico
          </Typography>
        </Stack>

        {!hasConfirmedBooking ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Box sx={{ opacity: 0.5, display: "inline-flex" }}>
              <FolderLock size={35} color="#5865C8" />
            </Box>
            <Typography variant="subtitle1" fontWeight={600} mt={1}>
              Material Bloqueado
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Reservá y completá una sesión con este tutor para acceder a su material de estudio.
            </Typography>
          </Box>
        ) : (
          <>
            <Stack spacing={2}>
              {Object.entries(preview).map(([subject, items]) => (
                <Box key={subject}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography variant="subtitle1" color="text.secondary">
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
                  <Stack spacing={1}>
                    {items.map((item) => {
                      const FileIcon = FILE_TYPE_ICON[item.fileType];
                      return (
                        <Box
                          key={item.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: 1.5,
                            borderRadius: 1,
                            bgcolor: "#F4F3FB",
                          }}
                        >
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <FileIcon size={20} color="#5865C8" />
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {item.title}
                              </Typography>
                              <Typography variant="subtitle2" color="text.secondary">
                                {formatMaterialMetadata(item)}
                              </Typography>
                            </Box>
                          </Stack>
                          <IconButton
                            component={Link}
                            href={item.fileUrl}
                            size="small"
                            aria-label={`Descargar ${item.title}`}
                          >
                            <Download size={18} color="#5865C8" />
                          </IconButton>
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
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};