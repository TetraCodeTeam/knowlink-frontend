import { Box } from "@mui/material";
import EmptyState from "@/shared/components/EmptyState";
import { listEmptySx } from "@/modules/admin/styles/admin-list.styles";

interface AdminListEmptyStateProps {
  message: string;
}

/** Lista de gestión sin elementos: es una buena noticia, así que Frankie lo celebra en calma. */
export default function AdminListEmptyState({ message }: AdminListEmptyStateProps) {
  return (
    <Box sx={listEmptySx}>
      <EmptyState mood="happy" accessories={["sparkles"]} message={message} />
    </Box>
  );
}
