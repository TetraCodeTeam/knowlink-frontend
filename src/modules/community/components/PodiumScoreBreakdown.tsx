import { Box, Typography } from "@mui/material";
import { CircleCheck, Lightbulb } from "lucide-react";
import type { RankedTutor } from "@/modules/community/interfaces/responses/ranked-tutor.interface";
import { COMMUNITY_COLORS } from "@/modules/community/styles/community.styles";

interface PodiumScoreBreakdownProps {
  tutor: Pick<RankedTutor, "score" | "bestAnswers" | "helpfulMarks">;
  /** "card" va centrado dentro de la tarjeta del podio; "row" va alineado a la derecha en la tabla. */
  variant: "card" | "row";
}

const scoreFormat = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 });

/** De dónde sale el puntaje de un tutor: sus respuestas destacadas y los votos "Esto me sirvió" que recibió. */
export default function PodiumScoreBreakdown({ tutor, variant }: PodiumScoreBreakdownProps) {
  const isCard = variant === "card";
  const bestAnswersLabel = `${tutor.bestAnswers} ${
    tutor.bestAnswers === 1 ? "respuesta destacada" : "respuestas destacadas"
  }`;
  const helpfulMarksLabel = `${tutor.helpfulMarks} ${
    tutor.helpfulMarks === 1 ? "voto" : "votos"
  } “Esto me sirvió”`;

  const lineSx = {
    display: "inline-flex",
    alignItems: "center",
    gap: 0.75,
    fontSize: 12.5,
    color: COMMUNITY_COLORS.muted,
    justifyContent: isCard ? "center" : { xs: "flex-start", sm: "flex-end" },
  };

  return (
    <Box
      aria-label={`Puntaje: ${scoreFormat.format(tutor.score)}. ${bestAnswersLabel}. ${helpfulMarksLabel}.`}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        alignItems: isCard ? "center" : { xs: "flex-start", sm: "flex-end" },
        textAlign: isCard ? "center" : { xs: "left", sm: "right" },
        minWidth: 0,
      }}
    >
      <Typography
        component="div"
        sx={{
          fontSize: isCard ? 22 : 18,
          fontWeight: 800,
          lineHeight: 1.1,
          color: "#3727C9",
        }}
      >
        {scoreFormat.format(tutor.score)}
        <Box component="span" sx={{ fontSize: 12, fontWeight: 700, ml: 0.5 }}>
          pts
        </Box>
      </Typography>
      <Box component="span" sx={lineSx}>
        <CircleCheck size={14} color={COMMUNITY_COLORS.success} aria-hidden />
        {bestAnswersLabel}
      </Box>
      <Box component="span" sx={lineSx}>
        <Lightbulb size={14} color="#B7860B" aria-hidden />
        {helpfulMarksLabel}
      </Box>
    </Box>
  );
}
