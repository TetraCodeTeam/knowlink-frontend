import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import { BookOpen, X } from "lucide-react";
import type { TutorSubjectRate } from "@/modules/tutor/interfaces/tutor.interface";
import { SubjectRateItem } from "@/modules/tutor/components/SubjectItem";

interface SubjectsDialogProps {
  open: boolean;
  onClose: () => void;
  subjectRates: TutorSubjectRate[];
}

export const SubjectsDialog = ({ open, onClose, subjectRates }: SubjectsDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <BookOpen size={20} color="#5865C8" />
          <Typography variant="h6" fontWeight={600}>
            Materias y Tarifas
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ maxHeight: 480 }}>
        <Stack spacing={1.5} pt={1}>
          {subjectRates.map((subject) => (
            <SubjectRateItem key={subject.id} subject={subject} />
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};