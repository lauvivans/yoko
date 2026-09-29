import { z } from 'zod';
import { OccurrenceCategoryEnum } from '../enum/OccurrenceCategoryEnum';
import { OccurrenceEndsTypeEnum } from '../enum/OccurrenceEndsTypeEnum';
import { WeekDayEnum } from '@/enum/DayEnum';

const occurrenceCategories = Object.values(OccurrenceCategoryEnum) as [
  OccurrenceCategoryEnum,
  ...OccurrenceCategoryEnum[],
];
const occurrenceWeekDays = Object.values(WeekDayEnum) as [
  WeekDayEnum,
  ...WeekDayEnum[],
];
const occurrenceEndsTypes = Object.values(OccurrenceEndsTypeEnum) as [
  OccurrenceEndsTypeEnum,
  ...OccurrenceEndsTypeEnum[],
];

export const occurrenceFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(50, 'Title must be at most 50 characters'),
  desc: z.string().max(250, 'Description must be at most 250 characters'),
  category: z.enum(occurrenceCategories),
  dateOfOccurrence: z.string().min(1, 'Date is required'),
  endDateOfOccurrence: z.string().optional(),
  allDay: z.boolean(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  weekDayRepetition: z.array(z.enum(occurrenceWeekDays)).optional(),
  weekRepetition: z.number().min(0),
  monthRepetition: z.number().min(0),
  yearRepetition: z.number().min(0),
  weekRepetitionSpace: z.number().min(0),
  monthRepetitionSpace: z.number().min(0),
  yearRepetitionSpace: z.number().min(0),
  endsType: z.enum(occurrenceEndsTypes),
  qntOccurrencesTillEnd: z.number().min(0),
});

export const occurrenceEditFormSchema = occurrenceFormSchema.extend({
  title: z.string().optional(),
});

export type OccurrenceFormValues = z.infer<typeof occurrenceFormSchema>;
