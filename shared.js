(function () {
  'use strict';

  /* ─────────────────────────────────────────
     COMPONENT LOADER
     Uses innerHTML so placeholders stay in DOM
     and listeners bind correctly after injection
  ───────────────────────────────────────── */
  function loadComponents(base) {
    base = base || '';
    var components = [
      { id: 'header-placeholder',  path: base + '/_components/header.html' },
      { id: 'footer-placeholder',  path: base + '/_components/footer.html' },
      { id: 'popup-placeholder',   path: base + '/_components/popup.html'  },
    ];

    var loaded = 0;
    var total  = components.length;

    components.forEach(function (comp) {
      var el = document.getElementById(comp.id);
      if (!el) { total--; return; }

      fetch(comp.path)
        .then(function (r) { return r.text(); })
        .then(function (html) {
          el.innerHTML = html;
          loaded++;
          if (loaded >= total) {
            init();           // wire everything AFTER all components are in DOM
          }
        })
        .catch(function () {
          loaded++;
          if (loaded >= total) { init(); }
        });
    });
  }

  /* ─────────────────────────────────────────
     INIT — called once all components loaded
  ───────────────────────────────────────── */
  function init() {
    setActiveNavLink();
    initDropdown();
    initMobileMenu();
    initPopup();
    initHeaderScroll();
    wireOpenPopup();
  }

  /* ─────────────────────────────────────────
     ACTIVE LINK
  ───────────────────────────────────────── */
  function setActiveNavLink() {
    var path = window.location.pathname.replace(/\/$/, '') || '/index';
    document.querySelectorAll('.nav-link, .mobile-link, .wwf-label').forEach(function (el) {
      var href = (el.getAttribute('href') || '');
      if (href && href !== '#' && href !== '/' && path.indexOf(href.replace('.html', '')) !== -1) {
        el.classList.add('active');
      }
    });
  }

  /* ─────────────────────────────────────────
     DROPDOWN
  ───────────────────────────────────────── */
  function initDropdown() {
    var item   = document.querySelector('.nav-item.has-dropdown');
    var menu   = document.querySelector('.dropdown-menu');
    var arrow  = document.querySelector('.wwf-arrow');

    if (!item || !menu || !arrow) return;

    function openDrop() {
      item.classList.add('open');
      arrow.setAttribute('aria-expanded', 'true');
    }
    function closeDrop() {
      item.classList.remove('open');
      arrow.setAttribute('aria-expanded', 'false');
    }
    function toggleDrop(e) {
      e.stopPropagation();
      item.classList.contains('open') ? closeDrop() : openDrop();
    }

    arrow.addEventListener('click', toggleDrop);

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!item.contains(e.target)) closeDrop();
    });

    // Keyboard: Escape closes
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrop();
    });
  }

  /* ─────────────────────────────────────────
     MOBILE MENU
  ───────────────────────────────────────── */
  function initMobileMenu() {
    var btn  = document.getElementById('hamburger-btn');
    var menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    function openMenu() {
      menu.classList.add('open');
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', function () {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ─────────────────────────────────────────
     POPUP
  ───────────────────────────────────────── */
  function initPopup() {
    var overlay  = document.getElementById('contact-popup');
    if (!overlay) return;

    var form      = document.getElementById('popup-form');
    var successEl = document.getElementById('popup-success');
    var closeBtn  = overlay.querySelector('.popup-close');

    function openPopup() {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (form)      form.style.display      = '';
      if (successEl) successEl.style.display = 'none';
    }
    function closePopup() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closePopup(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePopup(); });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var submitBtn = form.querySelector('.popup-submit');
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;

        fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        })
          .then(function (res) {
            if (res.ok) {
              form.style.display = 'none';
              if (successEl) successEl.style.display = 'flex';
            } else {
              submitBtn.textContent = 'GET MY OPTIONS →';
              submitBtn.disabled = false;
              alert('Something went wrong — please call Nick on 021 102 3416.');
            }
          })
          .catch(function () {
            submitBtn.textContent = 'GET MY OPTIONS →';
            submitBtn.disabled = false;
            alert('Connection error — please try again.');
          });
      });
    }
  }

  /* Wire page-level open-popup buttons (outside components) */
  function wireOpenPopup() {
    document.querySelectorAll('.open-popup').forEach(function (btn) {
      if (btn._wired) return;
      btn._wired = true;
      btn.addEventListener('click', function () {
        var overlay = document.getElementById('contact-popup');
        if (!overlay) return;
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        var form = document.getElementById('popup-form');
        var succ = document.getElementById('popup-success');
        if (form) form.style.display = '';
        if (succ) succ.style.display = 'none';
      });
    });
  }

  /* ─────────────────────────────────────────
     HEADER SCROLL SHADOW
  ───────────────────────────────────────── */
  function initHeaderScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 10
        ? '0 2px 20px rgba(22,20,15,.08)' : 'none';
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     BOOT — detect root vs /Blog/ and load
  ───────────────────────────────────────── */
  var inBlog = window.location.pathname.indexOf('/Blog/') !== -1;
  var base   = inBlog ? '..' : '';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { loadComponents(base); });
  } else {
    loadComponents(base);
  }

})();
