import { useSessionConfirmationStore } from "@/modules/tutor/attendance/hooks/useSessionConfirmationStore";
import { Box, Button } from "@mui/material";

export default function TutorHomePage() {
  const openConfirmation = useSessionConfirmationStore((state) => state.openConfirmation);

  return (
    <>
      <Box sx={{ minHeight: "100vh" }} />

      <Button
        onClick={() =>
          openConfirmation({
            sessionId: "test-session-123",
            expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
            deadlineLabel: "23:00 hs",
          })
        }
      >
        Abrir confirmación de prueba
      </Button>
    </>
  );
}
