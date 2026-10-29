import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useCommunityViewer } from "@/modules/community/hooks/useCommunityViewer";
import { COMMUNITY_COLORS, cardSx, linkSx } from "@/modules/community/styles/community.styles";

export default function MyPostsPanel() {
  const { paths } = useCommunityViewer();

  return (
    <Box component="section" aria-labelledby="my-posts-panel-title" sx={cardSx}>
      <Box
        sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 1 }}
      >
        <Typography id="my-posts-panel-title" component="h2" sx={{ fontSize: 18, fontWeight: 700 }}>
          Mis publicaciones
        </Typography>
        <Typography
          component={Link}
          to={paths.myPosts}
          sx={{ ...linkSx, fontSize: 13, fontWeight: 700, color: COMMUNITY_COLORS.primaryDark }}
        >
          Ver
        </Typography>
      </Box>
      <Typography sx={{ fontSize: 13.5, color: COMMUNITY_COLORS.muted, mt: 1 }}>
        Gestioná tus consultas académicas y aportes para la comunidad.
      </Typography>
    </Box>
  );
}
