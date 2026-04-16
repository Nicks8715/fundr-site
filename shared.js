(function() {
  'use strict';

  function init() {
    setActiveNavLink();
    initDropdowns();
    initMobileMenu();
    initPopup();
    initHeaderScroll();
  }

  /* ── Active nav link ── */
  function setActiveNavLink() {
    var path = window.location.pathname.replace(/\/$/, '') || '/index';
    document.querySelectorAll('.nav-link, .mobile-link, .wwf-label').forEach(function(el) {
      var href = el.getAttribute('href') || '';
      if (href && href !== '#' && path.indexOf(href.replace('.html','')) !== -1) {
        el.classList.add('active');
      }
    });
  }

  /* ── Dropdown ── */
  function initDropdowns() {
    document.querySelectorAll('.nav-item.has-dropdown').forEach(function(item) {
      var toggle = item.querySelector('.wwf-arrow, .dropdown-toggle');
      if (!toggle) return;
      toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        var isOpen = item.classList.contains('open');
        document.querySelectorAll('.nav-item.has-dropdown').forEach(function(i) {
          i.classList.remove('open');
          var t = i.querySelector('.wwf-arrow, .dropdown-toggle');
          if (t) t.setAttribute('aria-expanded','false');
        });
        if (!isOpen) {
          item.classList.add('open');
          toggle.setAttribute('aria-expanded','true');
        }
      });
    });
    document.addEventListener('click', function() {
      document.querySelectorAll('.nav-item.has-dropdown').forEach(function(i) {
        i.classList.remove('open');
        var t = i.querySelector('.wwf-arrow, .dropdown-toggle');
        if (t) t.setAttribute('aria-expanded','false');
      });
    });
  }

  /* ── Mobile menu ── */
  function initMobileMenu() {
    var btn = document.getElementById('hamburger-btn');
    var menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', function() {
      var open = menu.classList.contains('open');
      menu.classList.toggle('open', !open);
      btn.classList.toggle('open', !open);
      btn.setAttribute('aria-expanded', String(!open));
      menu.setAttribute('aria-hidden', String(open));
      document.body.style.overflow = open ? '' : 'hidden';
    });
    menu.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded','false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Popup ── */
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

    /* Wire ALL open-popup triggers — including ones loaded after init */
    function wirePopupTriggers() {
      document.querySelectorAll('[data-popup="contact"], .open-popup').forEach(function(btn) {
        if (!btn._popupWired) {
          btn._popupWired = true;
          btn.addEventListener('click', openPopup);
        }
      });
    }
    wirePopupTriggers();

    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) closePopup(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closePopup(); });

    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = form.querySelector('.popup-submit');
        btn.textContent = 'Sending…';
        btn.disabled = true;
        var data = new FormData(form);
        fetch(form.action, { method:'POST', body:data, headers:{'Accept':'application/json'} })
          .then(function(res) {
            if (res.ok) {
              form.style.display = 'none';
              if (successEl) { successEl.style.display = 'flex'; }
            } else {
              btn.textContent = 'GET MY OPTIONS →';
              btn.disabled = false;
              alert('Something went wrong — please call Nick on 021 102 3416.');
            }
          })
          .catch(function() {
            btn.textContent = 'GET MY OPTIONS →';
            btn.disabled = false;
            alert('Connection error — please try again or call 021 102 3416.');
          });
      });
    }
  }

  /* ── Header scroll shadow ── */
  function initHeaderScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;
    window.addEventListener('scroll', function() {
      header.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(22,20,15,.08)' : 'none';
    }, { passive:true });
  }

  /* ── Run after components are injected ── */
  document.addEventListener('components-loaded', function() {
    init();
    /* Re-wire popup triggers that are in the main page (not components) */
    document.querySelectorAll('.open-popup').forEach(function(btn) {
      if (!btn._popupWired) {
        btn._popupWired = true;
        btn.addEventListener('click', function() {
          var overlay = document.getElementById('contact-popup');
          if (overlay) {
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            var form = document.getElementById('popup-form');
            var success = document.getElementById('popup-success');
            if (form) form.style.display = '';
            if (success) success.style.display = 'none';
          }
        });
      }
    });
  });

  /* Fallback: also run on DOMContentLoaded in case components load fast */
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { init(); }, 100);
  });

})();
