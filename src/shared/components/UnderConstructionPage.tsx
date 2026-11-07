import { Box } from "@mui/material";
import FrankieEmptyState from "@/shared/frankie/FrankieEmptyState";

export default function UnderConstructionPage() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        p: 3,
      }}
    >
      <FrankieEmptyState
        mood="happy"
        accessories={["hardhat"]}
        size={340}
        title="Esta sección está en construcción"
        message="Frankie se puso el casco y está trabajando en ella. Lamentamos las molestias: estamos preparando la mejor experiencia académica para vos."
      />
    </Box>
  );
}
