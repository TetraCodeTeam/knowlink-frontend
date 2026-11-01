import { z } from "zod";

export const modalityParamSchema = z.enum(["VIRTUAL", "IN_PERSON"]);

export const compensationParamSchema = z.enum(["FREE", "PAID"]);

export const weekDayParamSchema = z.enum([
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]);

export const timeFrameParamSchema = z.enum(["MORNING", "AFTERNOON", "EVENING"]);

export const verifiedOnlyParamSchema = z.literal("true");

export const minRatingParamSchema = z.coerce.number().int().min(1).max(5);

export type ModalityParam = z.infer<typeof modalityParamSchema>;
export type CompensationParam = z.infer<typeof compensationParamSchema>;
export type WeekDayParam = z.infer<typeof weekDayParamSchema>;
export type TimeFrameParam = z.infer<typeof timeFrameParamSchema>;
export type MinRatingParam = z.infer<typeof minRatingParamSchema>;
