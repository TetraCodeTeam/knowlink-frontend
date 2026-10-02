import { useRef } from "react";
import { Avatar, Badge, Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import { Camera } from "lucide-react";

interface ProfileHeaderProps {
  fullName: string;
  profilePictureUrl?: string | null;
  description?: string;
  onPictureChange?: (file: File) => void;
  isUploading?: boolean;
}

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
  onPictureChange,
  isUploading = false,
}: ProfileHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onPictureChange) return;
    onPictureChange(file);
    e.target.value = "";
  };

  return (
    <Paper
      elevation={0}
      sx={{
        pr: 3,
        pl: 3,
        pt: 2,
        pb: 2,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        border: "0.2px solid #e0e0fa",
      }}
    >
      <Stack direction="row" spacing={2.5} alignItems="center">
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            onPictureChange ? (
              <IconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                sx={{
                  bgcolor: "primary.main",
                  color: "#fff",
                  width: 28,
                  height: 28,
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <Camera size={16} />
              </IconButton>
            ) : null
          }
        >
          <Avatar
            src={profilePictureUrl ?? undefined}
            alt={fullName}
            sx={{
              width: 95,
              height: 95,
              fontSize: "1.5rem",
              fontWeight: 600,
              bgcolor: "primary.main",
              opacity: isUploading ? 0.5 : 1,
            }}
          >
            {getInitials(fullName)}
          </Avatar>
        </Badge>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={handleFileChange}
        />
        <Box>
          <Typography variant="h4" component="h1" fontWeight={500}>
            {fullName}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            {description}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};
