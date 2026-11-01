// Export and import data: choose, progress, then success or error.
(() => {
  const { closeOnBackdrop } = window.YokoUI;
  const mascot = '../../../client/public/mascot.svg';
  const close = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M18 6 6 18M6 6l12 12"/></svg>';

  document.body.insertAdjacentHTML(
    'beforeend',
    `<dialog class="c-dialog c-data" id="export-dialog" aria-labelledby="export-title">
      <div class="c-dialog__head"><h2 id="export-title">Export my data</h2><button class="c-icon-btn" type="button" data-close aria-label="Close">${close}</button></div>
      <div class="c-data__step" data-step="choose">
        <p>I want to export my data into…</p>
        <div class="c-data__choices">
          <button class="c-button c-button--module" type="button" data-format="xlsx">A spreadsheet</button>
          <button class="c-button c-button--module" type="button" data-format="pdf">A PDF</button>
        </div>
      </div>
      <div class="c-data__step" data-step="progress" hidden></div>
      <div class="c-data__step" data-step="done" hidden>
        <p class="c-data__result" role="status">Your data is ready.</p>
        <button class="c-button c-button--module" type="button" data-close id="export-download">Download</button>
      </div>
      <img class="c-data__mascot" src="${mascot}" alt="">
    </dialog>
    <dialog class="c-dialog c-data" id="import-dialog" aria-labelledby="import-title">
      <div class="c-dialog__head"><h2 id="import-title">Import my data</h2><button class="c-icon-btn" type="button" data-close aria-label="Close">${close}</button></div>
      <form class="c-data__step" data-step="choose" novalidate>
        <ol class="c-data__steps">
          <li><span>Download the example spreadsheet and fill it in.</span><button class="c-button c-button--ghost" type="button">Download example</button></li>
          <li><label class="c-field"><span>Your spreadsheet</span><input type="file" name="file" accept=".xlsx,.csv" required></label></li>
        </ol>
        <p class="c-data__hint">Prototype: a file with “error” in its name shows the error state.</p>
        <button class="c-button c-button--module" type="submit">Import</button>
      </form>
      <div class="c-data__step" data-step="progress" hidden></div>
      <div class="c-data__step" data-step="done" hidden>
        <p class="c-data__result" role="status">Data imported: 12 events, 4 actions and 7 notes.</p>
        <button class="c-button c-button--module" type="button" data-close>Done</button>
      </div>
      <div class="c-data__step" data-step="error" hidden>
        <p class="c-data__result" role="alert">Something went wrong while importing. Check that your spreadsheet follows the example and try again.</p>
        <button class="c-button c-button--ghost" type="button" data-retry>Try again</button>
      </div>
      <img class="c-data__mascot" src="${mascot}" alt="">
    </dialog>`,
  );

  const progressHtml = (label) => `
    <p id="${label}-label">Your data is being ${label}ed…</p>
    <span class="c-progress" role="progressbar" aria-labelledby="${label}-label" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></span>
    <span class="c-data__percent"><span>0%</span><span>100%</span></span>`;

  const show = (dialog, step) => {
    dialog.querySelectorAll('.c-data__step').forEach((el) => (el.hidden = el.dataset.step !== step));
    dialog.dataset.state = step;
  };

  // The timer stands in for the real export or import, so the progress can be seen.
  const stepMs = 60;
  const run = (dialog, label, onDone) => {
    const step = dialog.querySelector('[data-step="progress"]');
    step.innerHTML = progressHtml(label);
    show(dialog, 'progress');
    const bar = step.querySelector('[role="progressbar"]');
    let value = 0;
    const timer = setInterval(() => {
      value = Math.min(100, value + 4);
      bar.setAttribute('aria-valuenow', value);
      bar.firstElementChild.style.width = `${value}%`;
      step.querySelector('.c-data__percent span').textContent = `${value}%`;
      if (value === 100) {
        clearInterval(timer);
        onDone();
      }
    }, stepMs);
    dialog.addEventListener('close', () => clearInterval(timer), { once: true });
  };

  const exportDialog = document.getElementById('export-dialog');
  const importDialog = document.getElementById('import-dialog');
  [exportDialog, importDialog].forEach((dialog) => {
    closeOnBackdrop(dialog);
    dialog.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) dialog.close();
    });
  });

  exportDialog.querySelectorAll('[data-format]').forEach((button) =>
    button.addEventListener('click', () => {
      document.getElementById('export-download').textContent = `Download yoko-data.${button.dataset.format}`;
      run(exportDialog, 'export', () => show(exportDialog, 'done'));
    }),
  );

  const importForm = importDialog.querySelector('form');
  importForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const file = importForm.elements.namedItem('file');
    file.setCustomValidity(file.files.length ? '' : 'Choose a spreadsheet to import.');
    if (!importForm.reportValidity()) return;
    const fails = file.files[0].name.toLowerCase().includes('error');
    run(importDialog, 'import', () => show(importDialog, fails ? 'error' : 'done'));
  });
  importForm.addEventListener('change', (e) => e.target.setCustomValidity(''));
  importDialog.querySelector('[data-retry]').addEventListener('click', () => {
    importForm.reset();
    show(importDialog, 'choose');
  });

  const open = (dialog) => {
    show(dialog, 'choose');
    dialog.showModal();
  };
  document.querySelectorAll('[data-open="export"]').forEach((el) => el.addEventListener('click', () => open(exportDialog)));
  document.querySelectorAll('[data-open="import"]').forEach((el) => el.addEventListener('click', () => open(importDialog)));
})();
