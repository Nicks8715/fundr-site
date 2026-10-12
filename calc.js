/* fundr calculator engine — one engine, many pages.
   Each page sets window.FUNDR_CALC = { key, defaults, mode } before this loads.
   Maths: standard annuity with optional balloon, in arrears or in advance. Nominal APR / periods per year. */
(function () {
  'use strict';

  var FREQ = { weekly: 52, fortnightly: 26, monthly: 12 };

  /* Payment per period. loan = amount financed, apr in %, years, balloon in $, freq key, advance bool */
  function payment(loan, apr, years, balloon, freq, advance) {
    var f = FREQ[freq] || 12;
    var n = Math.round(years * f);
    if (n <= 0 || loan <= 0) return { pmt: 0, n: n, f: f, total: 0, interest: 0 };
    var r = apr / 100 / f;
    var pmt;
    if (r === 0) {
      pmt = (loan - balloon) / n;
    } else {
      var v = Math.pow(1 + r, -n);
      pmt = (loan - balloon * v) * r / (1 - v);
      if (advance) pmt = pmt / (1 + r);
    }
    var total = pmt * n + balloon;
    return { pmt: pmt, n: n, f: f, total: total, interest: total - loan };
  }

  function money(x, dp) {
    if (!isFinite(x)) return '—';
    return '$' + x.toLocaleString('en-NZ', { minimumFractionDigits: dp || 0, maximumFractionDigits: dp || 0 });
  }
  function num(el, fallback) {
    if (!el) return fallback;
    var v = parseFloat(String(el.value).replace(/[$,\s]/g, ''));
    return isFinite(v) ? v : fallback;
  }
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  function init() {
    var cfg = window.FUNDR_CALC || {};
    var root = document.getElementById('calc-app');
    if (!root) return;
    var $ = function (id) { return document.getElementById(id); };
    var els = {
      price: $('c-price'), deposit: $('c-deposit'), term: $('c-term'), rate: $('c-rate'),
      balloon: $('c-balloon'), fee: $('c-fee'), freq: $('c-freq'), timing: $('c-timing')
    };
    var out = {
      pmt: $('o-pmt'), per: $('o-per'), loan: $('o-loan'), interest: $('o-interest'), total: $('o-total'),
      balloon: $('o-balloon'), price: $('o-price'), deposit: $('o-deposit'), depRow: $('o-deposit-row'), balRow: $('o-balloon-row'), cmpWith: $('o-cmp-with'), cmpWithout: $('o-cmp-without'),
      cmpSave: $('o-cmp-save'), cmpExtra: $('o-cmp-extra'), quote: $('o-quote')
    };
    var used = false;

    function read() {
      var price = clamp(num(els.price, 0), 0, 5e7);
      var deposit = clamp(num(els.deposit, 0), 0, price);
      var fee = els.fee ? clamp(num(els.fee, 0), 0, 1e5) : 0;
      var loan = Math.max(0, price - deposit) + fee;
      var balloonPct = els.balloon ? clamp(num(els.balloon, 0), 0, cfg.maxBalloon || 60) : 0;
      return {
        price: price, deposit: deposit, fee: fee, loan: loan,
        years: clamp(num(els.term, 60) / 12, 0.5, 30),
        apr: clamp(num(els.rate, 0), 0, 40),
        balloonPct: balloonPct,
        balloon: loan * balloonPct / 100,
        freq: els.freq ? els.freq.value : 'monthly',
        advance: els.timing ? els.timing.value === 'advance' : false
      };
    }

    function render() {
      var s = read();
      var a = payment(s.loan, s.apr, s.years, s.balloon, s.freq, s.advance);
      var label = { monthly: 'Est. Monthly Payment', fortnightly: 'Est. Fortnightly Payment', weekly: 'Est. Weekly Payment' }[s.freq] || 'Est. Monthly Payment';
      if (out.pmt) out.pmt.textContent = money(a.pmt, 0);
      if (out.per) out.per.textContent = label;
      if (out.loan) out.loan.textContent = money(s.loan);
      if (out.interest) out.interest.textContent = money(a.interest);
      if (out.total) out.total.textContent = money(a.total);
      if (out.balloon) out.balloon.textContent = money(s.balloon);
      if (out.price) out.price.textContent = money(s.price);
      if (out.deposit) out.deposit.textContent = money(s.deposit);
      if (out.depRow) out.depRow.style.display = s.deposit > 0 ? '' : 'none';
      if (out.balRow) out.balRow.style.display = s.balloon > 0 ? '' : 'none';

      if (out.cmpWith) {
        var b0 = payment(s.loan, s.apr, s.years, 0, s.freq, s.advance);
        out.cmpWith.textContent = money(a.pmt, 0);
        out.cmpWithout.textContent = money(b0.pmt, 0);
        out.cmpSave.textContent = money(Math.max(0, b0.pmt - a.pmt), 0);
        out.cmpExtra.textContent = money(Math.max(0, a.interest - b0.interest), 0);
      }
      if (out.quote) {
        var q = new URLSearchParams({
          src: 'calculator', type: cfg.key || 'vehicle', amount: Math.round(s.loan),
          term: String(s.years), balloon: String(Math.round(s.balloonPct))
        });
        out.quote.href = '/quick-quote.html?' + q.toString();
      }
      return s;
    }

    function track() {
      if (used) return; used = true;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'calculator_use', calculator_type: cfg.key || 'vehicle' });
    }

    Object.keys(els).forEach(function (k) {
      var el = els[k];
      if (!el) return;
      el.addEventListener('input', function () { track(); render(); });
      el.addEventListener('change', function () { track(); render(); });
    });
    if (out.quote) out.quote.addEventListener('click', function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'calculator_quote_click', calculator_type: cfg.key || 'vehicle' });
    });
    render();
  }

  window.FundrCalc = { payment: payment, money: money };
  if (typeof module !== 'undefined') module.exports = { payment: payment };
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  }
})();
