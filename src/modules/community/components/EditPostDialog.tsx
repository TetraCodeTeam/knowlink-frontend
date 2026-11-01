import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Dialog, DialogContent, TextField, Typography } from "@mui/material";
import { Save } from "lucide-react";
import AppButton from "@/shared/components/AppButton";
import AttachmentEditor from "@/modules/community/components/AttachmentEditor";
import RichTextField from "@/modules/community/components/RichTextField";
import {
  HELP_REQUEST_MAX_LENGTH,
  SHARED_CONTENT_MAX_LENGTH,
  TITLE_MAX_LENGTH,
} from "@/modules/community/constants/community.constants";
import { useUpdatePost } from "@/modules/community/hooks/useUpdatePost";
import type { CommunityPost } from "@/modules/community/interfaces/responses/community-post.interface";
import {
  buildEditPostSchema,
  type EditPostFormData,
} from "@/modules/community/schemas/edit-post.schema";
import { COMMUNITY_COLORS } from "@/modules/community/styles/community.styles";

interface EditPostDialogProps {
  post: CommunityPost;
  open: boolean;
  onClose: () => void;
}

export default function EditPostDialog({ post, open, onClose }: EditPostDialogProps) {
  const { updatePost, isPending } = useUpdatePost();
  const schema = useMemo(() => buildEditPostSchema(post.type), [post.type]);
  const maxContent =
    post.type === "HELP_REQUEST" ? HELP_REQUEST_MAX_LENGTH : SHARED_CONTENT_MAX_LENGTH;

  const [newFile, setNewFile] = useState<File | null>(null);
  const [removeCurrent, setRemoveCurrent] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditPostFormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: post.title, content: post.content },
  });

  useEffect(() => {
    if (open) {
      reset({ title: post.title, content: post.content });
      setNewFile(null);
      setRemoveCurrent(false);
    }
  }, [open, post.title, post.content, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updatePost({
        postId: post.postId,
        request: { ...data, removeAttachment: removeCurrent },
        file: newFile,
      });
      onClose();
    } catch {
      // El interceptor de httpClient ya muestra el mensaje del backend; el diálogo queda abierto.
    }
  });

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px" } }}
      aria-labelledby="edit-post-title"
    >
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ display: "grid", gap: 2.25 }}>
          <Box>
            <Typography id="edit-post-title" sx={{ fontSize: 19, fontWeight: 700 }}>
              Editar publicación
            </Typography>
            <Typography sx={{ fontSize: 13, color: COMMUNITY_COLORS.muted, mt: 0.25 }}>
              {post.subject.name} · El tipo y la materia no se pueden cambiar.
            </Typography>
          </Box>

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

          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <RichTextField
                value={field.value}
                onChange={field.onChange}
                maxLength={maxContent}
                minRows={5}
                disabled={isPending}
                error={errors.content?.message}
                ariaLabel="Detalle de la publicación"
              />
            )}
          />

          <AttachmentEditor
            current={post.attachment}
            file={newFile}
            removeCurrent={removeCurrent}
            disabled={isPending}
            onFileChange={setNewFile}
            onRemoveCurrentChange={setRemoveCurrent}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
            <AppButton appVariant="outline" onClick={onClose} disabled={isPending}>
              Cancelar
            </AppButton>
            <AppButton type="submit" loading={isPending} startIcon={<Save size={16} />}>
              Guardar cambios
            </AppButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
