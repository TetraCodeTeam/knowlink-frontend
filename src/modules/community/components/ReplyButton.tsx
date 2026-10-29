import { Reply } from "lucide-react";
import AppButton from "@/shared/components/AppButton";

interface ReplyButtonProps {
  onClick: () => void;
}

export default function ReplyButton({ onClick }: ReplyButtonProps) {
  return (
    <AppButton size="small" startIcon={<Reply size={16} />} onClick={onClick}>
      Responder
    </AppButton>
  );
}
