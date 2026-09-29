import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import TrashIcon from '@/components/display/icons/toolbar/Trash';
import FilterIcon from '@/components/display/icons/toolbar/Filter';
import SortIcon from '@/components/display/icons/toolbar/Sort';
import DynamicModal from '@/components/display/DynamicModal';
import {
  autoUpdate,
  flip,
  shift,
  size,
  useFloating,
} from '@floating-ui/react-dom';
import useClickOutside from '@/hooks/useClickOutside';
import Modal from '@/components/display/Modal';

const ListToolbarItem = ({
  children,
  type,
  currentActive,
  ToggleIcon,
  onToggle,
  toggleTitle,
  selectedCount = 0,
  itemLabel = 'item',
  onDelete,
}: {
  children?: React.ReactNode;
  type: 'delete' | 'filter' | 'sort' | 'toggle';
  ToggleIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onToggle?: () => void;
  currentActive: string;
  toggleTitle?: string;
  selectedCount?: number;
  itemLabel?: string;
  onDelete?: () => void;
}) => {
  const [openModalOptions, setOpenModalOptions] = useState(false);
  const [openModalChoice, setOpenModalChoice] = useState(false);

  const isSort = type === 'sort';
  const isFilter = type === 'filter';
  const isDelete = type === 'delete';
  const isToggle = type === 'toggle';

  const handleClick = () => {
    if (isSort || isFilter) setOpenModalOptions((prev) => !prev);
    else if (isDelete && selectedCount > 0) setOpenModalChoice((prev) => !prev);
    else onToggle?.();
  };

  const itemRef = useClickOutside<HTMLDivElement>(() => {
    setOpenModalOptions(false);
  });

  const { refs, floatingStyles } = useFloating({
    open: openModalOptions,
    placement: 'bottom-start',
    middleware: [
      flip({
        boundary: document.getElementById('app-outlet') ?? undefined,
      }),
      shift({
        boundary: document.getElementById('app-outlet') ?? undefined,
      }),
      size({
        boundary: document.getElementById('app-outlet') ?? undefined,
        apply({ availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
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

  const btnTitle = useMemo(() => {
    if (isFilter) return 'Filter';
    if (isSort) return 'Sort';
    if (isDelete) return 'Delete';
    return toggleTitle;
  }, [isFilter, isSort, isDelete, isToggle]);

  return (
    <div className="c-list-toolbar__item-wrapper" ref={itemRef}>
      <div className="c-list-toolbar__item-wrapper__item">
        <button
          onClick={handleClick}
          ref={refs.setReference}
          className="c-list-toolbar__item-wrapper__item__btn"
          title={btnTitle}
        >
          {isDelete && <TrashIcon />}
          {isFilter && <FilterIcon />}
          {isSort && <SortIcon />}
          {isToggle && ToggleIcon && <ToggleIcon />}
          {currentActive}
        </button>
      </div>
      {/* eslint-disable react-hooks/refs -- false positive refs.setFloating floating-ui */}
      <DynamicModal
        ref={refs.setFloating}
        className="c-list-toolbar__modal"
        style={{
          ...floatingStyles,
          visibility:
            (isSort || isFilter) && openModalOptions ? 'visible' : 'hidden',
        }}
      >
        {isSort && (
          <span className="c-list-toolbar__modal__title">Sort by</span>
        )}
        {isFilter && (
          <span className="c-list-toolbar__modal__title">Filter by</span>
        )}
        {children}
      </DynamicModal>
      {/* eslint-enable react-hooks/refs */}
      {isDelete &&
        openModalChoice &&
        createPortal(
          <Modal handleClose={() => setOpenModalChoice(false)}>
            <div className="c-delete-confirmation">
              <p>
                Are you sure you want to delete {selectedCount}{' '}
                {selectedCount === 1 ? itemLabel : `${itemLabel}s`}?
              </p>
              <div className="c-delete-confirmation__actions">
                <button type="button" onClick={() => setOpenModalChoice(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete?.();
                    setOpenModalChoice(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal>,
          document.getElementById('root')!
        )}
    </div>
  );
};

const ListToolbar = ({ children }: { children: React.ReactNode }) => {
  return <div className="c-list-toolbar">{children}</div>;
};

ListToolbar.Item = ListToolbarItem;

export default ListToolbar;
