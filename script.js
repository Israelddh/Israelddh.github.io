// ---------- Language toggle (ES / EN) ----------
const langToggle = document.getElementById('langToggle');
const root = document.documentElement;

const TITLES = {
  es: {
    index: 'Israel David Duarte Herrera — Meteorología, biología marina y trabajo de campo',
    blog: 'Noticias — Israel David Duarte Herrera'
  },
  en: {
    index: 'Israel David Duarte Herrera — Meteorology, Marine Biology & Fieldwork',
    blog: 'News — Israel David Duarte Herrera'
  }
};

function syncLangUI(lang) {
  const isEn = lang === 'en';
  langToggle.classList.toggle('is-en', isEn);
  langToggle.setAttribute('aria-pressed', String(isEn));
  // the label shows the language you will switch TO
  langToggle.querySelector('.lang-toggle__label').textContent = isEn ? 'Español' : 'English';
  const dl = document.getElementById('dateline');
  if (dl) dl.textContent = new Date().toLocaleDateString(isEn ? 'en-GB' : 'es-ES',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const page = document.body.dataset.page === 'blog' ? 'blog' : 'index';
  document.title = TITLES[lang][page];
}

function currentLang() {
  return root.getAttribute('lang') === 'es' ? 'es' : 'en';
}

// ---------- News rendering ----------
function renderPosts() {
  const list = document.getElementById('postList');
  if (!list) return;

  const lang = currentLang();
  const limit = parseInt(list.dataset.limit, 10) || Infinity;
  const posts = (window.POSTS || [])
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);

  list.innerHTML = '';

  if (!posts.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = lang === 'es'
      ? 'Aún no hay noticias publicadas. Vuelve pronto.'
      : 'No news published yet. Check back soon.';
    list.appendChild(empty);
    return;
  }

  posts.forEach(p => {
    const item = document.createElement('article');
    item.className = 'post';

    const date = new Date(p.date + 'T00:00:00').toLocaleDateString(
      lang === 'es' ? 'es-ES' : 'en-GB',
      { day: 'numeric', month: 'short', year: 'numeric' }
    );

    const head = document.createElement('div');
    head.className = 'post__meta';
    head.innerHTML = '<span class="post__date"></span><span class="post__tag"></span>';
    head.querySelector('.post__date').textContent = date;
    head.querySelector('.post__tag').textContent = p.tag ? p.tag[lang] : '';

    const body = document.createElement('div');
    body.className = 'post__body';

    const h3 = document.createElement('h3');
    const a = document.createElement('a');
    a.href = p.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = p.title[lang];
    h3.appendChild(a);

    const sum = document.createElement('p');
    sum.textContent = p.summary[lang];

    const src = document.createElement('span');
    src.className = 'post__source';
    src.textContent = (lang === 'es' ? 'Fuente: ' : 'Source: ') + p.source;

    body.append(h3, sum, src);
    item.append(head, body);
    list.appendChild(item);
  });
}

syncLangUI(currentLang());
renderPosts();

langToggle.addEventListener('click', () => {
  const next = currentLang() === 'en' ? 'es' : 'en';
  root.setAttribute('lang', next);
  localStorage.setItem('lang', next);
  syncLangUI(next);
  renderPosts();
});

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Reveal sections on scroll ----------
const revealTargets = document.querySelectorAll('.section, .hero__grid, .colophon');
revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => observer.observe(el));

// ---------- Highlight active nav link (in-page anchors only) ----------
const navLinks = [...document.querySelectorAll('.masthead__nav a')]
  .filter(l => l.getAttribute('href').startsWith('#'));
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href')));

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = '#' + entry.target.id;
    const link = document.querySelector(`.masthead__nav a[href="${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('is-active'));
      link.classList.add('is-active');
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(section => { if (section) navObserver.observe(section); });
