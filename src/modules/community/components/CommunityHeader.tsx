import { Box, Typography } from "@mui/material";
import { GraduationCap, Landmark } from "lucide-react";
import { FACULTY_LABEL } from "@/modules/community/constants/community.constants";
import { COMMUNITY_COLORS, pageTitleSx } from "@/modules/community/styles/community.styles";

export default function CommunityHeader() {
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
        bgcolor: COMMUNITY_COLORS.panel,
        borderRadius: "14px",
        px: 2.5,
        py: 1.75,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          aria-hidden
          sx={{
            width: 40,
            height: 40,
            borderRadius: "10px",
            bgcolor: "#4F46E5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GraduationCap size={22} color="#FFFFFF" />
        </Box>
        <Typography component="h1" sx={pageTitleSx}>
          Comunidad Universitaria de Aprendizaje
        </Typography>
      </Box>

      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          bgcolor: "#FFFFFF",
          borderRadius: "8px",
          px: 1.5,
          py: 0.75,
          color: COMMUNITY_COLORS.text,
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        <Landmark size={16} aria-hidden />
        {FACULTY_LABEL}
      </Box>
    </Box>
  );
}
