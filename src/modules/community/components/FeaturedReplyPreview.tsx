import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { ArrowRight, CircleCheck } from "lucide-react";
import FormattedText from "@/modules/community/components/FormattedText";
import { useCommunityViewer } from "@/modules/community/hooks/useCommunityViewer";
import type { FeaturedReply } from "@/modules/community/interfaces/responses/community-post.interface";
import { COMMUNITY_COLORS, linkSx } from "@/modules/community/styles/community.styles";
import { formatRelativeTime } from "@/modules/community/utils/format-relative-time";
import { getFirstName } from "@/modules/community/utils/get-first-name";

interface FeaturedReplyPreviewProps {
  featured: FeaturedReply;
}

/** Respuesta destacada de una publicación resuelta, tal como se ve en el feed. */
export default function FeaturedReplyPreview({ featured }: FeaturedReplyPreviewProps) {
  const { paths, userId } = useCommunityViewer();
  const { author } = featured;
  const bookingPath =
    author.canBookClass && paths.booking && author.userId !== userId
      ? paths.booking(author.userId)
      : null;
  const firstName = getFirstName(author.fullName);

  return (
    <Box sx={{ bgcolor: "#EEF1FD", borderRadius: "10px", px: 2, py: 1.5, mt: 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <CircleCheck size={16} color={COMMUNITY_COLORS.success} aria-hidden />
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: COMMUNITY_COLORS.success }}>
          Respuesta destacada de {author.fullName}
        </Typography>
        <Typography sx={{ fontSize: 12, color: COMMUNITY_COLORS.subtle }}>
          {formatRelativeTime(featured.createdAt)}
        </Typography>
      </Box>
      <FormattedText text={featured.excerpt} sx={{ fontSize: 13.5, mt: 0.75 }} />
      {bookingPath ? (
        <Typography
          component={Link}
          to={bookingPath}
          sx={{
            ...linkSx,
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            mt: 1,
            fontSize: 13,
            fontWeight: 700,
            color: "#B4540A",
          }}
        >
          Agendar clase con {firstName}
          <ArrowRight size={14} aria-hidden />
        </Typography>
      ) : null}
    </Box>
  );
}
