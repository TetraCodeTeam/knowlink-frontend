import { Box, Card, CardContent, Link, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { FolderLock, FileText } from "lucide-react";
import type { TutorMaterialItem } from "@/modules/tutor/interfaces/tutor.interface";

interface TutorMaterialCardProps {
  material: TutorMaterialItem[];
  hasConfirmedBooking: boolean;
}

export const TutorMaterialCard = ({ material, hasConfirmedBooking }: TutorMaterialCardProps) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
          <FolderLock size={18} color="#5865C8"/>
          <Typography variant="h6" fontWeight={600}>
            Material Académico
          </Typography>
        </Stack>

        {!hasConfirmedBooking ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <FolderLock size={32} color="#5865C8" style={{ opacity: 0.5 }} />
            <Typography variant="body2" fontWeight={600} mt={1}>
              Material Bloqueado
            </Typography>
          </Box>
        ) : (
          <List dense disablePadding>
            {material.map((item) => (
              <ListItem key={item.id} disableGutters>
                <FileText size={16} color="#5865C8" style={{ marginRight: 8 }} />
                <ListItemText
                  primary={
                    <Link href={item.fileUrl} underline="hover">
                      {item.title}
                    </Link>
                  }
                  secondary={item.subject}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};