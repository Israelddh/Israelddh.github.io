// Theme toggle (light / dark)
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function syncToggleUI(theme) {
  const isDark = theme === 'dark';
  themeToggle.classList.toggle('is-dark', isDark);
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.querySelector('.theme-toggle__label').textContent = isDark ? 'Light' : 'Dark';
}

syncToggleUI(root.getAttribute('data-theme') || 'light');

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  syncToggleUI(next);
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal sections on scroll
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

// Highlight active nav link based on scroll position
const navLinks = document.querySelectorAll('.masthead__nav a');
const sections = [...navLinks].map(link => document.querySelector(link.getAttribute('href')));

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
