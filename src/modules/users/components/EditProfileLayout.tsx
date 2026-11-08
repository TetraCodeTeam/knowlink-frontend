import { useRef, type ChangeEvent, type ReactNode } from "react";
import { Avatar, Box, CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import { Pencil } from "lucide-react";
import { toast } from "@/shared/lib/toast";
import { useUploadProfilePicture } from "@/modules/users/hooks/useUploadProfilePicture";
import {
  PROFILE_PICTURE_ACCEPT,
  validateProfilePicture,
} from "@/modules/users/utils/validate-profile-picture";
import type { Role } from "@/shared/types/role.type";
import { getPageMinHeight } from "@/shared/utils/page-height.utils";
import FrankieIllustration from "@/shared/frankie/FrankieIllustration";
import { PAGE_TITLE_BASE_SX } from "@/shared/styles/typography.styles";

interface EditProfileLayoutProps {
  role: Role;
  fullName: string;
  profilePictureUrl: string | null;
  /** El formulario, debajo de la foto de perfil. */
  children: ReactNode;
}

const AVATAR_SIZE = 84;

const getInitials = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
};

/**
 * Marco compartido de "Editar perfil" para alumno y tutor: una tarjeta con la ilustración a la izquierda y,
 * a la derecha, el título, la foto de perfil (editable) y el formulario.
 */
export default function EditProfileLayout({
  role,
  fullName,
  profilePictureUrl,
  children,
}: EditProfileLayoutProps) {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const { mutate: uploadPicture, isPending: isUploading } = useUploadProfilePicture(role);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Permite volver a elegir el mismo archivo si falló.
    event.target.value = "";
    if (!file) return;

    const error = validateProfilePicture(file);
    if (error) {
      toast.error(error);
      return;
    }
    uploadPicture(file);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        minHeight: getPageMinHeight(),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          display: "flex",
          mx: "auto",
          width: "100%",
          maxWidth: 1000,
          borderRadius: 4,
          border: "0.2px solid #e0e0fa",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flex: "0 0 42%",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          }}
        >
          <FrankieIllustration
            mood="happy"
            accessories={["sparkles"]}
            message="Un perfil al día ayuda a que la comunidad te conozca."
          />
        </Box>

        <Box
          aria-hidden
          sx={{
            display: { xs: "none", md: "block" },
            width: "1px",
            alignSelf: "stretch",
            my: 8,
            bgcolor: "#cfcfdc",
          }}
        />

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            px: { xs: 2.5, md: 5 },
            pt: 2.5,
            pb: { xs: 2.5, md: 2.5 },
          }}
        >
          <Typography
            component="h1"
            sx={{ ...PAGE_TITLE_BASE_SX, textAlign: "center", color: "#1a1a2e" }}
          >
            Editar perfil
          </Typography>

          <Box sx={{ position: "relative", alignSelf: "center", mt: 1, mb: 1.5 }}>
            <Avatar
              src={profilePictureUrl ?? undefined}
              alt={fullName}
              sx={{
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                bgcolor: "primary.main",
                fontSize: "1.7rem",
                fontWeight: 600,
              }}
            >
              {getInitials(fullName)}
            </Avatar>
            {isUploading && (
              <CircularProgress
                size={AVATAR_SIZE}
                thickness={2.5}
                sx={{ position: "absolute", top: 0, left: 0, color: "#fff" }}
              />
            )}
            <IconButton
              aria-label="Cambiar foto de perfil"
              onClick={() => fileInput.current?.click()}
              disabled={isUploading}
              sx={{
                position: "absolute",
                right: -6,
                bottom: -4,
                width: 34,
                height: 34,
                bgcolor: "#E4E1FA",
                color: "#3F4CAE",
                border: "2px solid #fff",
                "&:hover": { bgcolor: "#d6d1f5" },
              }}
            >
              <Pencil size={16} strokeWidth={2.4} />
            </IconButton>
            <input
              ref={fileInput}
              type="file"
              hidden
              accept={PROFILE_PICTURE_ACCEPT}
              onChange={handleFileChange}
              data-testid="profile-picture-input"
            />
          </Box>

          {children}
        </Box>
      </Paper>
    </Box>
  );
}
