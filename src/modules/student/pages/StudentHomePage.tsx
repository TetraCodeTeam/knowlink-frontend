import { Box, Button } from "@mui/material";
import { useStudentTokenStore } from "@/modules/attendance/hooks/useStudentTokenStore";

export default function StudentHomePage() {
  const showToken = useStudentTokenStore((state) => state.showToken);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "#F4F3FB",
        p: 3,
      }}
    >
      <Button
        variant="contained"
        onClick={() =>
          showToken({
            sessionId: "test-session-123",
            code: "4827",
          })
        }
      >
        Mostrar token de prueba
      </Button>
    </Box>
  );
}
