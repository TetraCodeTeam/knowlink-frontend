import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { ArrowLeft, Award, Crown, GraduationCap, Trophy } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import BecomeTutorDialog from "@/modules/community/components/BecomeTutorDialog";
import MyPositionDialog from "@/modules/community/components/MyPositionDialog";
import PodiumTutorCard from "@/modules/community/components/PodiumTutorCard";
import RankingTable from "@/modules/community/components/RankingTable";
import { useCommunityViewer } from "@/modules/community/hooks/useCommunityViewer";
import { useTutorPodium } from "@/modules/community/hooks/useTutorPodium";
import type { RankedTutor } from "@/modules/community/interfaces/responses/ranked-tutor.interface";
import {
  COMMUNITY_COLORS,
  backLinkSx,
  cardSx,
  pageContentSx,
  pageSx,
} from "@/modules/community/styles/community.styles";

/** Orden visual del podio: 2º a la izquierda, 1º al centro y 3º a la derecha. */
function arrangePodium(podium: RankedTutor[]): RankedTutor[] {
  return [2, 1, 3]
    .map((position) => podium.find((tutor) => tutor.position === position))
    .filter((tutor): tutor is RankedTutor => tutor !== undefined);
}

export default function TutorPodiumPage() {
  const navigate = useNavigate();
  const { paths, role } = useCommunityViewer();
  const { podium, isLoading, isError, refetch } = useTutorPodium();
  const [isMyPositionOpen, setIsMyPositionOpen] = useState(false);
  const [isBecomeTutorOpen, setIsBecomeTutorOpen] = useState(false);

  const arranged = arrangePodium(podium?.podium ?? []);
  const isEmpty =
    !isLoading && !isError && arranged.length === 0 && (podium?.ranking.length ?? 0) === 0;

  return (
    <Box sx={pageSx}>
      <Box sx={pageContentSx}>
        <Box component={Link} to={paths.home} sx={backLinkSx}>
          <ArrowLeft size={16} aria-hidden />
          Volver a la Comunidad
        </Box>

        <Box
          component="section"
          aria-labelledby="podium-title"
          sx={{
            ...cardSx,
            background: "linear-gradient(180deg, #F3F4FF 0%, #FFFFFF 70%)",
            p: { xs: 2, md: 3 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
              pb: 2.5,
              borderBottom: `1px solid ${COMMUNITY_COLORS.border}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
              <Box
                aria-hidden
                sx={{
                  width: 84,
                  height: 84,
                  borderRadius: "20px",
                  bgcolor: "#EEF0FD",
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Trophy size={44} color="#4F46E5" />
              </Box>
              <Box>
                <Typography id="podium-title" component="h1" sx={{ fontSize: 30, fontWeight: 800 }}>
                  Podio de honor
                </Typography>
                <Typography sx={{ fontSize: 15, color: COMMUNITY_COLORS.muted, maxWidth: 560 }}>
                  Reconocimiento oficial por excelencia académica, velocidad de respuesta y
                  valoración comunitaria.
                </Typography>
              </Box>
            </Box>

            {role === "STUDENT" ? (
              <AppButton
                appVariant="outline"
                startIcon={<GraduationCap size={16} />}
                onClick={() => setIsBecomeTutorOpen(true)}
              >
                Ser tutor
              </AppButton>
            ) : null}
          </Box>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress aria-label="Cargando el podio" />
            </Box>
          ) : isError ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography sx={{ color: COMMUNITY_COLORS.muted, mb: 1.5 }}>
                No pudimos cargar el podio de tutores.
              </Typography>
              <AppButton appVariant="soft" onClick={() => void refetch()}>
                Reintentar
              </AppButton>
            </Box>
          ) : isEmpty ? (
            <Box sx={{ textAlign: "center", py: 6, color: COMMUNITY_COLORS.muted }}>
              <Crown size={36} color="#B9BEE6" aria-hidden />
              <Typography sx={{ mt: 1 }}>
                Todavía no hay tutores en el ranking de este mes.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: `repeat(${Math.max(arranged.length, 1)}, minmax(0, 1fr))`,
                },
                gap: { xs: 3, md: 2 },
                alignItems: "start",
                py: 3,
              }}
            >
              {arranged.map((tutor) => (
                <PodiumTutorCard key={tutor.tutorId} tutor={tutor} />
              ))}
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1.5,
              pt: 2,
              borderTop: `1px solid ${COMMUNITY_COLORS.border}`,
            }}
          >
            <Typography
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                fontSize: 13,
                color: COMMUNITY_COLORS.muted,
              }}
            >
              <Award size={15} color="#B4540A" aria-hidden />
              El ranking se actualiza el primer día del mes
            </Typography>
            <AppButton
              size="small"
              appVariant="soft"
              startIcon={<Crown size={16} />}
              onClick={() => setIsMyPositionOpen(true)}
            >
              Consultar mi puesto en el podio
            </AppButton>
          </Box>
        </Box>

        {!isLoading && !isError ? <RankingTable tutors={podium?.ranking ?? []} /> : null}
      </Box>

      <MyPositionDialog open={isMyPositionOpen} onClose={() => setIsMyPositionOpen(false)} />
      <BecomeTutorDialog
        open={isBecomeTutorOpen}
        onCancel={() => setIsBecomeTutorOpen(false)}
        onConfirm={() => {
          setIsBecomeTutorOpen(false);
          navigate(paths.profile);
        }}
      />
    </Box>
  );
}
