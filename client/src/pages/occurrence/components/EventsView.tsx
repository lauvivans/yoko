import ListToolbar from '@/components/action/ListToolbar';
import useDelete from '@/hooks/useDelete';
import { type IOccurrence } from '@/types/Occurrence';
import OccurrenceCard from './OccurrenceCard';
import NotFound from './NotFound';
import useOccurrenceStore from '@/store/occurrenceStore';
import TwentyFourHourIcon from '@/components/display/icons/toolbar/24Hour';
import { useState } from 'react';
import TwentyFourHourDisabledIcon from '@/components/display/icons/toolbar/24HourDisabled';
import DefaultButton from '@/components/action/DefaultButton';
import useSort from '../hooks/useSort';
import useFilter from '../hooks/useFilter';
import AddIcon from '@/components/display/icons/toolbar/Add';
import { createPortal } from 'react-dom';
import Modal from '@/components/display/Modal';
import useClickOutside from '@/hooks/useClickOutside';
import useOccurrenceForm from '../hooks/useOccurrenceForm';
import OccurrenceCreateEdit from './OccurrenceCreateEdit';

const filterOptions = [
  'All',
  'This month',
  'Next month',
  'In 2 months',
  'In 3 months',
  'In 4 months',
  'In 5 months',
  'In 6 months',
  'In more than 6 months',
];

const EventsView = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { getEvents } = useOccurrenceStore();
  const { selectedCount, selectedIds, clearSelection, onSelect, onDeselect } =
    useDelete();
  const { deleteOccurrence } = useOccurrenceStore();
  const [is24Hour, setIs24Hour] = useState(true);
  const [activeWhen, setActiveWhen] = useState({
    id: 0,
    desc: filterOptions[0],
  });
  const { activeCategory, FilterList, handleActiveCategory } = useFilter();
  const [includePrevious, setIncludePrevious] = useState(true);
  const eventsRes = getEvents({
    category: activeCategory,
    when: activeWhen,
    includePrevious,
  });

  const occurrenceForm = useOccurrenceForm(true, {
    isEvent: true,
    handleModal: setOpenCreateModal,
  });

  const modalRef = useClickOutside<HTMLDivElement>(() => {
    setOpenCreateModal(false);
  });

  const { occsSorted, sort, SortList } = useSort({
    occurrences: eventsRes.events,
  });

  const resetFilters = () => {
    handleActiveCategory('All');
    setActiveWhen({
      id: 0,
      desc: filterOptions[0],
    });
    setIncludePrevious(true);
  };

  const handleDelete = () => {
    selectedIds.forEach((id) => deleteOccurrence(id));
    clearSelection();
  };

  return (
    <>
      <div className="c-events-view">
        {eventsRes.totalEvents === 0 && (
          <NotFound
            keyword="event"
            handleCreate={() => setOpenCreateModal(true)}
          />
        )}
        <div className="c-events-view__tools">
          {eventsRes.totalEvents > 0 && (
            <>
              <ListToolbar>
                <ListToolbar.Item
                  type="filter"
                  currentActive={`${activeWhen.desc}, ${activeCategory}`}
                >
                  <div className="c-events-view__tools__filter">
                    <div className="c-events-view__tools__filter__when">
                      <div>
                        <span>When</span>
                        <div>
                          <input
                            type="checkbox"
                            id="show-previous"
                            name="show-previous"
                            checked={!!includePrevious}
                            onChange={() => setIncludePrevious((prev) => !prev)}
                          />
                          <label htmlFor="show-previous">
                            Show previous events
                          </label>
                        </div>
                      </div>
                      <ul>
                        {filterOptions?.map((op, i) => (
                          <li
                            onClick={() =>
                              setActiveWhen({
                                id: i,
                                desc: op,
                              })
                            }
                            key={op}
                            data-when-active={activeWhen.desc === op}
                          >
                            {op}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="c-events-view__tools__filter__category">
                      <FilterList />
                    </div>
                    <DefaultButton onClick={resetFilters}>
                      Reset filters
                    </DefaultButton>
                  </div>
                </ListToolbar.Item>
                <ListToolbar.Item
                  type="sort"
                  currentActive={`${sort.toLowerCase()}`}
                >
                  <div className="c-events-view__tools__sort">
                    <SortList />
                  </div>
                </ListToolbar.Item>
                <ListToolbar.Item
                  type="delete"
                  currentActive={`Delete (${selectedCount} selected)`}
                  selectedCount={selectedCount}
                  itemLabel="event"
                  onDelete={handleDelete}
                >
                  <div></div>
                </ListToolbar.Item>
                <ListToolbar.Item
                  type="toggle"
                  ToggleIcon={
                    is24Hour ? TwentyFourHourDisabledIcon : TwentyFourHourIcon
                  }
                  currentActive=""
                  onToggle={() => setIs24Hour((prev) => !prev)}
                  toggleTitle="Set hour format"
                />
              </ListToolbar>
              <button
                className="c-events-view__tools__add-btn"
                aria-label="Add event"
                title="Add event"
                onClick={() => setOpenCreateModal((prev) => !prev)}
              >
                <AddIcon />
              </button>
            </>
          )}
        </div>
        {eventsRes.totalEvents > 0 && eventsRes.events.length > 0 && (
          <div className="c-events-view__cards">
            {occsSorted.map((event: IOccurrence) => (
              <OccurrenceCard
                occurrence={event}
                key={event.id}
                onSelect={onSelect}
                onDeselect={onDeselect}
                is24Hour={is24Hour}
              />
            ))}
          </div>
        )}
        {eventsRes.totalEvents > 0 && eventsRes.events.length === 0 && (
          <NotFound keyword="events" type="filter-no-data" />
        )}
      </div>
      {openCreateModal &&
        createPortal(
          <Modal handleClose={() => setOpenCreateModal(false)} ref={modalRef}>
            <OccurrenceCreateEdit isEvent isCreate {...occurrenceForm} />
          </Modal>,
          document.getElementById('root')!
        )}
    </>
  );
};

export default EventsView;
