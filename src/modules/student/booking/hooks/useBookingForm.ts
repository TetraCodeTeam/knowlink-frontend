//hook para manejar el formulario de reserva, incluyendo la selección de materia, modalidad y cálculo de precios.
import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useBookingConfig } from "@/modules/student/booking/hooks/useBookingConfig";
import { useBookingSubjects } from "@/modules/student/booking/hooks/useBookingSubjects";
import type { BookingCardProps } from "@/modules/student/booking/interfaces/bookingComponentPropsType";
import type { Modality } from "@/modules/student/booking/constants/modality.constants";
import {
  bookingSchema,
  DEFAULT_BOOKING_FORM_VALUES,
  type BookingFormValues,
} from "@/modules/student/booking/schemas/booking.schema";

export function useBookingForm(tutorId: string, selectedSlot: BookingCardProps["selectedSlot"]) {
  const { subjects } = useBookingSubjects(tutorId);
  const { serviceFeeRate } = useBookingConfig();
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { ...DEFAULT_BOOKING_FORM_VALUES, bookingSlotId: selectedSlot?.id ?? "" },
  });

  const { control, setValue } = form;
  const tutorSubjectId = useWatch({ control, name: "tutorSubjectId" });
  const modality = useWatch({ control, name: "modality" });

  useEffect(() => {
    setValue("bookingSlotId", selectedSlot?.id ?? "");
  }, [selectedSlot?.id, setValue]);

  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.id === tutorSubjectId) ?? null,
    [tutorSubjectId, subjects]
  );

  const availableModalities: Modality[] = selectedSubject?.availableModalities ?? [
    "VIRTUAL",
    "IN_PERSON",
  ];

  const durationHours = useMemo(() => {
    return selectedSlot?.durationHours ?? 1;
  }, [selectedSlot]);

  const pricing = useMemo(() => {
    if (!selectedSubject) return null;
    const hourlyRate = selectedSubject.hourlyRate;
    const subtotal = hourlyRate * durationHours;
    const serviceFee = Math.round(subtotal * serviceFeeRate);
    return {
      hourlyRate,
      durationHours,
      serviceFeeRate,
      subtotal,
      serviceFee,
      total: subtotal + serviceFee,
    };
  }, [durationHours, selectedSubject, serviceFeeRate]);

  const handleSubjectChange = (nextSubjectId: string) => {
    setValue("tutorSubjectId", nextSubjectId, { shouldValidate: true });

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
