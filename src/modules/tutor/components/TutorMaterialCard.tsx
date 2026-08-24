import { Box, Card, CardContent, IconButton, Link, Stack, Typography } from "@mui/material";
import { Download, FolderLock } from "lucide-react";
import type { TutorMaterialItem } from "@/modules/tutor/interfaces/tutor.interface";
import { FILE_TYPE_ICON } from "@/modules/tutor/utils/material-file-mapping";

interface TutorMaterialCardProps {
  material: TutorMaterialItem[];
  hasConfirmedBooking: boolean;
}

const groupBySubject = (material: TutorMaterialItem[]) => {
  return material.reduce<Record<string, TutorMaterialItem[]>>((groups, item) => {
    if (!groups[item.subject]) {
      groups[item.subject] = [];
    }
    groups[item.subject].push(item);
    return groups;
  }, {});
};

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
  const groupedMaterial = groupBySubject(material);

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
          <FolderLock size={18} color="#5865C8" />
          <Typography variant="h5" fontWeight={500}>
            Material Académico
          </Typography>
        </Stack>

        {!hasConfirmedBooking ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Box sx={{ opacity: 0.5, display: "inline-flex" }}>
              <FolderLock size={32} color="#5865C8" />
            </Box>
            <Typography variant="subtitle1" fontWeight={600} mt={1}>
              Material Bloqueado
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              El material de estudio estará disponible una vez confirmada tu reserva.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {Object.entries(groupedMaterial).map(([subject, items]) => (
              <Box key={subject}>
                <Typography variant="subtitle1" color="text.secondary" mb={1}>
                  {subject}
                </Typography>
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
        )}
      </CardContent>
    </Card>
  );
};