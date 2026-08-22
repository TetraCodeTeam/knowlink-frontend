import { ArrowRight, GraduationCap, Info } from "lucide-react";
import { Box, ButtonBase, Paper, Stack, Typography } from "@mui/material";

import type { TutorRoleStatus } from "@/modules/student/profile/interfaces/ownProfileInterface";

interface RoleCardProps {
  status: TutorRoleStatus;
  onAccessTutorMode: () => void;
}

interface StatusContent {
  description: string;
  actionLabel: string;
  hint: string;
}

/**
 * Copy diferenciado por estado (criterio de aceptación 3):
 * - ACTIVE: el usuario ya tiene el rol, accede directo a su interfaz.
 * - INACTIVE: tuvo el rol antes; la acción reactiva el rol existente,
 *   NUNCA debe iniciar un registro nuevo.
 * - NEVER_REGISTERED: nunca fue tutor; la acción lo lleva a un
 *   registro nuevo.
 *
 * El texto de cada estado es responsabilidad de este mapeo, no del
 * componente que lo consume, para que agregar un cuarto estado en el
 * futuro no implique tocar la lógica visual.
 */
const CONTENT_BY_STATUS: Record<TutorRoleStatus, StatusContent> = {
  ACTIVE: {
    description:
      "Cambia tu vista actual para gestionar tus sesiones, materiales y disponibilidad como tutor.",
    actionLabel: "Acceder a la Interfaz de Tutor",
    hint: "Cambia a modo tutor",
  },
  INACTIVE: {
    description:
      "Ya tuviste el rol de tutor en KnowLink. Podés reactivarlo y volver a tu configuración anterior sin empezar un registro nuevo.",
    actionLabel: "Reactivar rol de Tutor",
    hint: "Recupera tu configuración anterior",
  },
  NEVER_REGISTERED: {
    description:
      "Activa el rol de tutor para ofrecer sesiones, compartir materiales y definir tu disponibilidad.",
    actionLabel: "Activar rol de Tutor",
    hint: "Inicia el registro como tutor",
  },
};

export const RoleCard = ({ status, onAccessTutorMode }: RoleCardProps) => {
  const content = CONTENT_BY_STATUS[status];

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "0.2px solid #e0e0fa" }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <GraduationCap size={20} />
        <Typography variant="h5" component="h2" fontWeight={500}>
          Rol de Tutor
        </Typography>
      </Stack>

      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, maxWidth: 560 }}>
        {content.description}
      </Typography>

      <ButtonBase
        onClick={onAccessTutorMode}
        sx={{
          width: "100%",
          borderRadius: 2,
          p: 2,
          bgcolor: "primary.lighter",
          justifyContent: "space-between",
          textAlign: "left",
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={500} color="primary.main">
            {content.actionLabel}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
            <Info size={14} />
            <Typography variant="body1" color="text.secondary">
              {content.hint}
            </Typography>
          </Stack>
        </Box>
      </ButtonBase>
    </Paper>
  );
};