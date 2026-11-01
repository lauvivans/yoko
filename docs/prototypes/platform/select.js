// Select: turns each <select class="c-select__native"> into a button and a listbox styled like the
// status menu, so the open list looks the same in every browser. The native select stays in the
// form (hidden) and keeps the value, so page scripts read, set and listen to it as before.
(() => {
  const valueOf = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
  const indexOf = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'selectedIndex');
  const TYPE_AHEAD_MS = 600;
  let count = 0;

  const colorOf = (option) => option?.style.getPropertyValue('--option-color') ?? '';
  const setColor = (el, block, color) => {
    el.classList.toggle(`${block}--color`, Boolean(color));
    el.style.setProperty('--option-color', color || null);
  };

  const labelButton = (select, button) => {
    if (select.hasAttribute('aria-label')) {
      button.setAttribute('aria-label', select.getAttribute('aria-label'));
      return;
    }
    const label = select.labels[0];
    if (!label) return;
    // A wrapping label also holds the options' text, so its name is the span inside it.
    const name = label.contains(select) ? label.querySelector('span') : label;
    name.id ||= `${button.id}-label`;
    button.setAttribute('aria-labelledby', name.id);
    label.addEventListener('click', (e) => {
      if (e.target.closest('.c-select')) return;
      e.preventDefault();
      button.focus();
    });
  };

  const enhance = (select) => {
    const id = `select-${++count}`;
    const root = document.createElement('div');
    root.className = 'c-select';
    root.innerHTML = `<button class="c-select__button" type="button" id="${id}" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}-list" popovertarget="${id}-list"><span class="c-select__value"></span></button><ul class="c-select__list" id="${id}-list" role="listbox" popover></ul>`;
    select.before(root);
    root.prepend(select);
    const button = root.querySelector('.c-select__button');
    const value = root.querySelector('.c-select__value');
    const list = root.querySelector('.c-select__list');
    labelButton(select, button);
    let active = 0;
    let typed = '';
    let typedAt = 0;

    const items = () => [...list.children];
    const isOpen = () => list.matches(':popover-open');
    const setActive = (index) => {
      const all = items();
      if (!all.length) return;
      active = Math.max(0, Math.min(index, all.length - 1));
      all.forEach((item, i) => item.classList.toggle('is-active', i === active));
      button.setAttribute('aria-activedescendant', all[active].id);
    };

    const render = () => {
      root.hidden = select.hidden;
      button.disabled = select.disabled;
      if (select.getAttribute('aria-invalid') === 'true') button.setAttribute('aria-invalid', 'true');
      else button.removeAttribute('aria-invalid');
      const selected = select.options[indexOf.get.call(select)];
      value.textContent = selected?.textContent ?? '';
      setColor(button, 'c-select__button', colorOf(selected));
      list.replaceChildren(
        ...[...select.options].map((option, i) => {
          const item = document.createElement('li');
          item.className = 'c-select__option';
          item.id = `${id}-option-${i}`;
          item.setAttribute('role', 'option');
          item.setAttribute('aria-selected', String(option.selected));
          item.textContent = option.textContent;
          setColor(item, 'c-select__option', colorOf(option));
          return item;
        }),
      );
      if (isOpen()) setActive(active);
    };

    const choose = (index) => {
      list.hidePopover();
      button.focus();
      if (index === indexOf.get.call(select)) return;
      indexOf.set.call(select, index);
      render();
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const typeAhead = (key) => {
      typed = Date.now() - typedAt > TYPE_AHEAD_MS ? key : typed + key;
      typedAt = Date.now();
      const match = items().findIndex((item) => item.textContent.toLowerCase().startsWith(typed.toLowerCase()));
      if (match >= 0) setActive(match);
    };

    // Opens below the button, or above it when there is no room below.
    list.addEventListener('beforetoggle', (e) => {
      const open = e.newState === 'open';
      button.setAttribute('aria-expanded', String(open));
      if (!open) {
        button.removeAttribute('aria-activedescendant');
        return;
      }
      setActive(indexOf.get.call(select));
      const box = button.getBoundingClientRect();
      list.style.minWidth = `${box.width}px`;
      list.style.left = `${box.left}px`;
      list.style.top = `${box.bottom + 6}px`;
    });
    list.addEventListener('toggle', (e) => {
      if (e.newState !== 'open') return;
      const box = button.getBoundingClientRect();
      list.style.left = `${Math.max(8, Math.min(box.left, innerWidth - list.offsetWidth - 8))}px`;
      if (box.bottom + 6 + list.offsetHeight > innerHeight - 8 && box.top > innerHeight - box.bottom) list.style.top = `${box.top - 6 - list.offsetHeight}px`;
    });
    list.addEventListener('mousemove', (e) => {
      const item = e.target.closest('.c-select__option');
      if (item) setActive(items().indexOf(item));
    });
    list.addEventListener('click', (e) => {
      const item = e.target.closest('.c-select__option');
      if (item) choose(items().indexOf(item));
    });

    const moves = {
      ArrowDown: () => setActive(active + 1),
      ArrowUp: () => setActive(active - 1),
      Home: () => setActive(0),
      End: () => setActive(items().length - 1),
    };
    // Enter and Space on a closed select open it through popovertarget.
    button.addEventListener('keydown', (e) => {
      const open = isOpen();
      if (open && e.key === 'Tab') choose(active);
      else if (open && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        choose(active);
      } else if (moves[e.key]) {
        e.preventDefault();
        if (open) moves[e.key]();
        else list.showPopover();
      } else if (e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (!open) list.showPopover();
        typeAhead(e.key);
      }
    });
    addEventListener('resize', () => isOpen() && list.hidePopover());
    document.addEventListener('scroll', () => isOpen() && list.hidePopover(), true);

    // Page scripts set .value and .selectedIndex directly, which fires no event, so the button
    // re-renders from these setters, from option changes and from form resets.
    Object.defineProperty(select, 'value', {
      configurable: true,
      get: () => valueOf.get.call(select),
      set: (v) => {
        valueOf.set.call(select, v);
        render();
      },
    });
    Object.defineProperty(select, 'selectedIndex', {
      configurable: true,
      get: () => indexOf.get.call(select),
      set: (v) => {
        indexOf.set.call(select, v);
        render();
      },
    });
    new MutationObserver(render).observe(select, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['disabled', 'hidden', 'aria-invalid', 'selected'] });
    select.form?.addEventListener('reset', () => setTimeout(render));
    render();
  };

  document.querySelectorAll('select.c-select__native').forEach(enhance);
})();
