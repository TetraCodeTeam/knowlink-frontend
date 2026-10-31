import { useState } from "react";
import { Box, Chip } from "@mui/material";
import type { TutorSubjectResponse } from "@/modules/tutor/interfaces/TutorSubjectResponse";
import AppButton from "@/shared/components/AppButton";
import ActiveBookingsBlockedDialog from "@/modules/tutors/components/ActiveBookingsBlockedDialog";
import DeactivateSubjectDialog from "@/modules/tutors/components/DeactivateSubjectDialog";
import { useDeactivateTutorSubject } from "@/modules/tutors/hooks/useDeactivateTutorSubject";
import { useReactivateTutorSubject } from "@/modules/tutors/hooks/useReactivateTutorSubject";

interface SubjectActiveToggleProps {
  subject: TutorSubjectResponse;
}

export default function SubjectActiveToggle({ subject }: SubjectActiveToggleProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [blockedOpen, setBlockedOpen] = useState(false);

  const { isPending: isDeactivating, mutate: deactivate } = useDeactivateTutorSubject({
    onBlockedByBookings: () => setBlockedOpen(true),
  });
  const { isPending: isReactivating, mutate: reactivate } = useReactivateTutorSubject();

  const handleConfirmDeactivate = () => {
    setConfirmOpen(false);
    deactivate(subject.tutorSubjectId);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
      {subject.active ? (
        <AppButton
          appVariant="outline"
          size="small"
          onClick={() => setConfirmOpen(true)}
          loading={isDeactivating}
        >
          Desactivar
        </AppButton>
      ) : (
        <>
          <Chip
            label="Desactivada"
            size="small"
            sx={{ backgroundColor: "#ECEBF3", color: "#5B5B6B", fontWeight: 600 }}
          />
          <AppButton
            appVariant="soft"
            size="small"
            onClick={() => reactivate(subject.tutorSubjectId)}
            loading={isReactivating}
          >
            Reactivar
          </AppButton>
        </>
      )}

      <DeactivateSubjectDialog
        open={confirmOpen}
        subjectName={subject.subjectName}
        isPending={isDeactivating}
        onConfirm={handleConfirmDeactivate}
        onCancel={() => setConfirmOpen(false)}
      />
      <ActiveBookingsBlockedDialog open={blockedOpen} onClose={() => setBlockedOpen(false)} />
    </Box>
  );
}
