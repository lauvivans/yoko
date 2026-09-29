import { useCallback, useMemo, useState } from 'react';
import NoteIcon from '@/components/display/icons/features/Note';
import { formatDate, formatHour } from '@/helpers/formatters/date';
import { differenceInCalendarDays } from 'date-fns';
import useClickOutside from '@/hooks/useClickOutside';
import DynamicModal from '@/components/display/DynamicModal';
import {
  useFloating,
  autoUpdate,
  flip,
  shift,
  size,
} from '@floating-ui/react-dom';
import PersonalIcon from '@/components/display/icons/categories/Personal';
import WorkIcon from '@/components/display/icons/categories/Work';
import Divider from '@/components/utils/Divider';
import useOccurrenceForm from '../hooks/useOccurrenceForm';
import FamilyIcon from '@/components/display/icons/categories/Family';
import FinanceIcon from '@/components/display/icons/categories/Finance';
import HealthIcon from '@/components/display/icons/categories/Health';
import HobbyIcon from '@/components/display/icons/categories/Hobby';
import HomeIcon from '@/components/display/icons/categories/Home';
import ReadingIcon from '@/components/display/icons/categories/Reading';
import SocialIcon from '@/components/display/icons/categories/Social';
import StudyIcon from '@/components/display/icons/categories/Study';
import TravelIcon from '@/components/display/icons/categories/Travel';
import { type IOccurrence } from '@/types/Occurrence';
import OccurrenceCreateEdit from './OccurrenceCreateEdit';
import useOccurrenceDateStore from '@/store/occurrenceDateStore';
import { OccurrenceCategoryEnum } from '../enum/OccurrenceCategoryEnum';
import { OccurrenceEndsTypeEnum } from '../enum/OccurrenceEndsTypeEnum';

const Countdown = ({ dateToEvent }: { dateToEvent: Date }) => {
  const difference = differenceInCalendarDays(
    new Date(dateToEvent).toISOString().slice(0, 10),
    new Date().toISOString().slice(0, 10)
  );

  return (
    <span className="c-occurrence-card__content__countdown">
      {difference < 0 && (
        <>
          Already <br /> happened
        </>
      )}
      {difference === 0 && <>It&apos;s today!!</>}
      {difference > 0 && (
        <>
          In{' '}
          <span className="c-occurrence-card__content__countdown--highlight">
            {difference}
          </span>{' '}
          {difference === 1 ? 'day' : 'days'}
        </>
      )}
    </span>
  );
};

const CategoryIcon = ({ category }: { category: OccurrenceCategoryEnum }) => {
  if (category === OccurrenceCategoryEnum.Personal) return <PersonalIcon />;
  if (category === OccurrenceCategoryEnum.Family) return <FamilyIcon />;
  if (category === OccurrenceCategoryEnum.Finance) return <FinanceIcon />;
  if (category === OccurrenceCategoryEnum.Health) return <HealthIcon />;
  if (category === OccurrenceCategoryEnum.Hobby) return <HobbyIcon />;
  if (category === OccurrenceCategoryEnum.Home) return <HomeIcon />;
  if (category === OccurrenceCategoryEnum.Reading) return <ReadingIcon />;
  if (category === OccurrenceCategoryEnum.Social) return <SocialIcon />;
  if (category === OccurrenceCategoryEnum.Study) return <StudyIcon />;
  if (category === OccurrenceCategoryEnum.Travel) return <TravelIcon />;
  if (category === OccurrenceCategoryEnum.Work) return <WorkIcon />;
  return null;
};

