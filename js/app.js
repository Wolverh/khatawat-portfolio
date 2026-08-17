(function () {
  'use strict';

  // ── Scroll Reveal ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate counters in this element
        entry.target.querySelectorAll('[data-count]').forEach(counter => {
          if (counter.dataset.animated === 'true') return;
          counter.dataset.animated = 'true';
          animateCounter(counter);
        });
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── Counter Animation ──
  function animateCounter(counter) {
    const target = counter.dataset.count;
    const prefix = counter.dataset.prefix || '';
    const suffix = counter.dataset.suffix || '';
    const isFloat = target.includes('.');
    const targetNum = parseFloat(target.replace(/,/g, ''));
    const duration = 1800;
    const startTime = performance.now();

    function update(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = targetNum * eased;

      if (isFloat) {
        counter.textContent = prefix + current.toFixed(2) + suffix;
      } else {
        counter.textContent = prefix + Math.floor(current).toLocaleString('en-US') + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (isFloat) {
          counter.textContent = prefix + parseFloat(target).toFixed(2) + suffix;
        } else {
          counter.textContent = prefix + parseInt(target.replace(/,/g, '')).toLocaleString('en-US') + suffix;
        }
      }
    }
    requestAnimationFrame(update);
  }

  // ── Navbar Scroll Effect ──
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ── Mobile Nav Toggle ──
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // ── Active Nav Link on Scroll ──
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
})();
