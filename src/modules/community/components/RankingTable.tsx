import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { User } from "lucide-react";
import AuthorAvatar from "@/modules/community/components/AuthorAvatar";
import { TOP_RANKING_SIZE } from "@/modules/community/constants/community.constants";
import { useCommunityViewer } from "@/modules/community/hooks/useCommunityViewer";
import type { RankedTutor } from "@/modules/community/interfaces/responses/ranked-tutor.interface";
import { COMMUNITY_COLORS, cardSx, chipSx } from "@/modules/community/styles/community.styles";

interface RankingTableProps {
  tutors: RankedTutor[];
}

export default function RankingTable({ tutors }: RankingTableProps) {
  const navigate = useNavigate();
  const { paths } = useCommunityViewer();

  return (
    <Box component="section" aria-labelledby="ranking-table-title">
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
        <Typography id="ranking-table-title" component="h2" sx={{ fontSize: 22, fontWeight: 700 }}>
          Tabla de clasificación de tutores
        </Typography>
        <Box component="span" sx={{ ...chipSx, bgcolor: "#EDEBFA", color: COMMUNITY_COLORS.muted }}>
          {TOP_RANKING_SIZE} MEJORES
        </Box>
      </Box>

      {tutors.length === 0 ? (
        <Box sx={{ ...cardSx, color: COMMUNITY_COLORS.muted, fontSize: 14 }}>
          Todavía no hay más tutores en el ranking de este mes.
        </Box>
      ) : (
        <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.25 }}>
          {tutors.map((tutor) => {
            const profilePath = paths.tutorProfile?.(tutor.tutorId);
            return (
              <Box
                component="li"
                key={tutor.tutorId}
                sx={{
                  ...cardSx,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  borderLeft: "4px solid #4F46E5",
                  py: 1.5,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    ...chipSx,
                    bgcolor: "#EEF0F4",
                    color: COMMUNITY_COLORS.muted,
                    minWidth: 36,
                    justifyContent: "center",
                    fontSize: 13,
                  }}
                  aria-label={`Puesto ${tutor.position}`}
                >
                  #{tutor.position}
                </Box>
                <AuthorAvatar
                  fullName={tutor.fullName}
                  profilePictureUrl={tutor.profilePictureUrl}
                  verified={tutor.verified}
                  size={52}
                />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, flexWrap: "wrap" }}>
                    <Typography sx={{ fontSize: 17, fontWeight: 700 }}>{tutor.fullName}</Typography>
                    {tutor.averageRating != null ? (
                      <Typography
                        sx={{ fontSize: 13, fontWeight: 700, color: COMMUNITY_COLORS.star }}
                      >
                        ★ {tutor.averageRating.toFixed(1)}{" "}
                        <Box
                          component="span"
                          sx={{ color: COMMUNITY_COLORS.subtle, fontWeight: 400 }}
                        >
                          ({tutor.reviewsCount})
                        </Box>
                      </Typography>
                    ) : null}
                  </Box>
                  {tutor.careerName ? (
                    <Typography sx={{ fontSize: 13.5, color: COMMUNITY_COLORS.muted }}>
                      {tutor.careerName}
                    </Typography>
                  ) : null}
                  {tutor.subjects.length > 0 ? (
                    <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mt: 0.75 }}>
                      {tutor.subjects.map((subject) => (
                        <Box
                          component="span"
                          key={subject}
                          sx={{
                            ...chipSx,
                            bgcolor: "#E8EAFB",
                            color: COMMUNITY_COLORS.primaryDark,
                          }}
                        >
                          {subject}
                        </Box>
                      ))}
                    </Box>
                  ) : null}
                </Box>
                {profilePath ? (
                  <Box
                    component="button"
                    type="button"
                    onClick={() => navigate(profilePath)}
                    aria-label={`Ver perfil de ${tutor.fullName}`}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.75,
                      border: "none",
                      cursor: "pointer",
                      bgcolor: COMMUNITY_COLORS.primary,
                      color: "#FFFFFF",
                      fontSize: 13.5,
                      fontWeight: 700,
                      px: 2,
                      py: 0.9,
                      borderRadius: "8px",
                      "&:hover": { bgcolor: "#3451d1" },
                    }}
                  >
                    <User size={14} aria-hidden />
                    Perfil
                  </Box>
                ) : null}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
