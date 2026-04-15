(function() {
  'use strict';

  /* ── Active nav link ── */
  function setActiveNavLink() {
    var path = window.location.pathname.replace(/\/$/, '') || '/index';
    document.querySelectorAll('.nav-link, .mobile-link, .wwf-label').forEach(function(el) {
      var href = el.getAttribute('href') || '';
      if (href && path.includes(href.replace('.html', '').replace('/', ''))) {
        el.classList.add('active');
      }
    });
  }

  /* ── Dropdown toggle ── */
  function initDropdowns() {
    document.querySelectorAll('.nav-item.has-dropdown').forEach(function(item) {
      // Toggle button is either .dropdown-toggle or .wwf-arrow
      var toggle = item.querySelector('.wwf-arrow, .dropdown-toggle');
      if (!toggle) return;

      toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        var isOpen = item.classList.contains('open');
        // Close all
        document.querySelectorAll('.nav-item.has-dropdown').forEach(function(i) {
          i.classList.remove('open');
          var t = i.querySelector('.wwf-arrow, .dropdown-toggle');
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
        var t = i.querySelector('.wwf-arrow, .dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Mobile menu ── */
  function initMobileMenu() {
    var btn = document.getElementById('hamburger-btn');
    var menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function() {
      var isOpen = menu.classList.contains('open');
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
    var overlay = document.getElementById('contact-popup');
    if (!overlay) return;

    var form = document.getElementById('popup-form');
    var successEl = document.getElementById('popup-success');
    var closeBtn = overlay.querySelector('.popup-close');

    function openPopup() {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (form) form.style.display = '';
      if (successEl) successEl.style.display = 'none';
    }

    function closePopup() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-popup="contact"], .open-popup').forEach(function(btn) {
      btn.addEventListener('click', openPopup);
    });

    if (closeBtn) closeBtn.addEventListener('click', closePopup);

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closePopup();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closePopup();
    });

    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var submitBtn = form.querySelector('.popup-submit');
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;

        var data = new FormData(form);
        fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        }).then(function(res) {
          if (res.ok) {
            form.style.display = 'none';
            if (successEl) successEl.style.display = 'flex';
          } else {
            submitBtn.textContent = 'GET MY OPTIONS →';
            submitBtn.disabled = false;
            alert('Something went wrong — please try again or call Nick directly on 021 102 3416.');
          }
        }).catch(function() {
          submitBtn.textContent = 'GET MY OPTIONS →';
          submitBtn.disabled = false;
          alert('Connection error. Please check your internet and try again.');
        });
      });
    }
  }

  /* ── Header scroll shadow ── */
  function initHeaderScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;
    window.addEventListener('scroll', function() {
      header.style.boxShadow = window.scrollY > 10
        ? '0 2px 20px rgba(22,20,15,.08)'
        : 'none';
    }, { passive: true });
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();
    initDropdowns();
    initMobileMenu();
    initPopup();
    initHeaderScroll();
  });

})();
