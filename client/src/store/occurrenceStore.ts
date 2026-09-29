import { create } from 'zustand';
import { type IOccurrence } from '@/types/Occurrence';
import { getSafeDate } from '@/helpers/formatters/date';
import { differenceInCalendarDays, differenceInCalendarMonths } from 'date-fns';

const LS_KEY = 'yoko-occurrences';

const isActiveOccurrence = (occurrence: IOccurrence) => !occurrence.deletedAt;

export function getStoredOccurrences(): IOccurrence[] {
  const occurrences = localStorage.getItem(LS_KEY);
  return occurrences ? (JSON.parse(occurrences) as IOccurrence[]) : [];
}

export function storeOccurrences(occurrences: IOccurrence[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(occurrences));
}

interface OccurrenceStoreState {
  occurrences: IOccurrence[];
  createOccurrence: (occ: IOccurrence) => void;
  updateOccurrenceTitle: (id: string, newTitle: string) => void;
  updateOccurrence: (occurrence: IOccurrence) => void;
  deleteOccurrence: (id: string) => void;
  setOccurrences: (occurrences: IOccurrence[]) => void;
  getOccurrences: () => IOccurrence[];
  getEvents: (options?: {
    category: string;
    when: { id: number; desc: string };
    includePrevious: boolean;
  }) => {
    events: IOccurrence[];
    totalEvents: number;
  };
  getActions: (options?: { category: string }) => {
    actions: IOccurrence[];
    totalActions: number;
  };
}

const useOccurrenceStore = create<OccurrenceStoreState>((set, get) => ({
  occurrences: [],
  createOccurrence: (occ: IOccurrence) =>
    set((state) => {
      /*eslint-disable sonarjs/no-commented-code*/
      // const occurrenceDate = new Date();

      // const occurrence: IOccurrence = {
      //   id: uuidv7(),
      //   title: 'Unamed',
      //   desc: '',
      //   isEvent,
      //   category: OccurrenceCategoryEnum.Personal,
      //   goalId: null,
      //   dateOfOccurrence: occurrenceDate,
      //   startTime: null,
      //   endTime: null,
      //   allDay: true,
      //   yearRepetition: null,
      //   endDateOfOccurrence: occurrenceDate,
      //   endsType: null,
      //   monthRepetition: null,
      //   qntOccurrencesTillEnd: null,
      //   weekRepetitionSpace: null,
      //   monthRepetitionSpace: null,
      //   yearRepetitionSpace: null,
      //   weekDayRepetition: [getDateWeekDay(occurrenceDate)],
      //   weekRepetition: null,
      // };

      /*eslint-enable sonarjs/no-commented-code*/

      const prevOccurrences = [...state.occurrences];

      prevOccurrences.unshift(occ);

      storeOccurrences(prevOccurrences);

      return {
        ...state,
        occurrences: prevOccurrences,
      };
    }),
  updateOccurrenceTitle: (id: string, newTitle: string) =>
    set((state) => {
      const prevOccurrences = [...state.occurrences];

      for (const e of prevOccurrences) {
        if (e.id === id) {
          e.title = newTitle;
        }
      }

      storeOccurrences(prevOccurrences);

      return {
        ...state,
        occurrences: prevOccurrences,
      };
    }),
  updateOccurrence: (occ: IOccurrence) =>
    set((state) => {
      const prevOccurrences = [...state.occurrences];

      for (const e of prevOccurrences) {
        if (e.id === occ.id) {
          e.allDay = occ.allDay;
          e.category = occ.category;
          e.dateOfOccurrence = occ.dateOfOccurrence;
          e.desc = occ.desc;
          e.monthRepetition = occ.monthRepetition;
          e.weekRepetition = occ.weekRepetition;
          e.yearRepetition = occ.yearRepetition;
          e.monthRepetitionSpace = occ.monthRepetitionSpace;
          e.yearRepetitionSpace = occ.yearRepetitionSpace;
          e.weekRepetitionSpace = occ.weekRepetitionSpace;
          e.weekDayRepetition = occ.weekDayRepetition;
          e.startTime = occ.startTime;
          e.endTime = occ.endTime;
          e.endsType = occ.endsType;
          e.endDateOfOccurrence = occ.endDateOfOccurrence;
          e.qntOccurrencesTillEnd = occ.qntOccurrencesTillEnd;
        }
      }

      storeOccurrences(prevOccurrences);

      return {
        ...state,
        occurrences: prevOccurrences,
      };
    }),
  deleteOccurrence: (id: string) =>
    set((state) => {
      const updatedOccurrences = state.occurrences.map((occurrence) =>
        occurrence.id === id
          ? { ...occurrence, deletedAt: new Date().toISOString() }
          : occurrence
      );

      storeOccurrences(updatedOccurrences);
      return {
        ...state,
        occurrences: updatedOccurrences,
      };
    }),
  setOccurrences: (occurrences: IOccurrence[]) =>
    set(() => ({
      occurrences,
    })),
  getOccurrences: () => get().occurrences.filter(isActiveOccurrence),
  getEvents: (options) => {
    const date = getSafeDate(new Date());

    const optionsCategory = options?.category ?? 'All';
    const whenDesc = options?.when.desc ?? 'All';

    const allCategories = optionsCategory === 'All';
    const allWhen = whenDesc === 'All';

    const allFilters = allCategories && allWhen;

    let events: IOccurrence[] = [];

    if (options?.includePrevious) {
      events = get().occurrences.filter(
        (occ) => isActiveOccurrence(occ) && occ.isEvent
      );
    } else {
      events = get().occurrences.filter((occ) => {
        if (!isActiveOccurrence(occ)) return false;
        const eventDate = getSafeDate(occ.dateOfOccurrence);
        const difference = differenceInCalendarDays(eventDate, date);
        if (difference >= 0) return occ.isEvent;
        return null;
      });
    }

    const filteredEvents = events.filter((ev) => {
      const eventDate = getSafeDate(ev.dateOfOccurrence);
      const difference = differenceInCalendarMonths(eventDate, date);
      const whenId = options?.when.id ?? 0;
      const rightMonth = whenId - 1;

      const biggerThanSeven = whenId === 8 && difference > rightMonth;
      const equalOrBiggerToZero =
        whenId > 0 && whenId < 8 && difference === rightMonth;
      const sameCategory = optionsCategory === (ev.category as string);

      const oneOfWhen = allWhen || biggerThanSeven || equalOrBiggerToZero;
      const oneOfCategory = sameCategory || allCategories;

      return oneOfWhen && oneOfCategory;
    });

    return {
      totalEvents: events.length,
      events: allFilters ? events : filteredEvents,
    };
  },
  getActions: (options) => {
    const optionsCategory = options?.category ?? 'All';

    const allCategories = optionsCategory === 'All';

    const actions = get().occurrences.filter(
      (occ) => isActiveOccurrence(occ) && !occ.isEvent
    );

    const filteredActions = actions.filter((ev) => {
      const sameCategory = optionsCategory === (ev.category as string);
      return sameCategory || allCategories;
    });

    return {
      totalActions: actions.length,
      actions: filteredActions,
    };
  },
}));

export default useOccurrenceStore;
