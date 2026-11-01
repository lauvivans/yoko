// Behavior shared by the module pages: dialogs, popovers, chips and the edit panel.
window.YokoUI = (() => {
  const escapeHtml = (text) => text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  // Dialogs close when the backdrop is clicked.
  const closeOnBackdrop = (dialog) =>
    dialog.addEventListener('click', (e) => {
      const r = dialog.getBoundingClientRect();
      const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      if (outside && e.target === dialog) dialog.close();
    });

  // Popovers open from a toggle and close on outside click or Escape.
  const dropdowns = (names) => {
    const items = names.map((name) => ({ toggle: document.getElementById(`${name}-toggle`), popover: document.getElementById(`${name}-popover`) }));
    const close = (except) =>
      items.forEach((d) => {
        if (d === except) return;
        d.popover.hidden = true;
        d.toggle.setAttribute('aria-expanded', 'false');
      });
    items.forEach((d) =>
      d.toggle.addEventListener('click', () => {
        close(d);
        d.popover.hidden = !d.popover.hidden;
        d.toggle.setAttribute('aria-expanded', String(!d.popover.hidden));
      }),
    );
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.c-dropdown')) close();
    });
    const closeOpen = () => {
      const open = items.find((d) => !d.popover.hidden);
      if (!open) return false;
      close();
      open.toggle.focus();
      return true;
    };
    return { close, closeOpen };
  };

  const renderChips = (container, options, selected, onPick) => {
    container.innerHTML = options
      .map((o) => `<button class="c-chip" type="button" data-id="${o.id}" aria-pressed="${o.id === selected}">${o.label}</button>`)
      .join('');
    container.onclick = (e) => {
      const chip = e.target.closest('.c-chip');
      if (chip) onPick(chip.dataset.id);
    };
  };

  // One form, two places: a dialog to create, the workspace panel to edit.
  const workspace = ({ root, panel, dialog, form, onChange }) => {
    let editing = false;
    const open = (isEdit) => {
      editing = isEdit;
      if (isEdit) {
        panel.append(form);
        root.classList.add('is-editing');
        panel.hidden = false;
        form.querySelector('input,textarea')?.focus();
      } else {
        dialog.append(form);
        dialog.showModal();
      }
      onChange?.();
    };
    const close = () => {
      if (!editing) {
        dialog.close();
        return;
      }
      editing = false;
      panel.hidden = true;
      root.classList.remove('is-editing');
      onChange?.();
    };
    closeOnBackdrop(dialog);
    return { open, close, isEditing: () => editing };
  };

  // Swipe to reveal a row action. Rows are .c-swipe with a .c-swipe__action button and a .c-swipe__card.
  // Only a horizontal drag is taken; vertical drags keep scrolling the page.
  const swipeRows = ({ list, ignore, onAction }) => {
    const ACTION_WIDTH = 96;
    const START_DISTANCE = 8;
    let swipe = null;
    let openRow = null;
    let justSwiped = false;
    const setOffset = (row, x) => {
      row.querySelector('.c-swipe__card').style.transform = x ? `translateX(${x}px)` : '';
      row.querySelector('.c-swipe__action').inert = x === 0;
    };
    const close = () => {
      if (openRow) setOffset(openRow, 0);
      openRow = null;
    };
    list.addEventListener('pointerdown', (e) => {
      const card = e.target.closest('.c-swipe__card');
      if (!card || (ignore && e.target.closest(ignore)) || e.button > 0) return;
      const row = card.closest('.c-swipe');
      if (openRow && openRow !== row) close();
      swipe = { row, startX: e.clientX, startY: e.clientY, base: openRow === row ? -ACTION_WIDTH : 0, moving: false, x: 0, pointerId: e.pointerId };
    });
    list.addEventListener('pointermove', (e) => {
      if (!swipe) return;
      const dx = e.clientX - swipe.startX;
      const dy = e.clientY - swipe.startY;
      if (!swipe.moving) {
        if (Math.abs(dy) > START_DISTANCE && Math.abs(dy) > Math.abs(dx)) {
          swipe = null;
          return;
        }
        if (Math.abs(dx) < START_DISTANCE) return;
        swipe.moving = true;
        swipe.row.classList.add('is-swiping');
        swipe.row.setPointerCapture?.(swipe.pointerId);
      }
      swipe.x = Math.max(-ACTION_WIDTH * 1.5, Math.min(0, swipe.base + dx));
      setOffset(swipe.row, swipe.x);
    });
    const end = () => {
      if (!swipe) return;
      if (swipe.moving) {
        justSwiped = true;
        setTimeout(() => (justSwiped = false));
        swipe.row.classList.remove('is-swiping');
        const open = swipe.x < -ACTION_WIDTH / 2;
        setOffset(swipe.row, open ? -ACTION_WIDTH : 0);
        openRow = open ? swipe.row : null;
      }
      swipe = null;
    };
    list.addEventListener('pointerup', end);
    list.addEventListener('pointercancel', end);
    // A drag ends with a click; it shouldn't also open or select what is under it.
    list.addEventListener(
      'click',
      (e) => {
        if (!justSwiped) return;
        justSwiped = false;
        e.stopPropagation();
        e.preventDefault();
      },
      true,
    );
    document.addEventListener('click', (e) => {
      if (openRow && !openRow.contains(e.target)) close();
    });
    list.addEventListener('click', (e) => {
      const button = e.target.closest('.c-swipe__action');
      if (!button) return;
      onAction(button);
      close();
    });
    return { close };
  };

  return { escapeHtml, closeOnBackdrop, dropdowns, renderChips, workspace, swipeRows };
})();
