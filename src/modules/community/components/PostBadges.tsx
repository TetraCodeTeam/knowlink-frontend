import { Box } from "@mui/material";
import { CircleCheck, CircleHelp, Lightbulb } from "lucide-react";
import { POST_TYPE_STYLE, getPostTypeLabel } from "@/modules/community/constants/post-type-config";
import type { CommunityPost } from "@/modules/community/interfaces/responses/community-post.interface";
import { COMMUNITY_COLORS, chipSx } from "@/modules/community/styles/community.styles";

interface PostBadgesProps {
  post: CommunityPost;
}

export default function PostBadges({ post }: PostBadgesProps) {
  const typeStyle = POST_TYPE_STYLE[post.type];
  const TypeIcon = post.type === "HELP_REQUEST" ? CircleHelp : Lightbulb;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
      {post.status === "RESOLVED" ? (
        <Box
          component="span"
          sx={{ ...chipSx, bgcolor: COMMUNITY_COLORS.successBg, color: COMMUNITY_COLORS.success }}
        >
          <CircleCheck size={13} aria-hidden />
          Resuelto
        </Box>
      ) : null}
      <Box component="span" sx={{ ...chipSx, bgcolor: typeStyle.bg, color: typeStyle.color }}>
        <TypeIcon size={13} aria-hidden />
        {getPostTypeLabel(post.type, post.author.role)}
      </Box>
      <Box
        component="span"
        sx={{ ...chipSx, bgcolor: "#E8EAFB", color: COMMUNITY_COLORS.primaryDark }}
      >
        {post.subject.name}
      </Box>
    </Box>
  );
}
