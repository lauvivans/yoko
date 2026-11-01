// Places: the illustrated map, the place card, the add and edit forms, and the photo gallery.
const $ = (id) => document.getElementById(id);
const { closeOnBackdrop } = window.YokoUI;

$('module-badge').insertAdjacentHTML('afterbegin', window.mascots.places);

// Sample data for the prototype. Photos are gradients with a photo icon, not real pictures; ratio is width / height.
const categories = {
  Travel: 'var(--bg-cat-travel)',
  Social: 'var(--bg-cat-social)',
  Hobby: 'var(--bg-cat-hobby)',
  Reading: 'var(--bg-cat-reading)',
  Family: 'var(--bg-cat-family)',
};
const photo = (from, to, caption, ratio, busy = false) => ({ colors: [from, to], caption, ratio, busy });
const places = [
  { id: 1, title: 'Primrose Hill', where: 'Camden, London', x: 18, y: 19, category: 'Hobby', visited: '2025-03-12', fav: true,
    note: 'Sunset picnic with the whole city at our feet. Bring a blanket, the grass gets wet early.',
    photos: [photo('#f6b26b', '#e06666', 'Sunset from the top', 3 / 4), photo('#93c47d', '#38761d', 'The lawn', 4 / 3), photo('#9fc5e8', '#3d85c6', 'City view', 2 / 3)] },
  { id: 2, title: 'British Library', where: "King's Cross, London", x: 47, y: 17, category: 'Reading', visited: '2025-03-14', fav: false,
    note: 'Saw the treasures gallery. The King’s Library tower is even taller in person.',
    photos: [photo('#b4a7d6', '#674ea7', 'The tower of books', 2 / 3), photo('#d5a6bd', '#a64d79', 'Reading room', 4 / 3)] },
  { id: 3, title: 'Borough Market', where: 'Southwark, London', x: 54, y: 83, category: 'Social', visited: '2025-03-15', fav: true,
    note: 'Lunch with friends. Go before noon on Saturdays or it gets packed.',
    photos: [photo('#ffd966', '#e69138', 'Food stalls', 1, true), photo('#ea9999', '#cc0000', 'Strawberries', 4 / 5), photo('#b6d7a8', '#6aa84f', 'Green market', 3 / 2, true)] },
  { id: 4, title: 'Tower Bridge', where: 'Tower Hamlets, London', x: 65, y: 73, category: 'Travel', visited: '2025-03-15', fav: false,
    note: 'Walked across at night. The glass floor of the walkway is scary and worth it.',
    photos: [photo('#6fa8dc', '#1c4587', 'At night', 3 / 4), photo('#a2c4c9', '#45818e', 'From the river', 16 / 9)] },
  { id: 5, title: 'Regent’s Park', where: 'Marylebone, London', x: 31, y: 31, category: 'Family', visited: '2025-03-16', fav: false,
    note: 'Rose garden with the family. Queen Mary’s Gardens are at their best in June.',
    photos: [photo('#f4cccc', '#e06666', 'Rose garden', 4 / 5), photo('#d9ead3', '#93c47d', 'Boating lake', 4 / 3)] },
  { id: 6, title: 'Shoreditch', where: 'Hackney, London', x: 66, y: 22, category: 'Hobby', visited: '2025-03-17', fav: false,
    note: 'Street art walk. Every wall changes from one month to the next.',
    photos: [photo('#c27ba0', '#741b47', 'Mural', 2 / 3), photo('#ffe599', '#bf9000', 'Brick Lane', 1)] },
];
places.forEach((place, i) => (place.number = i + 1));

const icons = {
  calendar: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z"/></svg>',
  gallery: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z"/><path d="M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM2.67 18.95l4.93-3.31c.79-.53 1.93-.47 2.64.14l.33.29c.78.67 2.04.67 2.82 0l4.16-3.57c.78-.67 2.04-.67 2.82 0L22 13.9"/></g></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M18 6 6 18M6 6l12 12"/></svg>',
};

