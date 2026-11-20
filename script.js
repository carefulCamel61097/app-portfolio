// Light / dark toggle (dark is the default; the choice is remembered per browser)
const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const label = () => { toggle.textContent = root.dataset.theme === 'light' ? 'Dark mode' : 'Light mode'; };
label();
toggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  label();
});

// Folder tabs: click, keyboard (arrows/Home/End) and #hash links (e.g. index.html#zouzou)
const tabs = [...document.querySelectorAll('[role="tab"]')];

function select(tab, { focus = false, updateHash = true } = {}) {
  tabs.forEach(t => {
    const on = t === tab;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
  if (focus) tab.focus();
  if (updateHash) history.replaceState(null, '', '#' + tab.getAttribute('aria-controls'));
}

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => select(tab));
  tab.addEventListener('keydown', e => {
    const n = tabs.length;
    const to = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    select(tabs[to], { focus: true });
  });
});

const fromHash = tabs.find(t => '#' + t.getAttribute('aria-controls') === location.hash);
if (fromHash) select(fromHash, { updateHash: false });
