import { Box } from "@mui/material";
import {
  EMPTY_STATE_DESCRIPTION,
  EMPTY_STATE_TITLE,
} from "@/modules/support/constants/support.constants";
import { emptyStateSx } from "@/modules/support/styles/supportEmptyState.styles";
import FrankieEmptyState from "@/shared/frankie/FrankieEmptyState";

export function SupportEmptyState() {
  return (
    <Box sx={emptyStateSx}>
      <FrankieEmptyState
        mood="happy"
        accessories={["sparkles"]}
        size={230}
        title={EMPTY_STATE_TITLE}
        message={EMPTY_STATE_DESCRIPTION}
      />
    </Box>
  );
}
