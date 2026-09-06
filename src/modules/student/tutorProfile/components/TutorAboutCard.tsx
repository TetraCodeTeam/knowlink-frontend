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
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
          <User size={25} color="#5865C8"/>
          <Typography variant="h5" fontWeight={500}>
            Sobre Mí
          </Typography>
        </Stack>
        <Typography  variant="subtitle1" color="#494949">
          {about}
        </Typography>
      </CardContent>
    </Card>
  );
};