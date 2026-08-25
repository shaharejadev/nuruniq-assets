(function () {
  'use strict';

  /* ═════════ ১) সেটিংস ═════════ */
  var CFG = {
    productUrl:  /\/products\/[a-z0-9-]+/i,
    checkoutUrl: /\/(checkout|cart|order|orders|payment)(?:\/|$)/i,
    productLink: 'a[href*="/products/"]',
    cartText:    'add to cart',
    cardPlace:   'before',
    cardAlign:   'center'
  };

  var AUTO = {
    on:         true,
    opened:     Date.UTC(2026, 7, 15),
    startSold:  [8, 16],
    dailySales: [0.60, 2.20],

    /* বেশি review: সাধারণত sold-এর ২০–৩৫% */
    reviewRate: [0.20, 0.35],
    maxReviewRate: 0.35,

    rating: [4.9, 5.0]
  };

  var MARQUEE = {
    on:       true,
    place:    'afterRating',
    checkout: 'afterTotal',
    dir:      'left',
    pxPerSec: 45,
    gap:      26,
    accent:   '#ff5b00',
    tint:     '#fff8f4',
    line:     '#ffe0cc',

    items: [
      ['💵', 'ক্যাশ অন ডেলিভারি', 'পণ্য হাতে পেয়ে দেখে তারপর টাকা দিন'],
      ['🚚', 'দ্রুত ডেলিভারি', 'ঢাকায় ১–৩ দিন · সারা দেশে ২–৫ দিন'],
      ['🔄', '৭ দিনের রিপ্লেসমেন্ট', 'ভুল বা ত্রুটিপূর্ণ পণ্য হলে বদলে দেবো'],
      ['✅', 'অরিজিনাল পণ্যের নিশ্চয়তা', 'পছন্দ না হলে ফেরত দিন']
    ],

    checkoutItems: [
      ['💵', 'অর্ডার করতে টাকা লাগবে না', 'পণ্য হাতে পেয়ে টাকা দিন'],
      ['🔒', 'আপনার তথ্য নিরাপদ', 'কারো সাথে শেয়ার করা হয় না'],
      ['📞', 'কনফার্মেশন কল', 'অর্ডারের পর আমরা ফোন করে নিশ্চিত করব']
    ],

    totalLabels: ['total', 'মোট', 'সর্বমোট']
  };

  var PRICE = {
    on:       true,
    color:    'rgb(255, 91, 0)',
    detail:   [28, 32],
    card:     [18, 20],
    oldColor: '#9ca3af',
    mobile:   [28, 18]
  };

  /* বাস্তব ডেটা থাকলে এখানে দিন */
  var PRODUCTS = {
    // "kitchen-foam-cleaner-spray-500ml": { rating: 4.8, reviews: 25, sold: 80 }
  };

  /* ═════════ ২) স্টাইল ═════════ */
  var CSS =
    '.rt{display:flex;align-items:center;gap:6px;flex-wrap:wrap;line-height:1;font-family:inherit}' +
    '.rt--detail{font-size:18px;margin:2px 0 12px;min-height:24px}' +
    '.rt--card{font-size:14px;margin:6px 0 10px;min-height:18px;justify-content:' + CFG.cardAlign + '}' +
    '.rt--detail + div{margin-top:8px}' +
    '.rt__sold{color:#2563eb;font-weight:800}' +
    '.rt__sold::after{content:"|";margin-left:6px;color:#bbb;font-weight:400}' +
    '.rt__stars{position:relative;display:inline-block;white-space:nowrap;color:#d9d9d9;font-size:1.15em;letter-spacing:0}' +
    '.rt--detail .rt__stars{font-size:1.35em}' +
    '.rt__stars::before{content:"\\2605\\2605\\2605\\2605\\2605"}' +
    '.rt__stars::after{content:"\\2605\\2605\\2605\\2605\\2605";position:absolute;top:0;left:0;width:var(--pct,0%);overflow:hidden;color:#f5a623}' +
    '.rt__num{color:#555;font-weight:700;white-space:nowrap}' +
    '.rt__rev{margin-left:4px;font-size:.85em;font-weight:400}' +

    '.rtm{position:relative;margin:12px 0 2px;padding:9px 0;border-radius:12px;border:1px solid ' + MARQUEE.line + ';background:' + MARQUEE.tint + ';overflow:hidden}' +
    '.rt--detail + .rtm{margin-top:12px}' +
    '.rtm--ck{margin:14px 0 0}' +
    '.rtm__w{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 7%,#000 93%,transparent 100%);mask-image:linear-gradient(90deg,transparent 0,#000 7%,#000 93%,transparent 100%)}' +
    '.rtm__track{display:flex;align-items:center;width:max-content;will-change:transform;animation:' + (MARQUEE.dir === 'right' ? 'rtm-r' : 'rtm-l') + ' 30s linear infinite}' +
    '@keyframes rtm-l{from{transform:translate3d(0,0,0)}to{transform:translate3d(calc(-1 * var(--w,0px)),0,0)}}' +
    '@keyframes rtm-r{from{transform:translate3d(calc(-1 * var(--w,0px)),0,0)}to{transform:translate3d(0,0,0)}}' +
    '.rtm:hover .rtm__track{animation-play-state:paused}' +
    '.rtm__i{display:inline-flex;align-items:center;gap:8px;white-space:nowrap;font-size:13.5px;line-height:1.6;color:#374151}' +
    '.rtm__e{font-size:15px;line-height:1}' +
    '.rtm__t{font-weight:700;color:#111827}' +
    '.rtm__s{color:#6b7280}' +
    '.rtm__s::before{content:"\\00B7";margin:0 7px;color:#d1d5db;font-weight:700}' +
    '.rtm__d{flex:0 0 auto;width:5px;height:5px;border-radius:50%;background:' + MARQUEE.accent + ';opacity:.55;margin:0 ' + MARQUEE.gap + 'px}' +

    '.rtp{color:' + PRICE.color + '!important;font-weight:800!important;line-height:1.2!important}' +
    '.rtp--now{font-size:clamp(' + PRICE.detail[0] + 'px,2.6vw,' + PRICE.detail[1] + 'px)!important}' +
    '.rtp--card{font-size:clamp(' + PRICE.card[0] + 'px,2.2vw,' + PRICE.card[1] + 'px)!important}' +
    '.rtp--old{color:' + PRICE.oldColor + '!important;font-weight:500!important;font-size:clamp(15px,1.5vw,19px)!important}' +
    '.rt-total{font-size:clamp(22px,2.8vw,28px)!important;color:' + PRICE.color + '!important;font-weight:800!important;line-height:1.2!important}' +

    '@media(max-width:768px){' +
      '.rt--detail{font-size:16px;margin:3px 0 10px}.rt--card{font-size:13px}' +
      '.rtm{padding:8px 0;border-radius:10px}' +
      '.rtm__i{font-size:12.5px}.rtm__e{font-size:14px}' +
      '.rtm__d{margin:0 ' + Math.round(MARQUEE.gap * 0.7) + 'px}' +
      '.rtp--now{font-size:' + PRICE.mobile[0] + 'px!important}' +
      '.rtp--card{font-size:' + PRICE.mobile[1] + 'px!important}' +
      '.rtp--old{font-size:14px!important}}' +
    '@media(prefers-reduced-motion:reduce){.rtm__track{animation:none}.rtm__w{overflow-x:auto}}';

  function injectCSS(){
    if (document.getElementById('rt-style')) return;
    var s = document.createElement('style');
    s.id = 'rt-style';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /* ═════════ ৩) ইঞ্জিন ═════════ */
  var seen = new WeakSet(), cache = {}, queued = false, mqSet = '', mqResize = false;
  var DEBUG = /[?&]rtdebug/.test(location.search);

  function log(){ if (DEBUG) console.log.apply(console, ['[rt]'].concat([].slice.call(arguments))); }

  function enc(s){
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function norm(s){ return (s || '').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function isProduct(){ return CFG.productUrl.test(location.pathname); }
  function isCheckout(){ return !isProduct() && CFG.checkoutUrl.test(location.pathname); }

  function slug(u){
    try {
      var p = new URL(u || '', location.origin).pathname.replace(/\/+$/, '');
      return p.split('/').pop().toLowerCase();
    } catch (e) { return ''; }
  }

  function hash(s){
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    return h >>> 0;
  }

  function rng(seed){
    return function(){
      seed = (seed + 0x6D2B79F5) >>> 0;
      var t = Math.imul(seed ^ (seed >>> 15), seed | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function auto(seed, listedAt){
    var ck = seed + '|' + listedAt + '|' + AUTO.opened;
    if (cache[ck]) return cache[ck];

    var r = rng(hash(seed));
    var f = function(a){ return a[0] + r() * (a[1] - a[0]); };

    var age  = Math.max(0, (Date.now() - AUTO.opened) / 864e5);
    var off  = r() * age * 0.35;
    var live = listedAt
      ? Math.max(0, (Date.now() - listedAt) / 864e5)
      : Math.max(0, age - off);

    var sold = Math.max(
      1,
      Math.round(f(AUTO.startSold)) + Math.round(live * f(AUTO.dailySales))
    );

    /* বেশি review; কিন্তু sold-এর বেশি নয় */
    var reviews = Math.round(sold * f(AUTO.reviewRate));
    var cap = sold <= 5
      ? Math.min(2, sold)
      : Math.max(2, Math.round(sold * AUTO.maxReviewRate));

    reviews = Math.max(0, Math.min(reviews, sold, cap));

    var rating = Math.round(f(AUTO.rating) * 10) / 10;
    if (reviews >= 15 && rating > 4.9) rating = 4.9;
    if (reviews >= 40 && rating > 4.8) rating = 4.8;

    return (cache[ck] = {
      rating: rating,
      reviews: reviews,
      sold: sold
    });
  }

  function resolve(el, name, href){
    var ds = (el && el.dataset) || {};

    if (ds.rating){
      return {
        rating: Math.max(0, Math.min(5, +ds.rating)),
        reviews: Math.max(0, +(ds.reviews || 0)),
        sold: Math.max(0, +(ds.sold || 0))
      };
    }

    var nk = norm(ds.product || name), sk = slug(href);
    var m = PRODUCTS[sk] || PRODUCTS[nk];
    if (m) return m;

    var seed = sk || nk;
    if (!AUTO.on || !seed) return null;

    var p = ds.published ? Date.parse(ds.published) : NaN;
    return auto(seed, isNaN(p) ? 0 : p);
  }

  function markup(d, detail){
    var r = (+d.rating).toFixed(1);
    var pct = Math.max(0, Math.min(5, +d.rating)) / 5 * 100;
    var reviewText = d.reviews === 1 ? 'Review' : 'Reviews';

    return '<div class="rt ' + (detail ? 'rt--detail' : 'rt--card') +
      '" role="img" aria-label="' + r + ' out of 5, ' + d.reviews +
      ' ' + reviewText + ', ' + d.sold + ' sold">' +
      '<span class="rt__sold">' + d.sold + ' sold</span>' +
      '<span class="rt__stars" style="--pct:' + pct.toFixed(2) + '%"></span>' +
      '<span class="rt__num">' + r +
      '<span class="rt__rev">[' + d.reviews + ' ' + reviewText + ']</span></span></div>';
  }

  function isOurs(n){
    if (!n || !n.classList) return false;
    return n.classList.contains('rt') || n.classList.contains('rtm');
  }

  function addDetail(){
    if (!isProduct()) return;
    var h1 = document.querySelector('h1');
    if (!h1) return;

    var nx = h1.nextElementSibling;
    if (nx && nx.classList.contains('rt')) return;

    var d = resolve(h1, h1.textContent, location.pathname);
    if (d) h1.insertAdjacentHTML('afterend', markup(d, true));
  }

  function priceBox(){
    var h1 = document.querySelector('h1');
    if (!h1) return null;

    var n = h1.nextElementSibling, i = 0;
    while (n && i++ < 5){
      if (!isOurs(n) && /৳/.test(n.textContent || '')) return n;
      n = n.nextElementSibling;
    }
    return null;
  }

  function totalRow(){
    var labels = MARQUEE.totalLabels || ['total'];
    var els = document.querySelectorAll('div,li,tr,p');

    for (var i = els.length - 1; i >= 0; i--){
      var e = els[i];
      if (e.children.length < 2) continue;

      var f = e.firstElementChild;
      if (!f) continue;
      if (labels.indexOf(norm(f.textContent)) === -1) continue;
      if (!/৳|\d/.test(e.textContent || '')) continue;

      return e;
    }
    return null;
  }

  function styleCheckoutTotal(){
    if (!isCheckout()) return;
    var row = totalRow();
    if (!row) return;

    var labelEl = row.firstElementChild;
    var valueEl = row.lastElementChild;
    if (labelEl) labelEl.classList.add('rt-total');
    if (valueEl) valueEl.classList.add('rt-total');
  }

  function tuneMarquee(){
    var box = document.querySelector('.rtm');
    var t = box && box.querySelector('.rtm__track');
    if (!t || !mqSet) return;

    var copies = +(t.getAttribute('data-c') || 2);
    var setW = t.scrollWidth / copies;
    if (!setW) return;

    var need = Math.max(2, Math.ceil(box.clientWidth / setW) + 1);
    while (copies < need){
      t.insertAdjacentHTML('beforeend', mqSet);
      copies++;
    }

    t.setAttribute('data-c', copies);
    t.style.setProperty('--w', Math.round(setW) + 'px');
    t.style.animationDuration = Math.max(6, setW / (MARQUEE.pxPerSec || 45)).toFixed(2) + 's';
  }

  function addMarquee(){
    if (!MARQUEE.on || document.querySelector('.rtm')) return;

    var ck = isCheckout(), anchor = null, how = 'afterend', extra = '', items;

    if (ck){
      if (!MARQUEE.checkout) return;
      var row = totalRow();
      if (!row) return;

      extra = ' rtm--ck';
      if (MARQUEE.checkout === 'beforeSummary'){
        anchor = row.parentElement;
        how = 'beforebegin';
      } else if (MARQUEE.checkout === 'afterSummary'){
        anchor = row.parentElement;
        how = 'afterend';
      } else {
        anchor = row;
        how = 'afterend';
      }

      items = MARQUEE.checkoutItems && MARQUEE.checkoutItems.length
        ? MARQUEE.checkoutItems
        : MARQUEE.items;
    } else {
      if (!isProduct() || !MARQUEE.place) return;

      anchor = document.querySelector('.rt--detail') || document.querySelector('h1');
      if (MARQUEE.place === 'afterPrice'){
        var b = priceBox();
        if (b) anchor = b;
      }
      items = MARQUEE.items;
    }

    if (!anchor || !items || !items.length) return;

    var label = [], i, it;
    mqSet = '';

    for (i = 0; i < items.length; i++){
      it = items[i];
      mqSet += '<span class="rtm__i">' +
        '<span class="rtm__e">' + enc(it[0]) + '</span>' +
        '<span class="rtm__t">' + enc(it[1]) + '</span>' +
        (it[2] ? '<span class="rtm__s">' + enc(it[2]) + '</span>' : '') +
        '</span><span class="rtm__d"></span>';
      label.push(it[1] + (it[2] ? ' — ' + it[2] : ''));
    }

    anchor.insertAdjacentHTML(how,
      '<div class="rtm' + extra + '" role="img" aria-label="' + enc(label.join(' | ')) + '">' +
        '<div class="rtm__w"><div class="rtm__track" data-c="2">' +
          mqSet + mqSet +
        '</div></div>' +
      '</div>'
    );

    tuneMarquee();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(tuneMarquee);

    if (!mqResize){
      mqResize = true;
      addEventListener('resize', tuneMarquee);
    }
  }

  var PRICE_RE = /^৳\s*[\d,]+(?:\.\d+)?$/;

  function priceIn(root, kind){
    if (!PRICE.on || !root) return;
    var els = root.querySelectorAll('span,p,div,strong,b');

    for (var i = 0; i < els.length; i++){
      var e = els[i];
      if (e.children.length) continue;
      if (e.getAttribute('data-rtp')) continue;
      if (!PRICE_RE.test((e.textContent || '').trim())) continue;

      e.setAttribute('data-rtp', '1');

      var strike = ((e.className || '') + '').indexOf('line-through') !== -1;
      if (!strike){
        try {
          strike = getComputedStyle(e).textDecorationLine.indexOf('line-through') !== -1;
        } catch (x) {}
      }

      if (strike) e.classList.add('rtp--old');
      else {
        e.classList.add('rtp');
        e.classList.add(kind === 'card' ? 'rtp--card' : 'rtp--now');
      }
    }
  }

  function stylePrices(){
    if (!PRICE.on || isCheckout()) return;
    if (isProduct()) priceIn(priceBox(), 'detail');

    var links = document.querySelectorAll(CFG.productLink);
    for (var i = 0; i < links.length; i++) priceIn(links[i], 'card');
  }

  function findCard(btn){
    var el = btn.parentElement, i = 0;

    while (el && el !== document.body && i++ < 8){
      var link = el.querySelector(CFG.productLink);
      if (link) return { card: el, link: link };
      el = el.parentElement;
    }
    return null;
  }

  function cardTitle(card, link){
    var t = card.querySelector('h2,h3,h4,.product-title,[class*="title"]');
    if (t && t.textContent.trim()) return t.textContent;
    return link ? link.textContent : '';
  }

  function addCards(){
    if (isCheckout()) return;

    var els = document.querySelectorAll('button,a');
    for (var i = 0; i < els.length; i++){
      var b = els[i];
      if (seen.has(b)) continue;
      if ((b.textContent || '').trim().toLowerCase().indexOf(CFG.cartText) === -1) continue;

      var hit = findCard(b);
      if (!hit) continue;

      seen.add(b);
      if (hit.card.querySelector('h1,.rt--detail,.rt--card')) continue;

      var href = hit.link.getAttribute('href');
      var d = resolve(hit.card, cardTitle(hit.card, hit.link), href);
      if (!d) continue;

      b.insertAdjacentHTML(
        CFG.cardPlace === 'after' ? 'afterend' : 'beforebegin',
        markup(d, false)
      );
    }
  }

  function run(){
    injectCSS();
    addDetail();
    addMarquee();
    addCards();
    stylePrices();
    styleCheckoutTotal();
  }

  function schedule(){
    if (queued) return;
    queued = true;
    requestAnimationFrame(function(){
      queued = false;
      run();
    });
  }

  function start(){
    run();

    new MutationObserver(function(recs){
      for (var i = 0; i < recs.length; i++){
        var a = recs[i].addedNodes;
        for (var j = 0; j < a.length; j++){
          var n = a[j];
          if (n.nodeType === 1 && !isOurs(n)){
            schedule();
            return;
          }
        }
      }
    }).observe(document.body, { childList: true, subtree: true });

    ['pushState', 'replaceState'].forEach(function(m){
      var o = history[m];
      history[m] = function(){
        var r = o.apply(this, arguments);
        schedule();
        return r;
      };
    });

    addEventListener('popstate', schedule);
  }

  window.rtPreview = function(s){ return auto(s, 0); };

  window.rtAudit = function(){
    var out = [], links = document.querySelectorAll(CFG.productLink);

    for (var i = 0; i < links.length; i++){
      var s = slug(links[i].getAttribute('href'));
      if (!s) continue;

      var dup = false;
      for (var k = 0; k < out.length; k++){
        if (out[k].slug === s) dup = true;
      }
      if (dup) continue;

      var d = auto(s, 0);
      out.push({ slug: s, sold: d.sold, reviews: d.reviews, rating: d.rating });
    }

    console.table(out);
    return out;
  };

  window.rtForecast = function(daysAhead){
    var real = AUTO.opened;
    AUTO.opened = real - (daysAhead || 0) * 864e5;
    cache = {};
    var result = window.rtAudit();
    AUTO.opened = real;
    cache = {};
    return result;
  };

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', start)
    : start();
})();