const background = (p) =>
  p.url ? `url("${p.url}")` : [`var(--photo-placeholder)`, p.busy && 'var(--photo-texture)', `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})`].filter(Boolean).join(', ');
const formatDate = (iso) => new Date(`${iso}T00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const todayIso = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
const replay = (el, className) => {
  el.classList.remove(className);
  void el.offsetWidth; // Forces a reflow so the same animation can run again.
  el.classList.add(className);
};

/* Map: pan and zoom the illustration */

const mapEl = $('map');
const layer = $('map-layer');
const view = { x: 0, y: 0, scale: 1 };
// Keep the drawing at its 1000x700 ratio and cover the area, so pins stay on their spots.
const base = { left: 0, top: 0 };
const fit = () => {
  const ratio = Math.max(mapEl.clientWidth / 1000, mapEl.clientHeight / 700);
  base.left = (mapEl.clientWidth - 1000 * ratio) / 2;
  base.top = (mapEl.clientHeight - 700 * ratio) / 2;
  Object.assign(layer.style, { left: `${base.left}px`, top: `${base.top}px`, width: `${1000 * ratio}px`, height: `${700 * ratio}px` });
};
fit();
window.addEventListener('resize', fit);
const applyView = () => {
  layer.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
  layer.style.setProperty('--inv', 1 / view.scale);
};
const zoom = (factor) => {
  const next = Math.min(2.5, Math.max(1, view.scale * factor));
  const cx = mapEl.clientWidth / 2 - base.left;
  const cy = mapEl.clientHeight / 2 - base.top;
  view.x = cx - ((cx - view.x) / view.scale) * next;
  view.y = cy - ((cy - view.y) / view.scale) * next;
  view.scale = next;
  if (next === 1) view.x = view.y = 0;
  applyView();
};
$('zoom-in').addEventListener('click', () => zoom(1.4));
$('zoom-out').addEventListener('click', () => zoom(1 / 1.4));
mapEl.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15);
  },
  { passive: false },
);

const DRAG_THRESHOLD = 5;
let drag = null;
let dragged = false;
mapEl.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.c-pin-btn')) return;
  drag = { x: e.clientX - view.x, y: e.clientY - view.y, startX: e.clientX, startY: e.clientY };
  dragged = false;
  mapEl.classList.add('is-dragging');
  mapEl.setPointerCapture(e.pointerId);
});
mapEl.addEventListener('pointermove', (e) => {
  if (!drag) return;
  dragged ||= Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > DRAG_THRESHOLD;
  view.x = e.clientX - drag.x;
  view.y = e.clientY - drag.y;
  applyView();
});
mapEl.addEventListener('pointerup', () => {
  drag = null;
  mapEl.classList.remove('is-dragging');
});

/* Pins and the place card */

const markers = new Map();
let selectedId = null;
let activeFilter = 'All';
let query = '';
let nextId = places.length + 1;

const createPin = ({ x, y, color, label, text }) => {
  const pin = document.createElement('button');
  pin.type = 'button';
  pin.className = 'c-pin-btn';
  pin.style.setProperty('--x', `${x}%`);
  pin.style.setProperty('--y', `${y}%`);
  pin.setAttribute('aria-label', label);
  const shape = document.createElement('span');
  shape.className = 'c-pin';
  shape.style.setProperty('--pin-color', color);
  const number = document.createElement('span');
  number.textContent = text;
  shape.append(number);
  pin.append(shape);
  $('pins').append(pin);
  return pin;
};

const addMarker = (place) => {
  const pin = createPin({ x: place.x, y: place.y, color: categories[place.category], label: place.title, text: place.number });
  pin.addEventListener('click', () => select(place.id));
  markers.set(place.id, pin);
};

const updateMarker = (place) => {
  const pin = markers.get(place.id);
  pin.setAttribute('aria-label', place.title);
  pin.firstElementChild.style.setProperty('--pin-color', categories[place.category]);
};

const tag = (text, { color, icon } = {}) => {
  const el = document.createElement('span');
  el.className = color ? 'c-tag' : 'c-tag c-tag--plain';
  if (color) el.style.setProperty('--tag-color', color);
  if (icon) el.insertAdjacentHTML('afterbegin', icon);
  el.append(text);
  return el;
};

const selectedPlace = () => places.find((p) => p.id === selectedId);

function select(id) {
  selectedId = id;
  markers.forEach((pin, pinId) => pin.firstElementChild.classList.toggle('is-selected', pinId === id));
  renderCard(selectedPlace(), 0);
  $('place').hidden = false;
}

function renderCard(place, photoIndex) {
  const current = place.photos[photoIndex];
  const photoEl = $('photo');
  photoEl.style.backgroundImage = current ? background(current) : 'none';
  photoEl.textContent = current ? current.caption : 'No photos yet';
  photoEl.disabled = !current;
  photoEl.setAttribute('aria-label', current ? `Open photo: ${current.caption}` : 'No photos yet');
  photoEl.onclick = () => openViewer(place.photos.map((p) => ({ photo: p, place })), photoIndex);

  const thumbs = place.photos.map((p, i) => {
    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = 'c-thumb' + (i === photoIndex ? ' is-selected' : '');
    thumb.style.backgroundImage = background(p);
    thumb.setAttribute('aria-label', `Show photo: ${p.caption}`);
    thumb.addEventListener('click', () => renderCard(place, i));
    return thumb;
  });
  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'c-thumb c-thumb--add';
  add.setAttribute('aria-label', 'Add photos');
  add.insertAdjacentHTML('afterbegin', icons.plus);
  add.addEventListener('click', () => openPhotos(place));
  $('thumbs').replaceChildren(...thumbs, add);

  $('title').textContent = place.title;
  $('where').textContent = place.where;
  $('note').textContent = place.note;

  const seeAll = document.createElement('button');
  seeAll.type = 'button';
  seeAll.className = 'c-tag c-tag--plain c-tag--button';
  seeAll.insertAdjacentHTML('afterbegin', icons.gallery);
  seeAll.append(plural(place.photos.length, 'photo'));
  seeAll.disabled = place.photos.length === 0;
  seeAll.addEventListener('click', () => openGallery(place));
  $('meta').replaceChildren(
    tag(place.category, { color: categories[place.category] }),
    tag(`Visited ${formatDate(place.visited)}`, { icon: icons.calendar }),
    seeAll,
  );

  const fav = $('fav');
  fav.classList.toggle('is-on', place.fav);
  fav.setAttribute('aria-pressed', String(place.fav));
  fav.onclick = () => {
    place.fav = !place.fav;
    renderCard(place, photoIndex);
  };
}

$('close').addEventListener('click', () => {
  $('place').hidden = true;
  markers.forEach((pin) => pin.firstElementChild.classList.remove('is-selected'));
  selectedId = null;
});

/* Filters and search */

const filterButtons = ['All', ...Object.keys(categories)].map((name) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'c-filter';
  button.textContent = name;
  if (categories[name]) button.style.setProperty('--filter-color', categories[name]);
  button.addEventListener('click', () => setFilter(name));
  return button;
});
$('filters').replaceChildren(...filterButtons);

function setFilter(name) {
  activeFilter = name;
  filterButtons.forEach((b) => {
    b.classList.toggle('is-active', b.textContent === name);
    b.setAttribute('aria-pressed', String(b.textContent === name));
  });
  applyFilters();
}

$('search').addEventListener('input', (event) => {
  query = event.target.value.trim().toLowerCase();
  applyFilters();
});

function applyFilters() {
  let visible = 0;
  places.forEach((place) => {
    const matches =
      (activeFilter === 'All' || place.category === activeFilter) &&
      (!query || place.title.toLowerCase().includes(query) || place.where.toLowerCase().includes(query));
    markers.get(place.id).hidden = !matches;
    if (matches) visible++;
  });
  $('count').textContent = `${visible} of ${plural(places.length, 'place')}`;
}

/* Add a place: pick the spot on the map, then fill in the form */

let picking = false;
let draft = null;

const startPicking = () => {
  picking = true;
  $('places-root').classList.add('is-picking');
  $('pick').hidden = false;
  $('place').hidden = true;
  $('pick-center').focus();
};
const stopPicking = () => {
  picking = false;
  $('places-root').classList.remove('is-picking');
  $('pick').hidden = true;
};
const pickAt = (clientX, clientY) => {
  const box = layer.getBoundingClientRect();
  const x = ((clientX - box.left) / box.width) * 100;
  const y = ((clientY - box.top) / box.height) * 100;
  stopPicking();
  draft = { x, y, pin: createPin({ x, y, color: 'var(--bg-places)', label: 'New place', text: '+' }) };
  draft.pin.firstElementChild.classList.add('is-draft');
  openPlaceForm(null);
};

$('add-place').addEventListener('click', startPicking);
$('pick-cancel').addEventListener('click', () => {
  stopPicking();
  if (selectedId) $('place').hidden = false;
});
$('pick-center').addEventListener('click', () => {
  const box = mapEl.getBoundingClientRect();
  pickAt(box.left + box.width / 2, box.top + box.height / 2);
});
mapEl.addEventListener('click', (e) => {
  if (!picking || dragged || e.target.closest('.c-pin-btn')) return;
  pickAt(e.clientX, e.clientY);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && picking) $('pick-cancel').click();
});

/* Place form: create and edit */

const placeDialog = $('place-dialog');
const placeForm = $('place-form');
const field = (name) => placeForm.elements.namedItem(name);
let editing = null;
let formPhotos = [];

field('category').replaceChildren(
  ...Object.keys(categories).map((name) => {
    const option = document.createElement('option');
    option.textContent = name;
    option.style.setProperty('--option-color', categories[name]);
    return option;
  }),
);

const photosFromFiles = (files) =>
  [...files]
    .filter((file) => file.type.startsWith('image/'))
    .map((file) => {
      const p = { url: URL.createObjectURL(file), caption: file.name.replace(/\.[^.]+$/, ''), ratio: 1 };
      const img = new Image();
      img.onload = () => {
        p.ratio = img.naturalWidth / img.naturalHeight;
      };
      img.src = p.url;
      return p;
    });

const removeButton = (label, onClick) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'c-photos__remove';
  button.setAttribute('aria-label', label);
  button.insertAdjacentHTML('afterbegin', icons.close);
  button.addEventListener('click', onClick);
  return button;
};

const renderFormPhotos = () => {
  const items = formPhotos.map((p, i) => {
    const item = document.createElement('li');
    item.className = 'c-photos__item';
    item.style.backgroundImage = background(p);
    item.append(
      removeButton(`Remove photo: ${p.caption}`, () => {
        formPhotos.splice(i, 1);
        renderFormPhotos();
      }),
    );
    return item;
  });
  const add = document.createElement('li');
  add.append($('form-photos-add'));
  $('form-photos').replaceChildren(...items, add);
};

$('form-photos-input').addEventListener('change', (e) => {
  formPhotos.push(...photosFromFiles(e.target.files));
  e.target.value = '';
  renderFormPhotos();
});

const setHeading = (el, text, name) => {
  el.textContent = text;
  if (!name) return;
  const b = document.createElement('b');
  b.textContent = name;
  el.append(b);
};

function openPlaceForm(place) {
  editing = place;
  setHeading($('place-form-title'), place ? 'Edit ' : 'New place', place?.title);
  field('title').value = place?.title ?? '';
  field('where').value = place?.where ?? '';
  field('category').value = place?.category ?? (activeFilter === 'All' ? 'Travel' : activeFilter);
  field('visited').max = todayIso();
  field('visited').value = place?.visited ?? todayIso();
  field('note').value = place?.note ?? '';
  field('fav').checked = place?.fav ?? false;
  field('title').setCustomValidity('');
  field('visited').setCustomValidity('');
  formPhotos = [...(place?.photos ?? [])];
  renderFormPhotos();
  $('delete-place').hidden = !place;
  $('submit-place').textContent = place ? 'Save' : 'Create';
  placeDialog.showModal();
}

placeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = field('title').value.trim();
  const visited = field('visited').value;
  field('title').setCustomValidity(title ? '' : 'Give the place a name.');
  field('visited').setCustomValidity(visited && visited <= todayIso() ? '' : 'Pick a day up to today.');
  if (!placeForm.reportValidity()) return;

  const data = {
    title,
    where: field('where').value.trim(),
    category: categories[field('category').value] ? field('category').value : 'Travel',
    visited,
    note: field('note').value.trim(),
    fav: field('fav').checked,
    photos: formPhotos,
  };
  let place = editing;
  if (place) {
    Object.assign(place, data);
    updateMarker(place);
  } else {
    place = { id: nextId++, number: places.length + 1, x: draft.x, y: draft.y, ...data };
    places.push(place);
    addMarker(place);
  }
  placeDialog.close();
  if (activeFilter !== 'All' && activeFilter !== place.category) setFilter('All');
  else applyFilters();
  select(place.id);
});

placeDialog.addEventListener('close', () => {
  draft?.pin.remove();
  draft = null;
  editing = null;
  if (selectedId) $('place').hidden = false;
});
$('close-place-form').addEventListener('click', () => placeDialog.close());
$('cancel-place').addEventListener('click', () => placeDialog.close());
closeOnBackdrop(placeDialog);
$('edit-place').addEventListener('click', () => openPlaceForm(selectedPlace()));

const deleteDialog = $('delete-dialog');
closeOnBackdrop(deleteDialog);
$('delete-place').addEventListener('click', () => {
  $('delete-name').textContent = editing.title;
  deleteDialog.returnValue = '';
  deleteDialog.showModal();
});
deleteDialog.addEventListener('close', () => {
  if (deleteDialog.returnValue !== 'delete' || !editing) return;
  const id = editing.id;
  markers.get(id).remove();
  markers.delete(id);
  places.splice(places.findIndex((p) => p.id === id), 1);
  selectedId = null;
  placeDialog.close();
  $('place').hidden = true;
  applyFilters();
});

/* Add photos */

const photosDialog = $('photos-dialog');
let photosTarget = null;
let uploads = [];

const renderUploads = () => {
  const items = uploads.map((p, i) => {
    const item = document.createElement('li');
    item.className = 'c-upload';
    const preview = document.createElement('span');
    preview.className = 'c-upload__preview';
    preview.style.backgroundImage = background(p);
    const caption = document.createElement('input');
    caption.className = 'c-upload__caption';
    caption.value = p.caption;
    caption.maxLength = 60;
    caption.setAttribute('aria-label', `Caption for photo ${i + 1}`);
    caption.addEventListener('input', () => (p.caption = caption.value));
    item.append(
      preview,
      caption,
      removeButton(`Remove photo ${i + 1}`, () => {
        URL.revokeObjectURL(p.url);
        uploads.splice(i, 1);
        renderUploads();
      }),
    );
    return item;
  });
  $('uploads').replaceChildren(...items);
  $('submit-photos').disabled = uploads.length === 0;
  $('submit-photos').textContent = uploads.length ? `Add ${plural(uploads.length, 'photo')}` : 'Add photos';
};

const addUploads = (files) => {
  uploads.push(...photosFromFiles(files));
  renderUploads();
};

function openPhotos(place) {
  photosTarget = place;
  uploads = [];
  setHeading($('photos-title'), 'Add photos to ', place.title);
  renderUploads();
  photosDialog.showModal();
}

$('add-photos').addEventListener('click', () => openPhotos(selectedPlace()));
$('photo-files').addEventListener('change', (e) => {
  addUploads(e.target.files);
  e.target.value = '';
});
const dropzone = $('dropzone');
dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('is-over');
});
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('is-over'));
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('is-over');
  addUploads(e.dataTransfer.files);
});

$('photos-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!uploads.length) return;
  const first = photosTarget.photos.length;
  photosTarget.photos.push(...uploads.map((p) => ({ ...p, caption: p.caption.trim() || 'Untitled photo' })));
  uploads = [];
  photosDialog.close();
  if (photosTarget.id === selectedId) renderCard(photosTarget, first);
});
photosDialog.addEventListener('close', () => {
  uploads.forEach((p) => URL.revokeObjectURL(p.url));
  uploads = [];
});
$('close-photos').addEventListener('click', () => photosDialog.close());
$('cancel-photos').addEventListener('click', () => photosDialog.close());
closeOnBackdrop(photosDialog);

/* Gallery: a wall of photos, like a pinboard */

const galleryDialog = $('gallery');

function openGallery(place = null) {
  const shots = (place ? [place] : places).flatMap((p) => p.photos.map((photo) => ({ photo, place: p })));
  setHeading($('gallery-title'), place ? '' : 'All photos', place?.title);
  $('gallery-count').textContent = place ? plural(shots.length, 'photo') : `${plural(shots.length, 'photo')} from ${plural(places.length, 'place')}`;
  const items = shots.map((shot, i) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'c-gallery__item';
    button.setAttribute('aria-label', `Open photo: ${shot.photo.caption}, ${shot.place.title}`);
    const picture = document.createElement('span');
    picture.className = 'c-gallery__photo';
    picture.style.backgroundImage = background(shot.photo);
    picture.style.setProperty('--ratio', shot.photo.ratio);
    const caption = document.createElement('span');
    caption.className = 'c-gallery__caption';
    caption.textContent = shot.photo.caption;
    button.append(picture, caption);
    if (!place) {
      const where = document.createElement('span');
      where.className = 'c-gallery__place';
      where.textContent = shot.place.title;
      button.append(where);
    }
    button.addEventListener('click', () => openViewer(shots, i));
    item.append(button);
    return item;
  });
  $('gallery-wall').replaceChildren(...items);
  galleryDialog.showModal();
}

$('open-gallery').addEventListener('click', () => openGallery());
$('close-gallery').addEventListener('click', () => galleryDialog.close());

/* Viewer: one photo in full screen, with previous and next */

const viewer = $('viewer');
const SWIPE_DISTANCE = 50;
let shown = [];
let shownIndex = 0;

const showPhoto = (index, direction) => {
  shownIndex = (index + shown.length) % shown.length;
  const { photo: current, place } = shown[shownIndex];
  const picture = $('viewer-photo');
  picture.style.backgroundImage = background(current);
  picture.style.setProperty('--ratio', current.ratio);
  picture.setAttribute('aria-label', current.caption);
  $('viewer-caption').textContent = current.caption;
  $('viewer-place').textContent = `${place.title} · ${formatDate(place.visited)}`;
  $('viewer-count').textContent = `${shownIndex + 1} / ${shown.length}`;
  $('viewer-prev').hidden = $('viewer-next').hidden = shown.length < 2;
  if (direction) replay(picture, direction === 1 ? 'is-next' : 'is-prev');
};

function openViewer(shots, index) {
  shown = shots;
  showPhoto(index);
  viewer.showModal();
}

$('viewer-prev').addEventListener('click', () => showPhoto(shownIndex - 1, -1));
$('viewer-next').addEventListener('click', () => showPhoto(shownIndex + 1, 1));
$('close-viewer').addEventListener('click', () => viewer.close());
viewer.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') showPhoto(shownIndex - 1, -1);
  if (e.key === 'ArrowRight') showPhoto(shownIndex + 1, 1);
});
let swipeStart = null;
$('viewer-stage').addEventListener('pointerdown', (e) => (swipeStart = e.clientX));
$('viewer-stage').addEventListener('pointerup', (e) => {
  if (swipeStart === null) return;
  const distance = e.clientX - swipeStart;
  swipeStart = null;
  if (Math.abs(distance) < SWIPE_DISTANCE || shown.length < 2) return;
  if (distance < 0) showPhoto(shownIndex + 1, 1);
  else showPhoto(shownIndex - 1, -1);
});

/* Start */

places.forEach(addMarker);
setFilter('All');
select(1);
