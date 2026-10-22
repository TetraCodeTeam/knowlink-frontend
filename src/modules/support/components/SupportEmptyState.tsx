import { Box, Typography } from "@mui/material";
import {
  EMPTY_STATE_DESCRIPTION,
  EMPTY_STATE_ILLUSTRATION_SRC,
  EMPTY_STATE_TITLE,
} from "@/modules/support/constants/support.constants";
import {
  emptyDescriptionSx,
  emptyIllustrationSx,
  emptyStateSx,
  emptyTitleSx,
} from "@/modules/support/styles/supportEmptyState.styles";

export function SupportEmptyState() {
  return (
    <Box sx={emptyStateSx}>
      <Box
        component="img"
        src={EMPTY_STATE_ILLUSTRATION_SRC}
        alt=""
        aria-hidden="true"
        sx={emptyIllustrationSx}
      />
      <Typography component="p" sx={emptyTitleSx}>
        {EMPTY_STATE_TITLE}
      </Typography>
      <Typography sx={emptyDescriptionSx}>{EMPTY_STATE_DESCRIPTION}</Typography>
    </Box>
  );
}
