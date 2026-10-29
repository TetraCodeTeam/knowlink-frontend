import type { ReactNode } from "react";
import { Box } from "@mui/material";
import EmptyState from "@/shared/components/EmptyState";
import { listEmptySx } from "@/modules/admin/styles/admin-list.styles";

interface AdminListEmptyStateProps {
  message: string;
  icon?: ReactNode;
}

export default function AdminListEmptyState({ message, icon }: AdminListEmptyStateProps) {
  return (
    <Box sx={listEmptySx}>
      <EmptyState icon={icon} message={message} />
    </Box>
  );
}
