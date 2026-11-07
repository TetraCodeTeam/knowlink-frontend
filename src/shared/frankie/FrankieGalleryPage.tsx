import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import AppConfirmDialog from "@/shared/components/AppConfirmDialog";
import { FeedbackDialog, type FeedbackDialogVariant } from "@/shared/components/FeedbackDialog";
import { toast } from "@/shared/lib/toast";
import Frankie from "@/shared/frankie/Frankie";
import FrankieCallout from "@/shared/frankie/FrankieCallout";
import FrankieEmptyState from "@/shared/frankie/FrankieEmptyState";
import FrankieErrorState from "@/shared/frankie/FrankieErrorState";
import FrankieSpeechBubble from "@/shared/frankie/FrankieSpeechBubble";
import { FRANKIE_MOODS, type FrankieAccessory } from "@/shared/frankie/frankie.types";

const ACCESSORIES: FrankieAccessory[] = [
  "confetti",
  "sparkles",
  "hearts",
  "question",
  "exclamation",
  "sweat",
  "tear",
  "zzz",
  "magnifier",
  "hardhat",
];

/**
 * Catálogo visual de Frankie (solo en desarrollo, ruta `/dev/frankie`): todas las expresiones,
 * los accesorios y el recorte de cara. Sirve para revisar cambios sin tener que reproducir cada
 * pantalla de la app.
 */
export default function FrankieGalleryPage() {
  const [params] = useSearchParams();
  const demo = params.get("demo");
  const [feedback, setFeedback] = useState<FeedbackDialogVariant | null>(
    demo?.startsWith("feedback-") ? (demo.slice(9) as FeedbackDialogVariant) : null
  );
  const [confirm, setConfirm] = useState<"warning" | "danger" | null>(
    demo === "confirm" ? "warning" : demo === "danger" ? "danger" : null
  );

  useEffect(() => {
    if (demo !== "toasts") return;
    // El Toaster se suscribe después del primer render: se espera un instante o el aviso se pierde.
    const timer = window.setTimeout(() => {
      toast.success("Tu publicación ya está visible en la comunidad.");
      toast.error("No pudimos guardar los cambios. Intentá de nuevo.");
      toast.warning("Esta semana tiene un horario distinto al habitual.");
      toast.info("Podés volver cuando quieras.");
    }, 300);
    return () => window.clearTimeout(timer);
  }, [demo]);

  return (
    <Box sx={{ p: 4, bgcolor: "#F4F3FB", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Frankie · expresiones
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
        {FRANKIE_MOODS.map((mood) => (
          <Box key={mood} sx={{ bgcolor: "#fff", borderRadius: 3, p: 2, textAlign: "center" }}>
            <Frankie mood={mood} size={250} />
            <Typography fontWeight={700} mt={1}>
              {mood}
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography variant="h5" fontWeight={700} mt={5} mb={2}>
        Caras ampliadas
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
        {FRANKIE_MOODS.map((mood) => (
          <Box key={`big-${mood}`} sx={{ textAlign: "center" }}>
            <Frankie mood={mood} crop="face" size={260} />
            <Typography fontWeight={700}>{mood}</Typography>
          </Box>
        ))}
      </Box>

      <Typography variant="h5" fontWeight={700} mt={5} mb={2}>
        Recorte de cara (avatar)
      </Typography>
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
        {FRANKIE_MOODS.map((mood) => (
          <Box key={mood} sx={{ textAlign: "center" }}>
            <Frankie mood={mood} crop="face" size={72} />
            <Typography fontSize={12}>{mood}</Typography>
          </Box>
        ))}
        {FRANKIE_MOODS.map((mood) => (
          <Frankie key={`s-${mood}`} mood={mood} crop="face" size={36} />
        ))}
      </Box>

      <Typography variant="h5" fontWeight={700} mt={5} mb={2}>
        Mensajes
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, mb: 3 }}>
        <FrankieCallout kind="info">
          Si activás repetir horarios, se copian a las próximas semanas.
        </FrankieCallout>
        <FrankieCallout kind="warning">
          Esta semana tiene un horario distinto al habitual.
        </FrankieCallout>
        <FrankieCallout kind="error">No pudimos guardar los cambios.</FrankieCallout>
        <FrankieCallout kind="success">¡Cambios guardados!</FrankieCallout>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, mb: 3 }}>
        <Box sx={{ bgcolor: "#fff", borderRadius: 3, p: 2 }}>
          <FrankieEmptyState
            compact
            mood="thinking"
            accessories={["magnifier"]}
            title="No encontramos nada por ahora"
            message="No se encontraron resultados para tu búsqueda"
          />
        </Box>
        <Box sx={{ bgcolor: "#fff", borderRadius: 3, p: 2 }}>
          <FrankieErrorState message="No pudimos cargar tus publicaciones." onRetry={() => {}} />
        </Box>
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 3,
            p: 2,
            display: "grid",
            gap: 2,
            alignContent: "center",
          }}
        >
          <FrankieSpeechBubble>Cada pregunta que hacés le sirve a alguien más.</FrankieSpeechBubble>
          <FrankieSpeechBubble tail="left">Hoy no hace falta hacerlo perfecto.</FrankieSpeechBubble>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 3 }}>
        {(["success", "error", "warning", "info"] as const).map((v) => (
          <Button key={v} variant="outlined" onClick={() => setFeedback(v)}>
            Diálogo {v}
          </Button>
        ))}
        <Button variant="outlined" onClick={() => setConfirm("warning")}>
          Confirmar
        </Button>
        <Button variant="outlined" onClick={() => setConfirm("danger")}>
          Confirmar (peligro)
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            toast.success("Tu publicación ya está visible en la comunidad.");
            toast.error("No pudimos guardar los cambios. Intentá de nuevo.");
            toast.warning("Esta semana tiene un horario distinto al habitual.");
            toast.info("Podés volver cuando quieras.");
          }}
        >
          Probar avisos
        </Button>
      </Box>
      <FeedbackDialog
        open={feedback !== null}
        variant={feedback ?? "success"}
        title={
          feedback === "error"
            ? "No pudimos completar la acción"
            : feedback === "warning"
              ? "No hay materias disponibles"
              : feedback === "info"
                ? "Te cuento algo"
                : "¡Materia registrada!"
        }
        description="Tu nueva materia está lista. Recordá mantener tu disponibilidad actualizada para que puedan reservar."
        onClose={() => setFeedback(null)}
      />
      <AppConfirmDialog
        open={confirm !== null}
        severity={confirm ?? "warning"}
        title={confirm === "danger" ? "¿Eliminar tu cuenta?" : "¿Cancelar esta clase?"}
        message="Esta acción no se puede deshacer. ¿Querés continuar?"
        confirmLabel="Sí, continuar"
        isPending={false}
        onConfirm={() => setConfirm(null)}
        onCancel={() => setConfirm(null)}
      />

      <Typography variant="h5" fontWeight={700} mt={5} mb={2}>
        Accesorios
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 3 }}>
        {ACCESSORIES.map((accessory) => (
          <Box key={accessory} sx={{ bgcolor: "#fff", borderRadius: 3, p: 2, textAlign: "center" }}>
            <Frankie mood="happy" accessories={[accessory]} size={180} animated={false} />
            <Typography fontWeight={700} fontSize={13}>
              {accessory}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
