import { Card, CardContent, Stack, Typography } from "@mui/material";
import { User } from "lucide-react";

interface TutorAboutCardProps {
  about: string;
}

export const TutorAboutCard = ({ about }: TutorAboutCardProps) => {
  if (!about.trim()) {
    return null; // No mostrar la tarjeta si no hay información "Sobre Mí"
  }

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: { xs: 1.75, md: 2 }, "&:last-child": { pb: { xs: 1.75, md: 2 } } }}>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <User size={20} color="#5865C8" />
          <Typography fontSize={18} fontWeight={500}>
            Sobre Mí
          </Typography>
        </Stack>
        <Typography fontSize={14} lineHeight={1.6} color="#494949">
          {about}
        </Typography>
      </CardContent>
    </Card>
  );
};
