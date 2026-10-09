import { Box, Typography } from "@mui/material";
import { EMPTY_STATE_MESSAGE } from "@/modules/class-history/constants/classHistory.constants";

export default function ClassHistoryEmptyState() {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
      }}
    >
      <Box
        component="img"
        src="/no-classes.png"
        alt="Sin clases"
        sx={{ width: 420, maxWidth: "90%" }}
      />
      <Typography variant="h5" sx={{ color: "#666", maxWidth: "560px", lineHeight: 1.6, textAlign: "center" }}>
        {EMPTY_STATE_MESSAGE}
      </Typography>
    </Box>
  );
}