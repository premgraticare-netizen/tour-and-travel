document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  const menuToggle = document.querySelector('.menu-toggle');

  function updateHeader() {
    let overHero = false;
    if (hero && header) {
      const rect = hero.getBoundingClientRect();
      // header is 'over' the hero when the hero's bottom is still below the header
      // i.e., while hero's bottom > header height, header sits on top of hero
      overHero = rect.bottom > header.offsetHeight + 4;
    } else {
      // No hero on this page — treat header as scrolled (dark links)
      overHero = false;
    }
    if (overHero) {
      header.classList.add('over-hero');
      header.classList.remove('scrolled');
    } else {
      header.classList.remove('over-hero');
      header.classList.add('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader);
  window.addEventListener('resize', updateHeader);
  updateHeader();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateHeader);
  requestAnimationFrame(() => setTimeout(updateHeader, 50));

  // Mobile menu toggle
  if (menuToggle && header) {
    menuToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      // update header height when menu opens/closes
      syncHeaderHeight();
    });
  }

  // Close menu when clicking a nav link
  document.querySelectorAll('.nav a').forEach(a => {
    a.addEventListener('click', () => {
      if (header.classList.contains('open')) {
        header.classList.remove('open');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!header) return;
    if (!header.classList.contains('open')) return;
    const inside = e.composedPath().some(el => el === header || (el.classList && el.classList.contains && el.classList.contains('menu-toggle')));
    if (!inside) {
      header.classList.remove('open');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('open')) {
      header.classList.remove('open');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Keep a CSS variable with header height so body can be padded when header is fixed
  function syncHeaderHeight() {
    if (!header) return;
    const h = header.offsetHeight;
    document.documentElement.style.setProperty('--header-height', h + 'px');
  }

  // run on load and resize
  syncHeaderHeight();
  window.addEventListener('resize', syncHeaderHeight);

  // observe header class changes (e.g., open) and update height
  if (header && window.MutationObserver) {
    const mo = new MutationObserver(syncHeaderHeight);
    mo.observe(header, { attributes: true, attributeFilter: ['class'] });
  }

  // Hero search form behavior: scroll to packages and log values
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const values = {
        destination: (document.getElementById('dest')||{}).value || '',
        date: (document.getElementById('date')||{}).value || '',
        travellers: (document.getElementById('travellers')||{}).value || ''
      };
      console.log('Search submitted', values);
      const target = document.getElementById('packages');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        alert('Search submitted: ' + JSON.stringify(values));
      }
    });
  }
});
