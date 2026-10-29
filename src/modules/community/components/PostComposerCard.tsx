import { Box, Typography } from "@mui/material";
import { CirclePlus, Lightbulb } from "lucide-react";
import AuthorAvatar from "@/modules/community/components/AuthorAvatar";
import { useCommunityViewer } from "@/modules/community/hooks/useCommunityViewer";
import { COMMUNITY_COLORS, cardSx, chipSx } from "@/modules/community/styles/community.styles";
import type { PostType } from "@/modules/community/types/post-type.type";

interface PostComposerCardProps {
  onCompose: (type: PostType) => void;
}

const actionSx = {
  ...chipSx,
  border: "none",
  cursor: "pointer",
  fontSize: 14,
  px: 1.5,
  py: 0.75,
  borderRadius: "8px",
};

export default function PostComposerCard({ onCompose }: PostComposerCardProps) {
  const { fullName } = useCommunityViewer();

  return (
    <Box sx={cardSx}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <AuthorAvatar fullName={fullName} profilePictureUrl={null} />
        <Box
          component="button"
          type="button"
          onClick={() => onCompose("HELP_REQUEST")}
          sx={{
            flex: 1,
            textAlign: "left",
            border: "none",
            bgcolor: COMMUNITY_COLORS.panel,
            color: COMMUNITY_COLORS.subtle,
            borderRadius: "10px",
            px: 2,
            py: 1.25,
            fontSize: 15,
            cursor: "text",
          }}
        >
          <Typography component="span" sx={{ fontSize: "inherit", color: "inherit" }}>
            ¿Tenés una duda puntual sobre un ejercicio o concepto?
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1.75 }}>
        <Box
          component="button"
          type="button"
          onClick={() => onCompose("HELP_REQUEST")}
          sx={{ ...actionSx, bgcolor: "#FDE4D6", color: "#A8480E" }}
        >
          <CirclePlus size={16} aria-hidden />
          Pedir ayuda rápida
        </Box>
        <Box
          component="button"
          type="button"
          onClick={() => onCompose("SHARED_CONTENT")}
          sx={{ ...actionSx, bgcolor: "#E4E1FA", color: "#3F2FB5" }}
        >
          <Lightbulb size={16} aria-hidden />
          Compartir tip o apunte
        </Box>
      </Box>
    </Box>
  );
}