const OccurrenceCard = ({
  onSelect,
  onDeselect,
  occurrence,
  is24Hour,
}: {
  onSelect: (id: string) => void;
  onDeselect: (id: string) => void;
  occurrence: IOccurrence;
  is24Hour: boolean;
}) => {
  const [showDesc, setShowDesc] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [optionsMenuModalOpen, setOptionsMenuModalOpen] = useState(false);

  const occurrenceForm = useOccurrenceForm(false, {
    handleModal: setEditModalOpen,
    occurrenceId: occurrence.id,
    allDay: occurrence.allDay,
    isEvent: occurrence.isEvent,
    endsTypeDefault: occurrence.endsType ?? OccurrenceEndsTypeEnum.Never,
    monthRepetitionDefault: occurrence.monthRepetition ?? 0,
    monthRepetitionSpaceDefault: occurrence.monthRepetitionSpace ?? 0,
    weekRepetitionDefault: occurrence.weekRepetition ?? 0,
    weekRepetitionSpaceDefault: occurrence.weekRepetitionSpace ?? 0,
    yearRepetitionDefault: occurrence.yearRepetition ?? 0,
    yearRepetitionSpaceDefault: occurrence.yearRepetitionSpace ?? 0,
  });

  const {
    titleEditMode,
    handleTitleEditMode,
    handleTitleUpdateOnKeyDown,
    titleRef,
    handleTitleUpdateOnBlur,
  } = occurrenceForm;

  const { getCompletedOccurrenceDates } = useOccurrenceDateStore();

  const articleRef = useClickOutside<HTMLDivElement>(() => {
    setEditModalOpen(false);
    setOptionsMenuModalOpen(false);
  });

  const handleDesc = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setShowDesc((prev) => !prev);
  };

  const { refs: editModalRefs, floatingStyles: editModalFloatingStyles } =
    useFloating({
      open: editModalOpen,
      placement: 'left-start',
      middleware: [
        flip({
          boundary: document.getElementById('app-outlet') ?? undefined,
        }),
        shift({
          boundary: document.getElementById('app-outlet') ?? undefined,
          padding: 5,
        }),
        size({
          boundary: document.getElementById('app-outlet') ?? undefined,
          padding: 8,
          apply({ availableHeight, availableWidth, elements }) {
            Object.assign(elements.floating.style, {
              maxHeight: `${availableHeight}px`,
              maxWidth: `${availableWidth}px`,
              overflow: 'auto',
            });
          },
        }),
      ],
      whileElementsMounted: (reference, floating, update) =>
        autoUpdate(reference, floating, update, {
          elementResize: false,
        }),
    });

  const {
    refs: optionsMenuModalRefs,
    floatingStyles: optionsMenuFloatingStyles,
  } = useFloating({
    open: optionsMenuModalOpen,
    placement: 'top',
    middleware: [flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const setReference = useCallback(
    (node: HTMLElement | null) => {
      editModalRefs.setReference(node);
      optionsMenuModalRefs.setReference(node);
    },
    [editModalRefs, optionsMenuModalRefs]
  );

  const completedDays = useMemo(() => {
    const completed = getCompletedOccurrenceDates(occurrence.id);
    return completed.length;
  }, [occurrence.id, getCompletedOccurrenceDates]);

  return (
    <div className="c-occurrence-card-wrapper" ref={articleRef}>
      <article
        className={`c-occurrence-card c-occurrence-card--${occurrence.category}`}
        onContextMenu={(e) => {
          e.preventDefault();
          setEditModalOpen(false);
          setOptionsMenuModalOpen((prev) => !prev);
        }}
        onClick={() => {
          setOptionsMenuModalOpen(false);
          setEditModalOpen((prev) => !prev);
        }}
        ref={setReference}
      >
        <div className="c-occurrence-card__content">
          <div className="c-occurrence-card__content__title-container">
            {occurrence.desc && !titleEditMode && (
              <button onClick={handleDesc}>
                <NoteIcon />
              </button>
            )}
            {titleEditMode && (
              <textarea
                placeholder={occurrence.title}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleTitleUpdateOnKeyDown}
                ref={titleRef}
                defaultValue={occurrence.title}
                onBlur={handleTitleUpdateOnBlur}
                maxLength={50}
                rows={3}
                autoFocus
              />
            )}
            {!titleEditMode && (
              <h3
                className="c-occurrence-card__content__title-container__title"
                onClick={handleTitleEditMode}
              >
                {occurrence.title}
              </h3>
            )}
          </div>
          {showDesc && occurrence.desc && (
            <>
              <Divider />
              <p className="c-occurrence-card__content__desc">
                {occurrence.desc}
              </p>
            </>
          )}
          <div className="c-occurrence-card__content__datetime-container">
            <span className="c-occurrence-card__content__datetime-container__date">
              {formatDate(occurrence.dateOfOccurrence)} -{' '}
              {formatDate(occurrence.endDateOfOccurrence)}
            </span>
            {occurrence.startTime && occurrence.endTime && (
              <span className="c-occurrence-card__content__datetime-container__time">
                {formatHour(
                  occurrence.dateOfOccurrence,
                  occurrence.startTime,
                  is24Hour
                )}{' '}
                -{' '}
                {formatHour(
                  occurrence.dateOfOccurrence,
                  occurrence.endTime,
                  is24Hour
                )}
              </span>
            )}
          </div>
          {!occurrence.isEvent && (
            <span className="c-occurrence-card__content__countup">
              <span className="c-occurrence-card__content__countup--highlight">
                {completedDays}
              </span>{' '}
              days
            </span>
          )}
          {occurrence.isEvent && (
            <Countdown dateToEvent={occurrence.dateOfOccurrence} />
          )}
        </div>
        <div className="c-occurrence-card__category-icon">
          <CategoryIcon category={occurrence.category} />
        </div>
        <div className="c-occurrence-card__checkbox-container">
          <input
            onClick={(e) => e.stopPropagation()}
            type="checkbox"
            onChange={(e) =>
              e.target.checked
                ? onSelect(occurrence.id)
                : onDeselect(occurrence.id)
            }
          />
        </div>
      </article>

      {/* eslint-disable react-hooks/refs -- false positive refs.setFloating floating-ui */}
      <DynamicModal
        ref={editModalRefs.setFloating}
        onClick={(e) => e.stopPropagation()}
        className="c-occurrence-card-wrapper__edit-modal"
        style={{
          ...editModalFloatingStyles,
          visibility: editModalOpen ? 'visible' : 'hidden',
        }}
      >
        <OccurrenceCreateEdit
          occurrence={occurrence}
          {...occurrenceForm}
          isCreate={false}
          isEvent={occurrence.isEvent}
        />
      </DynamicModal>

      <DynamicModal
        className="c-occurrence-card-wrapper__options-menu-modal"
        ref={optionsMenuModalRefs.setFloating}
        onClick={(e) => e.stopPropagation()}
        style={{
          ...optionsMenuFloatingStyles,
          visibility: optionsMenuModalOpen ? 'visible' : 'hidden',
        }}
      >
        <div>Options menu</div>
      </DynamicModal>
      {/* eslint-enable react-hooks/refs */}
    </div>
  );
};

export default OccurrenceCard;
