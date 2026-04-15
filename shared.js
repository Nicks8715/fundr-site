/* =============================================
   FUNDR SHARED JS — shared.js
   Handles: nav dropdown, mobile menu,
            contact popup, active link states
   ============================================= */

(function() {
  'use strict';

  /* ── Active nav link ── */
  function setActiveNavLink() {
    const path = window.location.pathname.replace(/\/$/, '') || '/index';
    document.querySelectorAll('.nav-link, .mobile-link').forEach(function(el) {
      const href = el.getAttribute('href') || '';
      if (href && path.includes(href.replace('.html', '').replace('/', ''))) {
        el.classList.add('active');
      }
    });
  }

  /* ── Dropdown toggle ── */
  function initDropdowns() {
    document.querySelectorAll('.nav-item.has-dropdown').forEach(function(item) {
      const toggle = item.querySelector('.dropdown-toggle');
      if (!toggle) return;

      toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const isOpen = item.classList.contains('open');
        // Close all
        document.querySelectorAll('.nav-item.has-dropdown').forEach(function(i) {
          i.classList.remove('open');
          const t = i.querySelector('.dropdown-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', function() {
      document.querySelectorAll('.nav-item.has-dropdown').forEach(function(i) {
        i.classList.remove('open');
        const t = i.querySelector('.dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Mobile menu ── */
  function initMobileMenu() {
    const btn = document.getElementById('hamburger-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function() {
      const isOpen = menu.classList.contains('open');
      if (isOpen) {
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      } else {
        menu.classList.add('open');
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        menu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close on link click
    menu.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Contact Popup ── */
  function initPopup() {
    const overlay = document.getElementById('contact-popup');
    if (!overlay) return;

    const card = overlay.querySelector('.popup-card');
    const closeBtn = overlay.querySelector('.popup-close');
    const form = document.getElementById('popup-form');
    const successEl = document.getElementById('popup-success');

    function openPopup() {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Reset
      if (form) form.style.display = '';
      if (successEl) successEl.style.display = 'none';
    }

    function closePopup() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    // Trigger buttons — any element with data-popup="contact" or class "open-popup"
    document.querySelectorAll('[data-popup="contact"], .open-popup').forEach(function(btn) {
      btn.addEventListener('click', openPopup);
    });

    if (closeBtn) closeBtn.addEventListener('click', closePopup);

    // Close on overlay click (not card)
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closePopup();
    });

    // Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closePopup();
    });

    // Form submit
    if (form) {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitBtn = form.querySelector('.popup-submit');
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;

        try {
          const data = new FormData(form);
          const res = await fetch(form.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
          });
          if (res.ok) {
            form.style.display = 'none';
            if (successEl) successEl.style.display = 'block';
          } else {
            submitBtn.textContent = 'GET MY OPTIONS →';
            submitBtn.disabled = false;
            alert('Something went wrong — please try again or call Nick directly.');
          }
        } catch {
          submitBtn.textContent = 'GET MY OPTIONS →';
          submitBtn.disabled = false;
          alert('Connection error. Please check your internet and try again.');
        }
      });
    }
  }

  /* ── Header scroll shadow ── */
  function initHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 20px rgba(22,20,15,.08)';
      } else {
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  /* ── Init all ── */
  document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();
    initDropdowns();
    initMobileMenu();
    initPopup();
    initHeaderScroll();
  });

})();
