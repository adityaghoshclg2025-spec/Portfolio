/* ==========================================================================
   Aditya Ghosh — Portfolio Script
   Vanilla JS, no dependencies. Progressive enhancement: every feature here
   degrades gracefully if a browser API isn't available — the page already
   works without this file, this just makes it feel alive.
   ========================================================================== */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-nav');

  if (navToggle && primaryNav) {
    const openNav = () => {
      primaryNav.classList.add('is-open');
      navToggle.classList.add('is-active');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
    };

    const closeNav = () => {
      primaryNav.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    };

    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.contains('is-open');
      isOpen ? closeNav() : openNav();
    });

    // Tapping a link closes the panel (single-page nav, so links don't navigate away)
    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    // Outside click closes it
    document.addEventListener('click', (event) => {
      if (!primaryNav.classList.contains('is-open')) return;
      const clickedInside =
        primaryNav.contains(event.target) || navToggle.contains(event.target);
      if (!clickedInside) closeNav();
    });

    // Escape closes it and returns focus to the toggle
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });

    // Resizing back up to desktop clears any open mobile state
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeNav();
    });
  }

  /* ---------- Header state on scroll ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const setScrolled = () => {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }

  /* ---------- Scroll-spy: highlight the current section in the nav ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.primary-nav a');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const linkFor = (id) =>
      document.querySelector(`.primary-nav a[href="#${id}"]`);

    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const link = linkFor(entry.target.id);
          if (!link) return;
          navLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => spyObserver.observe(section));
  }

  /* ---------- Scroll-reveal ---------- */
  const revealTargets = document.querySelectorAll(
    [
      '.hero-content',
      '.about > *',
      '.education-card',
      '.skills-list li',
      '.project-card',
      '.contact > *',
    ].join(', ')
  );

  if (revealTargets.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      // No motion, or no observer support — just show everything.
      revealTargets.forEach((el) => el.classList.add('reveal', 'is-visible'));
    } else {
      revealTargets.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(i % 4) * 90}ms`;
      });

      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
      );

      revealTargets.forEach((el) => revealObserver.observe(el));
    }
  }
})();