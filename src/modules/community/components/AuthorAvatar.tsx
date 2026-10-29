import { Avatar, Box } from "@mui/material";
import { BadgeCheck } from "lucide-react";
import { COMMUNITY_COLORS } from "@/modules/community/styles/community.styles";
import { getInitials } from "@/modules/community/utils/get-initials";

interface AuthorAvatarProps {
  fullName: string;
  profilePictureUrl: string | null;
  verified?: boolean;
  size?: number;
}

export default function AuthorAvatar({
  fullName,
  profilePictureUrl,
  verified = false,
  size = 40,
}: AuthorAvatarProps) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
      <Avatar
        src={profilePictureUrl ?? undefined}
        alt={fullName}
        sx={{
          width: size,
          height: size,
          bgcolor: COMMUNITY_COLORS.lavender,
          color: COMMUNITY_COLORS.primaryDark,
          fontSize: size * 0.38,
          fontWeight: 700,
          borderRadius: "10px",
        }}
      >
        {getInitials(fullName)}
      </Avatar>
      {verified ? (
        <Box
          aria-label="Tutor verificado"
          sx={{
            position: "absolute",
            right: -4,
            bottom: -4,
            display: "flex",
            bgcolor: "#FFFFFF",
            borderRadius: "50%",
          }}
        >
          <BadgeCheck size={16} color="#1F9D63" fill="#FFFFFF" />
        </Box>
      ) : null}
    </Box>
  );
}
