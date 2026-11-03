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
        gap: "10px",
      }}
    >
      <Box
        component="img"
        src="/no-classes.png"
        alt="Sin clases"
        sx={{ width: { xs: 240, md: 320 }, maxWidth: "90%" }}
      />
      <Typography
        sx={{
          color: "#666",
          fontSize: { xs: 15, md: 17 },
          maxWidth: "560px",
          lineHeight: 1.6,
          textAlign: "center",
        }}
      >
        {EMPTY_STATE_MESSAGE}
      </Typography>
    </Box>
  );
}
