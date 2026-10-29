import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Checkbox, Dialog, DialogContent, TextField, Typography } from "@mui/material";
import { CalendarDays, Eye, GraduationCap, Send, X } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import AuthorAvatar from "@/modules/community/components/AuthorAvatar";
import RichTextField from "@/modules/community/components/RichTextField";
import {
  BOOKING_QUESTION_MAX_LENGTH,
  DEFAULT_BOOKING_QUESTION,
  REPLY_MAX_LENGTH,
} from "@/modules/community/constants/community.constants";
import { useCommunityViewer } from "@/modules/community/hooks/useCommunityViewer";
import { useCreateReply } from "@/modules/community/hooks/useCreateReply";
import {
  createReplySchema,
  type CreateReplyFormData,
} from "@/modules/community/schemas/create-reply.schema";
import { COMMUNITY_COLORS, chipSx } from "@/modules/community/styles/community.styles";
import { getFirstName } from "@/modules/community/utils/get-first-name";

interface ReplyDialogProps {
  open: boolean;
  postId: string;
  postTitle: string;
  onClose: () => void;
}

const DEFAULTS: CreateReplyFormData = {
  content: "",
  file: null,
  includeBookingCard: true,
  bookingCardQuestion: "",
};

export default function ReplyDialog({ open, postId, postTitle, onClose }: ReplyDialogProps) {
  const { fullName, role } = useCommunityViewer();
  const isTutor = role === "TUTOR";
  const { createReply, isPending } = useCreateReply(postId);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateReplyFormData>({
    resolver: zodResolver(createReplySchema),
    defaultValues: DEFAULTS,
  });

  useEffect(() => {
    if (open) reset(DEFAULTS);
  }, [open, reset]);

  const includeBookingCard = watch("includeBookingCard");
  const question = watch("bookingCardQuestion").trim() || DEFAULT_BOOKING_QUESTION;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createReply({ data, isTutor });
      onClose();
    } catch {
      // El interceptor de httpClient ya muestra el mensaje del backend; el diálogo queda abierto.
    }
  });

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px" } }}
      aria-labelledby="reply-dialog-title"
    >
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ display: "grid", gap: 2.25 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1.5,
              bgcolor: COMMUNITY_COLORS.panel,
              borderRadius: "12px",
              px: 2,
              py: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
              <AuthorAvatar fullName={fullName} profilePictureUrl={null} size={44} />
              <Box sx={{ minWidth: 0 }}>
                <Typography id="reply-dialog-title" sx={{ fontSize: 17, fontWeight: 700 }}>
                  {fullName}
                </Typography>
                <Typography noWrap sx={{ fontSize: 12.5, color: COMMUNITY_COLORS.muted }}>
                  Respondiendo a: {postTitle}
                </Typography>
              </Box>
            </Box>
            <Box
              component="span"
              sx={{
                ...chipSx,
                bgcolor: isTutor ? "#FDE4D6" : "#E4E1FA",
                color: isTutor ? "#A8480E" : "#3F2FB5",
                textTransform: "uppercase",
                letterSpacing: 0.4,
              }}
            >
              {isTutor ? "Respondiendo como tutor" : "Respondiendo como alumno"}
            </Box>
          </Box>

          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <Controller
                control={control}
                name="file"
                render={({ field: fileField }) => (
                  <RichTextField
                    value={field.value}
                    onChange={field.onChange}
                    maxLength={REPLY_MAX_LENGTH}
                    minRows={6}
                    disabled={isPending}
                    error={errors.content?.message}
                    ariaLabel="Tu respuesta"
                    placeholder="Escribí una explicación clara y breve para ayudar a la comunidad."
                    file={fileField.value}
                    onFileChange={fileField.onChange}
                  />
                )}
              />
            )}
          />

          {isTutor ? (
            <Box sx={{ bgcolor: COMMUNITY_COLORS.panel, borderRadius: "12px", p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <Controller
                  control={control}
                  name="includeBookingCard"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      disabled={isPending}
                      sx={{ p: 0.25, mt: 0.25 }}
                      inputProps={{ "aria-label": "Incluir tarjeta de vinculación a tutoría" }}
                    />
                  )}
                />
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Typography sx={{ fontSize: 14.5, fontWeight: 700 }}>
                      Incluir tarjeta de vinculación a tutoría
                    </Typography>
                    <Box component="span" sx={{ ...chipSx, bgcolor: "#0B4A2E", color: "#FFFFFF" }}>
                      Recomendado
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: 13, color: COMMUNITY_COLORS.muted, mt: 0.25 }}>
                    Si tu respuesta abre un tema complejo, podés definir una pregunta disparadora
                    para invitar al alumno a profundizar en una clase personalizada.
                  </Typography>
                </Box>
              </Box>

              {includeBookingCard ? (
                <Box sx={{ mt: 1.5, display: "grid", gap: 1.25 }}>
                  <TextField
                    {...register("bookingCardQuestion")}
                    label="Pregunta disparadora personalizada"
                    placeholder={DEFAULT_BOOKING_QUESTION}
                    disabled={isPending}
                    error={Boolean(errors.bookingCardQuestion)}
                    helperText={errors.bookingCardQuestion?.message}
                    inputProps={{ maxLength: BOOKING_QUESTION_MAX_LENGTH }}
                    size="small"
                    fullWidth
                    sx={{ bgcolor: "#FFFFFF", borderRadius: 1 }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.75,
                        fontSize: 11.5,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        color: "#A8480E",
                        textTransform: "uppercase",
                        mb: 0.75,
                      }}
                    >
                      <Eye size={14} aria-hidden />
                      Previsualización
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 1.5,
                        bgcolor: "#FFFFFF",
                        borderRadius: "10px",
                        p: 1.75,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <GraduationCap size={22} color="#B4540A" aria-hidden />
                        <Typography sx={{ fontSize: 14.5, fontWeight: 700 }}>{question}</Typography>
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          ...chipSx,
                          bgcolor: "#B4540A",
                          color: "#FFFFFF",
                          fontSize: 13,
                          px: 1.5,
                          py: 0.75,
                          borderRadius: "8px",
                        }}
                      >
                        <CalendarDays size={14} aria-hidden />
                        Agendar clase con {getFirstName(fullName)}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ) : null}
            </Box>
          ) : null}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <AppButton
              appVariant="outline"
              onClick={onClose}
              disabled={isPending}
              startIcon={<X size={16} />}
            >
              Cancelar y volver al hilo
            </AppButton>
            <AppButton type="submit" loading={isPending} startIcon={<Send size={16} />}>
              Publicar respuesta
            </AppButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
