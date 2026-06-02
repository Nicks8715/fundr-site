(function () {
  var inBlog = window.location.pathname.indexOf('/Blog/') !== -1;
  var base = inBlog ? '..' : '';

  function href(p) { return base + p; }

  var footerHTML = '<footer class="site-footer" aria-label="Site footer">' +
    '<div class="sf-inner">' +

      '<div class="sf-top">' +

        '<div class="sf-brand">' +
          '<a href="' + href('/index.html') + '" class="sf-logo">' +
            '<img src="' + href('/images/logo.png') + '" alt="fundr." style="height:26px;filter:brightness(0) invert(1)">' +
          '</a>' +
          '<p class="sf-desc">Fast, simple asset finance for Kiwi businesses. From trucks to equipment — we help you get the gear you need to grow, without the wait.</p>' +
          '<div class="sf-contact">' +
            '<a href="mailto:nick@fundr.co.nz" class="sf-contact-a">' +
              '<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' +
              'nick@fundr.co.nz' +
            '</a>' +
            '<a href="tel:0211023416" class="sf-contact-a">' +
              '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>' +
              '021 102 3416' +
            '</a>' +
          '</div>' +
          '<div class="sf-social">' +
            '<a href="https://instagram.com/fundr_nz/" class="sf-soc-btn" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>' +
            '<a href="https://www.facebook.com/fundrNewZealand" class="sf-soc-btn" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>' +
            '<a href="https://www.linkedin.com/company/fundrnz/" class="sf-soc-btn" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>' +
          '</div>' +
        '</div>' +

        '<div class="sf-col">' +
          '<h4>What We Finance</h4>' +
          '<ul>' +
            '<li><a href="' + href('/vehicle-finance.html') + '">Vehicle Finance</a></li>' +
            '<li><a href="' + href('/ute-finance.html') + '">Ute Finance</a></li>' +
            '<li><a href="' + href('/truck-finance.html') + '">Truck Finance</a></li>' +
            '<li><a href="' + href('/equipment-finance.html') + '">Equipment Finance</a></li>' +
            '<li><a href="' + href('/business-finance.html') + '">Business Finance</a></li>' +
          '</ul>' +
        '</div>' +

        '<div class="sf-col">' +
          '<h4>Company</h4>' +
          '<ul>' +
            '<li><a href="' + href('/about.html') + '">About</a></li>' +
            '<li><a href="' + href('/fundr-way.html') + '">The fundr Way</a></li>' +
            '<li><a href="' + href('/process.html') + '">Our Process</a></li>' +
            '<li><a href="' + href('/Blog/') + '">Blog</a></li>' +
            '<li><a href="' + href('/faq.html') + '">FAQ</a></li>' +
            '<li><a href="' + href('/referral-partners.html') + '">Referral Partners</a></li>' +
          '</ul>' +
        '</div>' +

        '<div class="sf-col">' +
          '<h4>Quick Actions</h4>' +
          '<ul>' +
            '<li><a href="' + href('/calculator.html') + '">Repayment Calculator</a></li>' +
            '<li><a href="' + href('/check-eligibility-full.html') + '">Apply Now</a></li>' +
            '<li><a href="' + href('/check-eligibility-full.html') + '">Check Eligibility</a></li>' +
          '</ul>' +
          '<div class="sf-trust">' +
            '<span>FSP Registered — FSP1007390</span>' +
            '<span>15+ Years Commercial Finance Experience</span>' +
            '<span>15+ NZ Lenders on Panel</span>' +
          '</div>' +
        '</div>' +

      '</div>' +

      '<div class="sf-geo">' +
        '<span class="sf-geo-label">We help across NZ</span>' +
        '<div class="sf-geo-tags">' +
          '<span>Auckland</span><span>Wellington</span><span>Christchurch</span>' +
          '<span>Hamilton</span><span>Tauranga</span><span>Dunedin</span>' +
          '<span>Palmerston North</span><span>Nelson</span><span>Rotorua</span>' +
          '<span>Nationwide Coverage</span>' +
        '</div>' +
      '</div>' +

      '<div class="sf-bottom">' +
        '<p>&copy; 2026 fundr Limited. FSP1007390. All rights reserved.</p>' +
        '<div class="sf-legal">' +
          '<a href="' + href('/privacy.html') + '">Privacy Policy</a>' +
          '<a href="' + href('/complaints.html') + '">Complaints Process</a>' +
          '<a href="' + href('/disclosure.html') + '">Disclosure Statement</a>' +
        '</div>' +
      '</div>' +

    '</div>' +
  '</footer>';

  var footerCSS = '<style>' +
    '.site-footer{background:#111110;padding:64px 48px 32px;font-family:\'Geist\',system-ui,sans-serif}' +
    '.sf-inner{max-width:1200px;margin:0 auto}' +
    '.sf-top{display:grid;grid-template-columns:260px 1fr 1fr 1fr;gap:56px;padding-bottom:48px;border-bottom:1px solid rgba(255,255,255,.07)}' +
    '.sf-logo{display:inline-block;margin-bottom:16px}' +
    '.sf-desc{font-size:.8rem;font-weight:300;color:rgba(255,255,255,.45);line-height:1.75;margin-bottom:24px}' +
    '.sf-contact{display:flex;flex-direction:column;gap:10px;margin-bottom:22px}' +
    '.sf-contact-a{font-size:.8rem;font-weight:300;color:rgba(255,255,255,.45);text-decoration:none;display:flex;align-items:center;gap:8px;transition:color .2s}' +
    '.sf-contact-a:hover{color:#fff}' +
    '.sf-contact-a svg{width:13px;height:13px;stroke:rgba(255,255,255,.3);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}' +
    '.sf-social{display:flex;gap:10px}' +
    '.sf-soc-btn{width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;transition:border-color .2s}' +
    '.sf-soc-btn:hover{border-color:rgba(255,255,255,.4)}' +
    '.sf-soc-btn svg{width:14px;height:14px;stroke:rgba(255,255,255,.45);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}' +
    '.sf-col h4{font-size:.63rem;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.28);font-weight:600;margin-bottom:16px}' +
    '.sf-col ul{list-style:none;padding:0;display:flex;flex-direction:column;gap:10px}' +
    '.sf-col a{font-size:.82rem;font-weight:300;color:rgba(255,255,255,.5);text-decoration:none;transition:color .2s}' +
    '.sf-col a:hover{color:#fff}' +
    '.sf-trust{margin-top:20px;display:flex;flex-direction:column;gap:8px}' +
    '.sf-trust span{font-size:.74rem;color:rgba(255,255,255,.28);display:flex;align-items:center;gap:7px;font-weight:300}' +
    '.sf-trust span::before{content:"";width:5px;height:5px;border-radius:50%;background:#e8650a;flex-shrink:0}' +
    '.sf-geo{padding:24px 0;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;gap:16px;flex-wrap:wrap}' +
    '.sf-geo-label{font-size:.63rem;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.22);font-weight:600;flex-shrink:0}' +
    '.sf-geo-tags{display:flex;flex-wrap:wrap;gap:8px}' +
    '.sf-geo-tags span{font-size:.74rem;color:rgba(255,255,255,.35);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:3px 12px}' +
    '.sf-bottom{padding-top:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}' +
    '.sf-bottom p{font-size:.74rem;color:rgba(255,255,255,.3);font-weight:300}' +
    '.sf-legal{display:flex;gap:22px}' +
    '.sf-legal a{font-size:.74rem;color:rgba(255,255,255,.3);text-decoration:none;transition:color .2s;font-weight:300}' +
    '.sf-legal a:hover{color:rgba(255,255,255,.65)}' +
    '@media(max-width:960px){.sf-top{grid-template-columns:1fr 1fr;gap:36px}}' +
    '@media(max-width:600px){.sf-top{grid-template-columns:1fr;gap:32px}.sf-bottom{flex-direction:column;text-align:center}.site-footer{padding:48px 24px 28px}}' +
  '</style>';

  /* Inject CSS once */
  if (!document.getElementById('sf-styles')) {
    var styleEl = document.createElement('div');
    styleEl.id = 'sf-styles';
    styleEl.innerHTML = footerCSS;
    document.head.appendChild(styleEl);
  }

  /* Inject footer */
  var target = document.getElementById('fundr-footer');
  if (target) {
    target.innerHTML = footerHTML;
  } else {
    document.body.insertAdjacentHTML('beforeend', footerHTML);
  }
})();
