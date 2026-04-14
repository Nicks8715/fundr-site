/*
  FUNDR NAV — nav.js
  Drop this file in your fundr-site root folder.
  Then add these two lines to every HTML page:

  In <head>:
    <link rel="stylesheet" href="/nav.css">

  Just after <body>:
    <div id="fundr-nav"></div>
    <script src="/nav.js"></script>

  That's it. The nav appears on every page automatically.
*/

(function () {

  /* ── Detect current page for active link highlighting ── */
  var path = window.location.pathname;

  function isActive(href) {
    if (href === '/index.html' || href === '/') {
      return path === '/' || path === '/index.html';
    }
    return path.indexOf(href.replace('.html', '')) !== -1;
  }

  var links = [
    { label: 'About', href: '/about.html' },
    { label: 'Process', href: '/process.html' },
    { label: 'Calculator', href: '/calculator.html' },
  ];

  var financeLinks = [
    { label: 'Vehicle Finance', sub: 'Cars, SUVs, vans & business vehicles', href: '/vehicle-finance.html', icon: 'vehicle' },
    { label: 'Ute Finance',     sub: 'Ranger, Hilux, D-Max & work utes',     href: '/ute-finance.html',     icon: 'ute' },
    { label: 'Truck Finance',   sub: 'Prime movers, tippers & fleets',        href: '/truck-finance.html',   icon: 'truck' },
    { label: 'Equipment Finance', sub: 'Construction, medical, hospitality',  href: '/equipment-finance.html', icon: 'equip' },
    { label: 'Business Finance',  sub: 'Working capital & business assets',   href: '/business-finance.html',  icon: 'biz' },
  ];

  var icons = {
    vehicle: '<svg viewBox="0 0 24 24"><rect x="1" y="11" width="22" height="7" rx="1"/><path d="M5 11V9a2 2 0 012-2h6l3 4"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
    ute:     '<svg viewBox="0 0 24 24"><rect x="1" y="11" width="22" height="7" rx="1"/><path d="M5 11V9a2 2 0 012-2h8l2 4"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
    truck:   '<svg viewBox="0 0 24 24"><rect x="1" y="9" width="15" height="10" rx="1"/><path d="M16 13h4l3 3v3h-7V13z"/><circle cx="5.5" cy="19" r="1.5"/><circle cx="18.5" cy="19" r="1.5"/></svg>',
    equip:   '<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    biz:     '<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>',
    phone:   '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>',
    email:   '<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    chevron: '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>',
  };

  /* ── Build dropdown items ── */
  var ddHTML = financeLinks.map(function (fl) {
    return '<a href="' + fl.href + '" class="fnd-dd-item">' +
      '<span class="fnd-dd-ico">' + icons[fl.icon] + '</span>' +
      '<span class="fnd-dd-txt">' +
        '<span class="fnd-dd-label">' + fl.label + '</span>' +
        '<span class="fnd-dd-sub">' + fl.sub + '</span>' +
      '</span>' +
    '</a>';
  }).join('');

  /* ── Build desktop links ── */
  var desktopLinks = links.map(function (l) {
    var active = isActive(l.href) ? ' fnd-active' : '';
    return '<a href="' + l.href + '" class="fnd-link' + active + '">' + l.label + '</a>';
  }).join('');

  /* ── Build mobile sub-links ── */
  var mobSub = financeLinks.map(function (fl) {
    return '<a href="' + fl.href + '" class="fnd-mob-sub-a">' + fl.label + '</a>';
  }).join('');

  /* ── Build mobile main links ── */
  var mobLinks = links.map(function (l) {
    return '<a href="' + l.href + '" class="fnd-mob-a">' + l.label + '</a>';
  }).join('');

  /* ── Full nav HTML ── */
  var html =
    '<nav class="fnd" id="fnd">' +
      '<a href="/index.html" class="fnd-logo">fundr.</a>' +

      '<div class="fnd-centre">' +
        '<div class="fnd-drop-wrap">' +
          '<button class="fnd-drop-btn" aria-haspopup="true" aria-expanded="false" id="fnd-drop-btn">' +
            'What We Finance' +
            '<span class="fnd-chev">' + icons.chevron + '</span>' +
          '</button>' +
          '<div class="fnd-dropdown" id="fnd-dropdown" role="menu">' +
            ddHTML +
          '</div>' +
        '</div>' +
        desktopLinks +
      '</div>' +

      '<a href="/apply.html" class="fnd-apply">Apply Now</a>' +
      '<button class="fnd-ham" id="fnd-ham" aria-label="Open menu" aria-expanded="false">' +
        '<span></span><span></span><span></span>' +
      '</button>' +
    '</nav>' +

    '<div class="fnd-overlay" id="fnd-overlay" aria-hidden="true"></div>' +

    '<aside class="fnd-panel" id="fnd-panel" aria-label="Mobile navigation" aria-hidden="true">' +
      '<div class="fnd-panel-top">' +
        '<a href="/index.html" class="fnd-panel-logo">fundr.</a>' +
        '<button class="fnd-close" id="fnd-close" aria-label="Close menu">' +
          '<span></span><span></span>' +
        '</button>' +
      '</div>' +

      '<div class="fnd-mob-section">' +
        '<div class="fnd-mob-label">What We Finance</div>' +
        '<div class="fnd-mob-sub">' + mobSub + '</div>' +
      '</div>' +

      '<div class="fnd-mob-main">' + mobLinks + '</div>' +

      '<a href="/apply.html" class="fnd-mob-apply">Apply Now →</a>' +

      '<div class="fnd-mob-contact">' +
        '<a href="tel:02110216">' + icons.phone + '021 102 3416</a>' +
        '<a href="mailto:nick@fundr.co.nz">' + icons.email + 'nick@fundr.co.nz</a>' +
      '</div>' +
    '</aside>';

  /* ── Inject into #fundr-nav ── */
  var target = document.getElementById('fundr-nav');
  if (target) {
    target.innerHTML = html;
    target.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:1000;';
  }

  /* ── Wire up interactions ── */
  var nav     = document.getElementById('fnd');
  var ham     = document.getElementById('fnd-ham');
  var panel   = document.getElementById('fnd-panel');
  var overlay = document.getElementById('fnd-overlay');
  var closeBtn = document.getElementById('fnd-close');
  var dropBtn  = document.getElementById('fnd-drop-btn');
  var dropdown = document.getElementById('fnd-dropdown');

  function openPanel() {
    panel.classList.add('fnd-open');
    overlay.classList.add('fnd-open');
    ham.classList.add('fnd-open');
    ham.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePanel() {
    panel.classList.remove('fnd-open');
    overlay.classList.remove('fnd-open');
    ham.classList.remove('fnd-open');
    ham.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (ham) ham.addEventListener('click', function () {
    panel.classList.contains('fnd-open') ? closePanel() : openPanel();
  });

  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  if (overlay) overlay.addEventListener('click', closePanel);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closePanel(); }
  });

  /* Scroll shadow */
  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('fnd-scrolled', window.scrollY > 10);
  }, { passive: true });

  /* Resize — close panel if going to desktop */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 960) closePanel();
  });

  /* Dropdown keyboard accessibility */
  if (dropBtn) {
    dropBtn.addEventListener('click', function () {
      var open = dropdown.classList.toggle('fnd-dd-open');
      dropBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!dropBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('fnd-dd-open');
        dropBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Push page body down by nav height */
  document.addEventListener('DOMContentLoaded', function () {
    var firstSection = document.querySelector('body > *:not(#fundr-nav):not(script):not(style)');
    if (firstSection && getComputedStyle(firstSection).position !== 'fixed') {
      // Already handled by nav.css padding-top on body
    }
  });

})();
