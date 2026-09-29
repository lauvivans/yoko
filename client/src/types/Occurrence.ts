import { type WeekDayEnum } from '@/enum/DayEnum';
import { type OccurrenceCategoryEnum } from '@/pages/occurrence/enum/OccurrenceCategoryEnum';
import { type OccurrenceDateStatusEnum } from '@/pages/occurrence/enum/OccurrenceDateStatusEnum';
import { type OccurrenceEndsTypeEnum } from '@/pages/occurrence/enum/OccurrenceEndsTypeEnum';

export interface IOccurrence {
  id: string;
  deletedAt?: string;
  title: string;
  desc: string | null;
  isEvent: boolean;
  allDay: boolean;
  category: OccurrenceCategoryEnum;
  goalId: string | null;
  dateOfOccurrence: Date;
  startTime: string | null;
  endTime: string | null;
  weekDayRepetition: WeekDayEnum[];
  weekRepetitionSpace: number | null;
  monthRepetitionSpace: number | null;
  yearRepetitionSpace: number | null;
  monthRepetition: number | null;
  weekRepetition: number | null;
  yearRepetition: number | null;
  endsType: OccurrenceEndsTypeEnum | null;
  endDateOfOccurrence: Date;
  qntOccurrencesTillEnd: number | null;
}

export interface IOccurrenceDate {
  id: string;
  status: OccurrenceDateStatusEnum;
  occurrenceId: string;
  dateOfOccurrence: Date;
}
