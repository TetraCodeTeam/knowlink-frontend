import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";

interface ProfileHeaderProps {
  fullName: string;
  profilePictureUrl?: string | null;
  description?: string;
}

/**
 * Genera las iniciales para el fallback del avatar cuando no hay
 * foto de perfil cargada 
 */
const getInitials = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return `${first}${last}`.toUpperCase();
};

export const ProfileHeader = ({
  fullName,
  profilePictureUrl,
  description = "Gestiona tu información personal, opciones de seguridad y tu rol dentro de la plataforma KnowLink.",
}: ProfileHeaderProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        border: "0.2px solid #e0e0fa"
      }}
    >
      <Stack direction="row" spacing={2.5} alignItems="center">
        <Avatar
          src={profilePictureUrl ?? undefined}
          alt={fullName}
          sx={{
            width: 100,
            height: 100,
            fontSize: "1.5rem",
            fontWeight: 600,
            bgcolor: "primary.main",
          }}
        >
          {getInitials(fullName)}
        </Avatar>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={500}>
            {fullName}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 0.5,  }}>
            {description}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};