import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Dialog, DialogContent, MenuItem, TextField, Typography } from "@mui/material";
import { CircleHelp, Lightbulb, Send } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import AuthorAvatar from "@/modules/community/components/AuthorAvatar";
import RichTextField from "@/modules/community/components/RichTextField";
import {
  HELP_REQUEST_MAX_LENGTH,
  SHARED_CONTENT_MAX_LENGTH,
  TITLE_MAX_LENGTH,
} from "@/modules/community/constants/community.constants";
import {
  POST_TYPE_COMPOSER_LABEL,
  POST_TYPE_COMPOSER_LABEL_TUTOR,
} from "@/modules/community/constants/post-type-config";
import { useCommunitySubjects } from "@/modules/community/hooks/useCommunitySubjects";
import { useCommunityViewer } from "@/modules/community/hooks/useCommunityViewer";
import { useCreatePost } from "@/modules/community/hooks/useCreatePost";
import {
  createPostSchema,
  type CreatePostFormData,
} from "@/modules/community/schemas/create-post.schema";
import { COMMUNITY_COLORS } from "@/modules/community/styles/community.styles";
import { POST_TYPE_VALUES, type PostType } from "@/modules/community/types/post-type.type";

interface CreatePostDialogProps {
  open: boolean;
  initialType: PostType;
  onClose: () => void;
}

const TYPE_ICON: Record<PostType, typeof CircleHelp> = {
  HELP_REQUEST: CircleHelp,
  SHARED_CONTENT: Lightbulb,
};

function buildDefaults(type: PostType): CreatePostFormData {
  return { type, subjectId: "", title: "", content: "", file: null };
}

export default function CreatePostDialog({ open, initialType, onClose }: CreatePostDialogProps) {
  const { fullName, role } = useCommunityViewer();
  const { subjects, isLoading: isLoadingSubjects } = useCommunitySubjects(open);
  const { createPost, isPending } = useCreatePost();

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: buildDefaults(initialType),
  });

  useEffect(() => {
    if (open) reset(buildDefaults(initialType));
  }, [open, initialType, reset]);

  const type = watch("type");
  const typeLabels = role === "TUTOR" ? POST_TYPE_COMPOSER_LABEL_TUTOR : POST_TYPE_COMPOSER_LABEL;
  const maxContent = type === "HELP_REQUEST" ? HELP_REQUEST_MAX_LENGTH : SHARED_CONTENT_MAX_LENGTH;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createPost(data);
      onClose();
    } catch {
      // El interceptor de httpClient ya muestra el mensaje del backend; el formulario queda abierto.
    }
  });

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px" } }}
      aria-labelledby="create-post-title"
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
              pb: 1.5,
              borderBottom: `1px solid ${COMMUNITY_COLORS.border}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <AuthorAvatar fullName={fullName} profilePictureUrl={null} />
              <Typography
                id="create-post-title"
                sx={{ color: COMMUNITY_COLORS.muted, fontSize: 15 }}
              >
                Publicar en la comunidad académica
              </Typography>
            </Box>

            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Box
                  role="radiogroup"
                  aria-label="Tipo de publicación"
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    bgcolor: COMMUNITY_COLORS.panel,
                    p: 0.5,
                    borderRadius: "10px",
                  }}
                >
                  {POST_TYPE_VALUES.map((value) => {
                    const Icon = TYPE_ICON[value];
                    const selected = field.value === value;
                    return (
                      <Box
                        key={value}
                        component="button"
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={isPending}
                        onClick={() => field.onChange(value)}
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.75,
                          border: "none",
                          borderRadius: "8px",
                          px: 1.5,
                          py: 0.75,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          bgcolor: selected
                            ? value === "HELP_REQUEST"
                              ? "#FDE4D6"
                              : "#E4E1FA"
                            : "transparent",
                          color: selected ? COMMUNITY_COLORS.text : COMMUNITY_COLORS.muted,
                        }}
                      >
                        <Icon size={15} aria-hidden />
                        {typeLabels[value]}
                      </Box>
                    );
                  })}
                </Box>
              )}
            />
          </Box>

          <Controller
            control={control}
            name="subjectId"
            render={({ field }) => (
              <TextField
                select
                required
                label="Materia"
                value={field.value}
                onChange={field.onChange}
                disabled={isPending || isLoadingSubjects}
                error={Boolean(errors.subjectId)}
                helperText={errors.subjectId?.message}
                fullWidth
                size="small"
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject.subjectId} value={subject.subjectId}>
                    {subject.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <TextField
            {...register("title")}
            required
            label="Título"
            disabled={isPending}
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
            inputProps={{ maxLength: TITLE_MAX_LENGTH }}
            fullWidth
            size="small"
          />

          <Box>
            <Typography
              sx={{ fontSize: 13, fontWeight: 600, color: COMMUNITY_COLORS.muted, mb: 0.75 }}
            >
              {type === "HELP_REQUEST" ? "Detalle de la consulta *" : "Contenido a compartir *"}
            </Typography>
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
                      maxLength={maxContent}
                      minRows={5}
                      disabled={isPending}
                      error={errors.content?.message}
                      ariaLabel="Detalle de la publicación"
                      placeholder={
                        type === "HELP_REQUEST"
                          ? "Contá qué ejercicio o concepto te trabó y qué intentaste."
                          : "Compartí un tip, resumen o apunte con la comunidad."
                      }
                      file={fileField.value}
                      onFileChange={fileField.onChange}
                    />
                  )}
                />
              )}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, pt: 0.5 }}>
            <AppButton appVariant="outline" onClick={onClose} disabled={isPending}>
              Cancelar
            </AppButton>
            <AppButton type="submit" loading={isPending} startIcon={<Send size={16} />}>
              Publicar
            </AppButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
