import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountManagementCard from "@/modules/users/components/AccountManagementCard";
import ActiveBookingsBlockedDialog from "@/modules/users/components/ActiveBookingsBlockedDialog";
import DeactivateAccountDialog from "@/modules/users/components/DeactivateAccountDialog";
import DeleteAccountDialog from "@/modules/users/components/DeleteAccountDialog";
import { ACTIVE_BOOKINGS_BLOCK_MESSAGE } from "@/modules/users/constants";
import { useDeactivateAccount } from "@/modules/users/hooks/useDeactivateAccount";

interface AccountManagementSectionProps {
  classesPath: string;
}

export default function AccountManagementSection({ classesPath }: AccountManagementSectionProps) {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);

  const { isPending, mutate } = useDeactivateAccount({
    onBlockedByBookings: (message) => {
      setConfirmOpen(false);
      setBlockedMessage(message);
    },
  });

  const handleGoToClasses = () => {
    setBlockedMessage(null);
    navigate(classesPath);
  };

  return (
    <>
      <AccountManagementCard
        onDeactivateAccount={() => setConfirmOpen(true)}
        onDeleteAccount={() => setDeleteOpen(true)}
      />
      <DeactivateAccountDialog
        open={confirmOpen}
        isPending={isPending}
        onConfirm={() => mutate()}
        onCancel={() => setConfirmOpen(false)}
      />
      <DeleteAccountDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} />
      <ActiveBookingsBlockedDialog
        open={blockedMessage !== null}
        message={blockedMessage ?? ACTIVE_BOOKINGS_BLOCK_MESSAGE}
        onClose={() => setBlockedMessage(null)}
        onGoToClasses={handleGoToClasses}
      />
    </>
  );
}
