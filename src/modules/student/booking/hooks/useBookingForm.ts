//hook para manejar el formulario de reserva, incluyendo la selección de materia, modalidad y cálculo de precios.
import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { SERVICE_FEE_RATE } from "@/modules/student/booking/mockdata";
import { useBookingSubjects } from "@/modules/student/booking/hooks/useBookingSubjects";
import type { BookingCardProps } from "@/modules/student/booking/interfaces/bookingComponentPropsType";
import type { Modality } from "@/modules/student/booking/constants/modality.constants";
import {
  bookingSchema,
  DEFAULT_BOOKING_FORM_VALUES,
  type BookingFormValues,
} from "@/modules/student/booking/schemas/booking.schema";

export function useBookingForm(selectedSlot: BookingCardProps["selectedSlot"]) {
  const subjects = useBookingSubjects();
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { ...DEFAULT_BOOKING_FORM_VALUES, bookingSlotId: selectedSlot?.id ?? "" },
  });

  const { control, setValue } = form;
  const subjectId = useWatch({ control, name: "subjectId" });
  const modality = useWatch({ control, name: "modality" });

  useEffect(() => {
    setValue("bookingSlotId", selectedSlot?.id ?? "");
  }, [selectedSlot?.id, setValue]);

  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.id === subjectId) ?? null,
    [subjectId, subjects]
  );

  const availableModalities: Modality[] = selectedSubject?.availableModalities ?? [
    "VIRTUAL",
    "IN_PERSON",
  ];

  const pricing = useMemo(() => {
    if (!selectedSubject) return null;
    const hourlyRate = selectedSubject.hourlyRate;
    const serviceFee = Math.round(hourlyRate * SERVICE_FEE_RATE);
    return {
      hourlyRate,
      serviceFee,
      total: hourlyRate + serviceFee,
    };
  }, [selectedSubject]);

  const handleSubjectChange = (nextSubjectId: string) => {
    setValue("subjectId", nextSubjectId, { shouldValidate: true });

    const nextSubject = subjects.find((subject) => subject.id === nextSubjectId);
    if (nextSubject && !nextSubject.availableModalities.includes(modality)) {
      setValue("modality", nextSubject.availableModalities[0], { shouldValidate: true });
    }
  };

  return {
    ...form,
    subjects,
    modality,
    selectedSubject,
    availableModalities,
    pricing,
    handleSubjectChange,
  };
}
