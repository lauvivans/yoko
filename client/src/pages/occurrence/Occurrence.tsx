import EventsView from './components/EventsView';
import { useEffect, useState } from 'react';
import CalendarView from './components/CalendarView';
import ActionsView from './components/ActionsView';
import CalendarIcon from '@/components/display/icons/views/Calendar';
import StopWatchIcon from '@/components/display/icons/views/StopWatch';
import ClockIcon from '@/components/display/icons/views/Clock';
import { useAuth } from '@/context/AuthContext';
import useOccurrenceStore, {
  getStoredOccurrences,
} from '@/store/occurrenceStore';
import ArrowLeftIcon from '@/components/display/icons/toolbar/ArrowLeft';
import ArrowRightIcon from '@/components/display/icons/toolbar/ArrowRight';
import { addMonths, format, subMonths } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';

enum ViewsEnum {
  EVENTS = 'EVENTS',
  CALENDAR = 'CALENDAR',
  ACTIONS = 'ACTIONS',
}

const OccurrencePage = () => {
  const { signed } = useAuth();
  const { setOccurrences } = useOccurrenceStore();
  const [view, setView] = useState<ViewsEnum>(ViewsEnum.EVENTS);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    //eslint-disable-next-line no-empty
    if (signed) {
    } else {
      const occ = getStoredOccurrences();
      setOccurrences(occ);
    }
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <main className="p-occurrence">
      <div className="p-occurrence__aside">
        <div className="p-occurrence__aside__tabs">
          <button
            className={`p-occurrence__aside__tabs__tab p-occurrence__aside__tabs__tab${view === ViewsEnum.EVENTS ? '--active' : ''}`}
            onClick={() => setView(ViewsEnum.EVENTS)}
            title="Events"
            aria-label="Go to events view"
          >
            <ClockIcon />
          </button>
          <button
            className={`p-occurrence__aside__tabs__tab p-occurrence__aside__tabs__tab${view === ViewsEnum.CALENDAR ? '--active' : ''}`}
            onClick={() => setView(ViewsEnum.CALENDAR)}
            title="Calendar"
            aria-label="Go to calendar view"
          >
            <CalendarIcon />
          </button>
          <button
            className={`p-occurrence__aside__tabs__tab p-occurrence__aside__tabs__tab${view === ViewsEnum.ACTIONS ? '--active' : ''}`}
            onClick={() => setView(ViewsEnum.ACTIONS)}
            title="Actions"
            aria-label="Go to actions view"
          >
            <StopWatchIcon />
          </button>
        </div>
        {view === ViewsEnum.CALENDAR && (
          <div className="p-occurrence__aside__month-switch">
            <button
              onClick={() => setCurrentDate((current) => addMonths(current, 1))}
            >
              <ArrowLeftIcon />
            </button>
            <span>{format(currentDate, 'MMMM yyyy', { locale: enUS })}</span>
            <button
              onClick={() => setCurrentDate((current) => subMonths(current, 1))}
            >
              <ArrowRightIcon />
            </button>
          </div>
        )}
      </div>
      <div className="p-occurrence__content">
        {view === ViewsEnum.EVENTS && <EventsView />}
        {view === ViewsEnum.CALENDAR && (
          <CalendarView currentDate={currentDate} />
        )}
        {view === ViewsEnum.ACTIONS && <ActionsView />}
      </div>
      {/* eslint-disable-next-line sonarjs/no-commented-code */}
      {/* {search && occurrences.length === 0 && (
        <div>Sorry, we couldn't find any results related to your research.</div>
      )} */}
    </main>
  );
};

export default OccurrencePage;
