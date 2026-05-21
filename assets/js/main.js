/* ═══════════════════════════════════════
   NEETopia — Global JavaScript
   Handles: theme, scroll reveal, mobile menu, progress
   ═══════════════════════════════════════ */

// ── THEME TOGGLE ──
(function () {
  const toggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const htmlEl    = document.documentElement;

  const SUN_SVG  = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
  const MOON_SVG = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;

  function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    if (themeIcon) themeIcon.innerHTML = theme === 'dark' ? SUN_SVG : MOON_SVG;
    localStorage.setItem('neetopia-theme', theme);
  }

  const saved = localStorage.getItem('neetopia-theme') || 'dark';
  setTheme(saved);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
})();

// ── SCROLL REVEAL ──
(function () {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.06 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
})();

// ── MOBILE MENU ──
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  if (!hamburger || !mobileMenu) return;

  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    mobileMenu.classList.add('open');
    if (overlay) overlay.classList.add('open');
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    menuOpen ? closeMenu() : openMenu();
  });

  if (overlay) overlay.addEventListener('click', closeMenu);

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820 && menuOpen) closeMenu();
  });
})();

// ── PROGRESS TRACKER (localStorage) ──
// Usage: call NEETopia.markDone('bio-ch01') to mark a chapter complete
// Call NEETopia.isDone('bio-ch01') to check

window.NEETopia = window.NEETopia || {};

NEETopia.markDone = function(key) {
  const progress = JSON.parse(localStorage.getItem('neetopia-progress') || '{}');
  progress[key] = true;
  localStorage.setItem('neetopia-progress', JSON.stringify(progress));
};

NEETopia.markUndone = function(key) {
  const progress = JSON.parse(localStorage.getItem('neetopia-progress') || '{}');
  delete progress[key];
  localStorage.setItem('neetopia-progress', JSON.stringify(progress));
};

NEETopia.isDone = function(key) {
  const progress = JSON.parse(localStorage.getItem('neetopia-progress') || '{}');
  return !!progress[key];
};

NEETopia.getAll = function() {
  return JSON.parse(localStorage.getItem('neetopia-progress') || '{}');
};

NEETopia.countDone = function() {
  return Object.keys(NEETopia.getAll()).length;
};

// ── CHAPTER CHECKBOX AUTO-INIT ──
// Add data-chapter="bio-ch01" to any <input type="checkbox"> to auto-bind progress
(function () {
  document.querySelectorAll('[data-chapter]').forEach(el => {
    const key = el.getAttribute('data-chapter');
    if (el.tagName === 'INPUT' && el.type === 'checkbox') {
      el.checked = NEETopia.isDone(key);
      el.addEventListener('change', () => {
        if (el.checked) NEETopia.markDone(key);
        else NEETopia.markUndone(key);
      });
    }
  });
})();
