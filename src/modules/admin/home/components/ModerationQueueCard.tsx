import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { ArrowRight } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import QueueKpiPair from "@/modules/admin/home/components/QueueKpiPair";
import { QUEUE_CARD_CONFIG } from "@/modules/admin/home/constants/queue-card-config";
import {
  buildOldestPendingCopy,
  buildPendingReportsCopy,
} from "@/modules/admin/home/utils/queue-copy";
import type { MaterialReportsQueueSummary } from "@/modules/admin/home/interfaces/responses/material-reports-queue-summary.response";
import type { SessionClaimsQueueSummary } from "@/modules/admin/home/interfaces/responses/session-claims-queue-summary.response";
import {
  queueCardBodySx,
  queueCardHeaderSx,
  queueCardSx,
  queueCardStripeSx,
  queueCardSubtitleSx,
  queueCardTitleSx,
  queueCtaSx,
  queueIconChipSx,
  queuePillSx,
} from "@/modules/admin/home/styles/admin-home.styles";

type ModerationQueueCardProps =
  | { variant: "claims"; summary: SessionClaimsQueueSummary }
  | { variant: "reports"; summary: MaterialReportsQueueSummary };

export default function ModerationQueueCard(props: ModerationQueueCardProps) {
  const navigate = useNavigate();
  const config = QUEUE_CARD_CONFIG[props.variant];
  const Icon = config.icon;
  const titleId = `queue-card-title-${props.variant}`;

  const pillSegments =
    props.variant === "claims"
      ? buildOldestPendingCopy(props.summary.oldestPendingDays)
      : buildPendingReportsCopy(props.summary.pendingFiles, props.summary.pendingReports);

  return (
    <Box component="article" aria-labelledby={titleId} sx={queueCardSx}>
      <Box sx={{ ...queueCardStripeSx, backgroundImage: config.stripe }} />

      <Box sx={queueCardBodySx}>
        <Box sx={queueCardHeaderSx}>
          <Box
            sx={{
              ...queueIconChipSx,
              backgroundColor: config.iconBg,
              borderColor: config.iconBorder,
            }}
          >
            <Icon size={24} color={config.iconColor} aria-hidden />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography id={titleId} component="h2" sx={queueCardTitleSx}>
              {config.title}
            </Typography>
            <Typography sx={queueCardSubtitleSx}>{config.subtitle}</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            ...queuePillSx,
            backgroundColor: config.pillBg,
            borderColor: config.pillBorder,
          }}
        >
          {pillSegments.map((segment) => (
            <Box
              key={segment.text}
              component="span"
              sx={{
                color: segment.emphasis ? config.pillEmphasis : config.pillText,
                fontWeight: segment.emphasis ? 700 : 500,
              }}
            >
              {segment.text}
            </Box>
          ))}
        </Box>

        <QueueKpiPair summary={props.summary} />

        <AppButton
          appVariant="dark"
          fullWidth
          endIcon={<ArrowRight size={18} />}
          onClick={() => navigate(config.path)}
          sx={queueCtaSx}
        >
          Ir a la cola
        </AppButton>
      </Box>
    </Box>
  );
}
