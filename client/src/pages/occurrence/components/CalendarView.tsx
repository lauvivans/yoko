import DynamicModal from '@/components/display/DynamicModal';
import { formatDate, getSafeDate } from '@/helpers/formatters/date';
import useClickOutside from '@/hooks/useClickOutside';
import useOccurrenceStore from '@/store/occurrenceStore';
import { autoPlacement, autoUpdate, useFloating } from '@floating-ui/react-dom';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  getDay,
  isAfter,
  isBefore,
  isSameDay,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { useMemo, useState } from 'react';

const WEEKDAY_LABELS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const getDaysOfTheMonth = (date: Date): Date[] => {
  const firstDay = startOfMonth(date);
  const endDay = endOfMonth(date);
  const dayOfTheWeekMonthStarts = getDay(firstDay);
  const dayOfTheWeekMonthEnds = getDay(endDay);
  const qntDaysOfNextMonth = 6 - dayOfTheWeekMonthEnds;

  const previousMonth = eachDayOfInterval({
    start: startOfMonth(subMonths(date, 1)),
    end: endOfMonth(subMonths(date, 1)),
  });

  const currentMonth = eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });

  const nextMonth = eachDayOfInterval({
    start: startOfMonth(addMonths(date, 1)),
    end: endOfMonth(addMonths(date, 1)),
  });

  const daysOfPreviousMonth = previousMonth.slice(
    previousMonth.length - dayOfTheWeekMonthStarts,
    previousMonth.length
  );

  const daysOfNextMonth = nextMonth.slice(0, qntDaysOfNextMonth);

  return daysOfPreviousMonth.concat(currentMonth).concat(daysOfNextMonth);
};

const groupDaysByWeekday = (days: Date[]): Date[][] => {
  const columns: Date[][] = Array.from({ length: 7 }, () => []);
  days.forEach((day) => {
    columns[getDay(day)].push(day);
  });
  return columns;
};

const Occurrences = ({ d }: { d: Date }) => {
  const { getEvents } = useOccurrenceStore();
  const [modalOpen, setModalOpen] = useState(false);

  const ref = useClickOutside<HTMLDivElement>(() => {
    setModalOpen(false);
  });

  const filtered = useMemo(
    () =>
      getEvents().events.filter((e) => {
        const isDateOfSame = isSameDay(
          getSafeDate(new Date(e.dateOfOccurrence)),
          getSafeDate(d)
        );
        const isDateEndSame = isSameDay(
          getSafeDate(new Date(e.endDateOfOccurrence)),
          getSafeDate(d)
        );
        const isBetween =
          isAfter(getSafeDate(d), getSafeDate(new Date(e.dateOfOccurrence))) &&
          isBefore(
            getSafeDate(d),
            getSafeDate(new Date(e.endDateOfOccurrence))
          );

        return isDateOfSame || isDateEndSame || isBetween;
      }),
    [d, getEvents]
  );

  const { refs } = useFloating({
    open: modalOpen,
    middleware: [autoPlacement()],
    whileElementsMounted: autoUpdate,
  });

  return (
    <div className="c-calendar-view__body__item__occurrences" ref={ref}>
      {filtered[0] && (
        <div
          className="c-calendar-view__body__item__occurrences__occurrence"
          key={filtered[0].id}
        >
          {filtered[0].title}
        </div>
      )}
      {filtered[1] && (
        <div
          className="c-calendar-view__body__item__occurrences__occurrence"
          key={filtered[1].id}
        >
          {filtered[1].title}
        </div>
      )}
      {filtered.length > 2 && (
        <>
          <button
            onClick={() => setModalOpen(true)}
            className="c-calendar-view__body__item__occurrences__occurrence__more-btn"
            ref={refs.setReference}
          >
            More
          </button>
          {modalOpen && (
            <>
              {/* eslint-disable react-hooks/refs -- false positive refs.setFloating floating-ui */}
              <DynamicModal ref={refs.setFloating}>
                <h3>
                  More occurrences for <br />
                  <span>{formatDate(d)}</span>
                </h3>
                <ul className="c-calendar-view__body__item__occurrences__occurrence__more">
                  {filtered.map((occ) => (
                    <li key={occ.id}>{occ.title}</li>
                  ))}
                </ul>
              </DynamicModal>
              {/* eslint-enable react-hooks/refs */}
            </>
          )}
        </>
      )}
    </div>
  );
};

const CalendarView = ({ currentDate }: { currentDate: Date }) => {
  const weekdayColumns = groupDaysByWeekday(getDaysOfTheMonth(currentDate));

  return (
    <div className="c-calendar-view">
      <div className="c-calendar-view__head">
        {WEEKDAY_LABELS.map((label) => (
          <div className="c-calendar-view__head__item" key={label}>
            {label}
          </div>
        ))}
      </div>
      <div className="c-calendar-view__body">
        {weekdayColumns.map((columnDays, columnIndex) => (
          <div
            className="c-calendar-view__body__item"
            key={WEEKDAY_LABELS[columnIndex]}
          >
            {columnDays.map((d) => (
              <div key={d.toISOString()}>
                <span>{d.getDate()}</span>
                <Occurrences d={d} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
