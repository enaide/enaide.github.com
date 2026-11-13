/* enaide.github.io — main.js
   Solo dos responsabilidades: tema (claro/oscuro) y menú móvil.
   Sin JS, el sitio se lee y navega completo. */

const root = document.documentElement;

/* ---------- Tema ---------- */
const toggle = document.querySelector('.theme-toggle');
const mq = window.matchMedia('(prefers-color-scheme: light)');

function currentTheme() {
  const forced = root.getAttribute('data-theme');
  if (forced === 'light' || forced === 'dark') return forced;
  return mq.matches ? 'light' : 'dark';
}

function labelToggle() {
  if (!toggle) return;
  const next = currentTheme() === 'light' ? 'dark' : 'light';
  toggle.setAttribute('aria-label', toggle.dataset[next === 'light' ? 'labelLight' : 'labelDark']);
}

if (toggle) {
  toggle.addEventListener('click', () => {
    const next = currentTheme() === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* almacenamiento no disponible */ }
    labelToggle();
  });
  mq.addEventListener('change', labelToggle);
  labelToggle();
}

/* ---------- Menú móvil ---------- */
const btn = document.querySelector('.nav__toggle');
const list = document.getElementById('nav-list');

function setMenu(open) {
  if (!btn || !list) return;
  list.classList.toggle('is-open', open);
  btn.setAttribute('aria-expanded', String(open));
}

if (btn && list) {
  btn.addEventListener('click', () => setMenu(!list.classList.contains('is-open')));
  list.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && list.classList.contains('is-open')) { setMenu(false); btn.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (!list.classList.contains('is-open')) return;
    if (!e.target.closest('.nav')) setMenu(false);
  });
}
