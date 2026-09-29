import useOccurrenceStore from '@/store/occurrenceStore';
import { type IOccurrence } from '@/types/Occurrence';
import { useRef, useState } from 'react';
import { OccurrenceEndsTypeEnum } from '../enum/OccurrenceEndsTypeEnum';
import { OccurrenceCategoryEnum } from '../enum/OccurrenceCategoryEnum';
import { v7 as uuidv7 } from 'uuid';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  occurrenceEditFormSchema,
  occurrenceFormSchema,
  type OccurrenceFormValues,
} from '../schemas/occurrenceFormSchema';

const useOccurrenceForm = (
  isCreate: boolean,
  props: {
    occurrenceId?: string;
    allDay?: boolean;
    isEvent: boolean;
    endsTypeDefault?: OccurrenceEndsTypeEnum;
    monthRepetitionDefault?: number;
    yearRepetitionDefault?: number;
    weekRepetitionDefault?: number;
    weekRepetitionSpaceDefault?: number;
    yearRepetitionSpaceDefault?: number;
    monthRepetitionSpaceDefault?: number;
    handleModal?: (value: React.SetStateAction<boolean>) => void;
  }
) => {
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const { updateOccurrence, updateOccurrenceTitle, createOccurrence } =
    useOccurrenceStore();
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<OccurrenceFormValues>({
    resolver: zodResolver(
      isCreate ? occurrenceFormSchema : occurrenceEditFormSchema
    ),
    mode: 'onSubmit',
    defaultValues: {
      allDay: props.allDay ?? false,
      category: OccurrenceCategoryEnum.Personal,
      weekRepetition: props.weekRepetitionDefault ?? 0,
      monthRepetition: props.monthRepetitionDefault ?? 0,
      yearRepetition: props.yearRepetitionDefault ?? 0,
      weekRepetitionSpace: props.weekRepetitionSpaceDefault ?? 0,
      monthRepetitionSpace: props.monthRepetitionSpaceDefault ?? 0,
      yearRepetitionSpace: props.yearRepetitionSpaceDefault ?? 0,
      endsType: props.endsTypeDefault ?? OccurrenceEndsTypeEnum.Never,
      qntOccurrencesTillEnd: 0,
    },
  });
  const [titleEditMode, setTitleEditMode] = useState<boolean>(false);
  const [isAllDay, setIsAllDay] = useState<boolean>(props.allDay ?? false);
  const [weekRepetition, setWeekRepetition] = useState<number>(
    props.weekRepetitionDefault ?? 0
  );
  const [monthRepetition, setMonthRepetition] = useState<number>(
    props.monthRepetitionDefault ?? 0
  );
  const [yearRepetition, setYearRepetition] = useState<number>(
    props.yearRepetitionDefault ?? 0
  );
  const [weekRepetitionSpace, setWeekRepetitionSpace] = useState<number>(
    props.weekRepetitionSpaceDefault ?? 0
  );
  const [monthRepetitionSpace, setMonthRepetitionSpace] = useState<number>(
    props.monthRepetitionSpaceDefault ?? 0
  );
  const [yearRepetitionSpace, setYearRepetitionSpace] = useState<number>(
    props.yearRepetitionSpaceDefault ?? 0
  );
  const [endsType, setEndsType] = useState<OccurrenceEndsTypeEnum>(
    props.endsTypeDefault ?? OccurrenceEndsTypeEnum.Never
  );

  const handleTitleUpdateOnKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter' && titleRef.current && props.occurrenceId) {
      updateOccurrenceTitle(props.occurrenceId, titleRef.current.value);
      titleRef.current.blur();
      setTitleEditMode(false);
    }
  };

  const handleTitleUpdateOnBlur = (
    e: React.FocusEvent<HTMLTextAreaElement>
  ) => {
    if (props.occurrenceId) {
      updateOccurrenceTitle(props.occurrenceId, e.target.value);
      setTitleEditMode(false);
    }
  };

  const handleTitleEditMode = (e: React.MouseEvent<HTMLHeadingElement>) => {
    e.stopPropagation();
    setTitleEditMode(true);
  };

  const handleAllDay = () =>
    setIsAllDay(
      (prev) => !prev
    ); /* eslint-disable sonarjs/cognitive-complexity */
  const onSubmit: SubmitHandler<OccurrenceFormValues> = (data) => {
    const occ = {} as IOccurrence;

    if (isCreate) {
      occ.id = uuidv7();
      occ.title = data.title;
    }

    if (props.occurrenceId && !isCreate) occ.id = props.occurrenceId;

    occ.isEvent = props.isEvent;
    occ.desc = data.desc;
    occ.category = data.category;
    occ.dateOfOccurrence = new Date(data.dateOfOccurrence);
    occ.allDay = data.allDay;
    occ.startTime = data.allDay ? null : (data.startTime ?? null);
    occ.endTime = data.allDay ? null : (data.endTime ?? null);
    occ.weekDayRepetition = data.weekDayRepetition ?? [];
    occ.weekRepetition = data.weekRepetition;
    occ.monthRepetition = data.monthRepetition;
    occ.yearRepetition = data.yearRepetition;
    occ.weekRepetitionSpace = data.weekRepetitionSpace;
    occ.monthRepetitionSpace = data.monthRepetitionSpace;
    occ.yearRepetitionSpace = data.yearRepetitionSpace;
    occ.endsType = data.endsType;

    if (props.isEvent) {
      occ.endDateOfOccurrence = data.endDateOfOccurrence
        ? new Date(data.endDateOfOccurrence)
        : occ.dateOfOccurrence;
      occ.qntOccurrencesTillEnd = 0;
    } else {
      occ.endDateOfOccurrence =
        data.endsType === OccurrenceEndsTypeEnum.On && data.endDateOfOccurrence
          ? new Date(data.endDateOfOccurrence)
          : occ.dateOfOccurrence;
      occ.qntOccurrencesTillEnd =
        data.endsType === OccurrenceEndsTypeEnum.After
          ? data.qntOccurrencesTillEnd
          : 0;
    }

    if (isCreate) createOccurrence(occ);
    else updateOccurrence(occ);

    props.handleModal?.(false);
  };
  /* eslint-enable sonarjs/cognitive-complexity */
  return {
    titleRef,
    handleTitleUpdateOnKeyDown,
    handleTitleUpdateOnBlur,
    handleTitleEditMode,
    weekRepetition,
    monthRepetition,
    yearRepetition,
    weekRepetitionSpace,
    monthRepetitionSpace,
    yearRepetitionSpace,
    titleEditMode,
    isAllDay,
    endsType,
    handleAllDay,
    handleSubmit: handleFormSubmit(onSubmit),
    register,
    errors,
    handleMonthRepetition: setMonthRepetition,
    handleYearRepetition: setYearRepetition,
    handleWeekRepetition: setWeekRepetition,
    handleMonthRepetitionSpace: setMonthRepetitionSpace,
    handleYearRepetitionSpace: setYearRepetitionSpace,
    handleWeekRepetitionSpace: setWeekRepetitionSpace,
    handleEndsType: setEndsType,
  };
};

export default useOccurrenceForm;
