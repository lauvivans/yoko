import ListToolbar from '@/components/action/ListToolbar';
import useDelete from '@/hooks/useDelete';
import useOccurrenceStore from '@/store/occurrenceStore';
import { type IOccurrence } from '@/types/Occurrence';
import OccurrenceCard from './OccurrenceCard';
import NotFound from './NotFound';
import AddIcon from '@/components/display/icons/toolbar/Add';
import useSort from '../hooks/useSort';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import OccurrenceCreateEdit from './OccurrenceCreateEdit';
import Modal from '@/components/display/Modal';
import useFilter from '../hooks/useFilter';
import useClickOutside from '@/hooks/useClickOutside';
import useOccurrenceForm from '../hooks/useOccurrenceForm';
import DefaultButton from '@/components/action/DefaultButton';
import TargetIcon from '@/components/display/icons/toolbar/Target';
import TwentyFourHourDisabledIcon from '@/components/display/icons/toolbar/24HourDisabled';
import TwentyFourHourIcon from '@/components/display/icons/toolbar/24Hour';

const ActionsView = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { getActions } = useOccurrenceStore();
  const { selectedCount, selectedIds, clearSelection, onSelect, onDeselect } =
    useDelete();
  const { deleteOccurrence } = useOccurrenceStore();
  const { activeCategory, FilterList, handleActiveCategory } = useFilter();
  const [is24Hour, setIs24Hour] = useState(true);

  const actionsRes = getActions({
    category: activeCategory,
  });

  const occurrenceForm = useOccurrenceForm(true, {
    isEvent: false,
    handleModal: setOpenCreateModal,
  });

  const { occsSorted, sort, SortList } = useSort({
    occurrences: actionsRes.actions,
  });

  const modalRef = useClickOutside<HTMLDivElement>(() => {
    setOpenCreateModal(false);
  });

  const resetFilters = () => {
    handleActiveCategory('All');
  };

  const handleDelete = () => {
    selectedIds.forEach((id) => deleteOccurrence(id));
    clearSelection();
  };

  return (
    <>
      <div className="c-actions-view">
        {actionsRes.totalActions === 0 && (
          <NotFound
            keyword="action"
            handleCreate={() => setOpenCreateModal(true)}
          />
        )}

        <div className="c-actions-view__tools">
          {actionsRes.totalActions > 0 && (
            <>
              <ListToolbar>
                <ListToolbar.Item
                  type="filter"
                  currentActive={`${activeCategory}`}
                >
                  <div className="c-actions-view__tools__filter">
                    <div className="c-actions-view__tools__filter__category">
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
                  <div className="c-actions-view__tools__sort">
                    <SortList />
                  </div>
                </ListToolbar.Item>
                <ListToolbar.Item
                  type="delete"
                  currentActive={`Delete (${selectedCount} selected)`}
                  selectedCount={selectedCount}
                  itemLabel="action"
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
              <div className="c-actions-view__tools__right-wrapper">
                <button
                  className="c-actions-view__tools__right-wrapper__add-btn"
                  aria-label="Add action"
                  title="Add action"
                  onClick={() => setOpenCreateModal((prev) => !prev)}
                >
                  <AddIcon />
                </button>
                {/* eslint-disable @typescript-eslint/no-empty-function */}
                <button
                  className="c-actions-view__tools__right-wrapper__goal-btn"
                  aria-label="Access my goals"
                  title="Goals"
                  onClick={() => {}}
                >
                  <TargetIcon />
                </button>
                {/* eslint-enable @typescript-eslint/no-empty-function */}
              </div>
            </>
          )}
        </div>
        {actionsRes.totalActions > 0 && actionsRes.actions.length > 0 && (
          <div className="c-actions-view__cards">
            {occsSorted.map((action: IOccurrence) => (
              <OccurrenceCard
                occurrence={action}
                key={action.id}
                onSelect={onSelect}
                onDeselect={onDeselect}
                is24Hour={is24Hour}
              />
            ))}
          </div>
        )}
        {actionsRes.totalActions > 0 && actionsRes.actions.length === 0 && (
          <NotFound keyword="actions" type="filter-no-data" />
        )}
      </div>
      {openCreateModal &&
        createPortal(
          <Modal ref={modalRef} handleClose={() => setOpenCreateModal(false)}>
            <OccurrenceCreateEdit
              isEvent={false}
              isCreate
              {...occurrenceForm}
            />
          </Modal>,
          document.getElementById('root')!
        )}
    </>
  );
};

export default ActionsView;
