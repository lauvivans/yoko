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
    const content = document.querySelector('.app__content');
    const wide = window.matchMedia('(min-width:1280px)');
    const open = (isEdit) => {
      editing = isEdit;
      if (isEdit) {
        panel.append(form);
        root.classList.add('is-editing');
        panel.hidden = false;
        if (!wide.matches) content.scrollTop = 0;
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

  return { escapeHtml, closeOnBackdrop, dropdowns, renderChips, workspace };
})();
