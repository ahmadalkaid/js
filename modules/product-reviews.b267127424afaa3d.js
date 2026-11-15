/* Alshiaka module: product-reviews */
window.__SHEYAKA_CONFIGS__ = window.__SHEYAKA_CONFIGS__ || {};
window.__SHEYAKA_CONFIGS__["product-reviews"] = {
  "i18n": {
    "title": {
      "ar": "التقييمات",
      "en": "Reviews"
    },
    "seeAll": {
      "ar": "عرض الكل {{count}}",
      "en": "See all {{count}}"
    },
    "reviews": {
      "ar": "{{count}} تقييم",
      "en": "{{count}} reviews"
    },
    "reviewOne": {
      "ar": "تقييم واحد",
      "en": "1 review"
    },
    "reviewTwo": {
      "ar": "تقييمان",
      "en": "2 reviews"
    },
    "reviewFew": {
      "ar": "{{count}} تقييمات",
      "en": "{{count}} reviews"
    },
    "reviewMany": {
      "ar": "{{count}} تقييماً",
      "en": "{{count}} reviews"
    },
    "write": {
      "ar": "اكتب تقييماً",
      "en": "Write a review"
    },
    "placeholder": {
      "ar": "شاركنا رأيك في المقاس والجودة",
      "en": "Tell us about the fit and the quality"
    },
    "empty": {
      "ar": "لا توجد تقييمات بعد. كن أول من يشارك تجربته.",
      "en": "No reviews yet. Be the first to share how it went."
    },
    "verified": {
      "ar": "موثّق",
      "en": "Verified"
    },
    "outOf": {
      "ar": "{{rating}} من 5",
      "en": "{{rating}} out of 5"
    },
    "bought": {
      "ar": "اشترى {{options}}",
      "en": "Bought {{options}}"
    },
    "allTitle": {
      "ar": "كل التقييمات",
      "en": "All reviews"
    },
    "formTitle": {
      "ar": "اكتب تقييماً",
      "en": "Write a review"
    },
    "close": {
      "ar": "إغلاق",
      "en": "Close"
    },
    "loadMore": {
      "ar": "عرض المزيد",
      "en": "Show more"
    },
    "loading": {
      "ar": "جارٍ تحميل التقييمات",
      "en": "Loading reviews"
    },
    "sent": {
      "ar": "وصلنا كلامك. يظهر هنا بعد المراجعة.",
      "en": "Received. It shows here after review."
    },
    "storeReply": {
      "ar": "رد المتجر",
      "en": "Store reply"
    },
    "photo": {
      "ar": "صورة من التقييم",
      "en": "Photo from the review"
    },
    "guest": {
      "ar": "زائر",
      "en": "Guest"
    },
    "pending": {
      "ar": "بانتظار المراجعة",
      "en": "Awaiting review"
    }
  }
};
/**
 * Sheyaka — product reviews laid out like the storefront design,
 * fed by Salla's rating summary and product comments.
 */
(function () {
  'use strict';

  if (window.__sheyakaProductReviews) return;
  window.__sheyakaProductReviews = true;

  var CONFIG = {
    i18n: {
      title: { ar: 'التقييمات', en: 'Reviews' },
      seeAll: { ar: 'عرض الكل {{count}}', en: 'See all {{count}}' },
      reviews: { ar: '{{count}} تقييم', en: '{{count}} reviews' },
      reviewOne: { ar: 'تقييم واحد', en: '1 review' },
      reviewTwo: { ar: 'تقييمان', en: '2 reviews' },
      reviewFew: { ar: '{{count}} تقييمات', en: '{{count}} reviews' },
      reviewMany: { ar: '{{count}} تقييماً', en: '{{count}} reviews' },
      write: { ar: 'اكتب تقييماً', en: 'Write a review' },
      placeholder: { ar: 'شاركنا رأيك في المقاس والجودة', en: 'Tell us about the fit and the quality' },
      empty: {
        ar: 'لا توجد تقييمات بعد. كن أول من يشارك تجربته.',
        en: 'No reviews yet. Be the first to share how it went.',
      },
      verified: { ar: 'موثّق', en: 'Verified' },
      outOf: { ar: '{{rating}} من 5', en: '{{rating}} out of 5' },
      bought: { ar: 'اشترى {{options}}', en: 'Bought {{options}}' },
      allTitle: { ar: 'كل التقييمات', en: 'All reviews' },
      formTitle: { ar: 'اكتب تقييماً', en: 'Write a review' },
      close: { ar: 'إغلاق', en: 'Close' },
      loadMore: { ar: 'عرض المزيد', en: 'Show more' },
      loading: { ar: 'جارٍ تحميل التقييمات', en: 'Loading reviews' },
      sent: { ar: 'وصلنا كلامك. يظهر هنا بعد المراجعة.', en: 'Received. It shows here after review.' },
      storeReply: { ar: 'رد المتجر', en: 'Store reply' },
      photo: { ar: 'صورة من التقييم', en: 'Photo from the review' },
      guest: { ar: 'زائر', en: 'Guest' },
      pending: { ar: 'بانتظار المراجعة', en: 'Awaiting review' },
    },
  };

  function applySheyakaConfig(config, slug) {
    var bag = window.__SHEYAKA_CONFIGS__;
    var remote = bag && bag[slug];
    if (!remote || typeof remote !== 'object' || Array.isArray(remote)) return;
    Object.keys(remote).forEach(function (key) {
      if (key === 'i18n' && remote.i18n && typeof remote.i18n === 'object' && !Array.isArray(remote.i18n)) {
        config.i18n = config.i18n || {};
        Object.keys(remote.i18n).forEach(function (name) {
          config.i18n[name] = remote.i18n[name];
        });
        return;
      }
      config[key] = remote[key];
    });
  }
  applySheyakaConfig(CONFIG, 'product-reviews');

  var STYLE_ID = 'sheyaka-product-reviews-style';
  var STAR_PATH = 'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z';
  var PLACEHOLDER_RE = /placeholder\.(png|jpe?g|webp|svg)|default-avatar|avatar-placeholder/i;
  var state = {
    productId: '',
    summary: null,
    comments: [],
    page: 1,
    total: 0,
    totalPages: 1,
    notice: '',
    loadingMore: false,
  };
  var ui = {};
  var inflight = '';

  function detectLang() {
    var html = document.documentElement;
    var body = document.body;
    var lang = html.getAttribute('lang') || (body && body.getAttribute('lang')) || '';
    if (/^ar/i.test(lang)) return 'ar';
    if (/^en/i.test(lang)) return 'en';
    var dir = html.getAttribute('dir') || (body && body.getAttribute('dir')) || '';
    return dir.toLowerCase() === 'ltr' ? 'en' : 'ar';
  }

  var LANG = detectLang();

  function t(value, vars) {
    var text = '';
    if (value && typeof value === 'object') text = value[LANG] || value.ar || value.en || '';
    else text = value || '';
    if (vars) {
      Object.keys(vars).forEach(function (key) {
        text = text.replace(new RegExp('\\{\\{' + key + '\\}\\}', 'g'), vars[key]);
      });
    }
    return text;
  }

  function refreshLang() {
    LANG = detectLang();
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function svg(path, className) {
    var node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    node.setAttribute('viewBox', '0 0 24 24');
    node.setAttribute('aria-hidden', 'true');
    if (className) node.setAttribute('class', className);
    var shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    shape.setAttribute('d', path);
    node.appendChild(shape);
    return node;
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.sk-rv, .sk-rv *, .sk-rv-dialog, .sk-rv-dialog * { box-sizing: border-box; }',
      '.sk-rv-on salla-comments { display: none !important; }',
      '.sk-rv { container-type: inline-size; color: #17161A; font-family: inherit; margin: 28px 0 8px; }',
      '.sk-rv-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin: 0 0 18px; }',
      '.sk-rv-title { margin: 0; font-size: 22px; line-height: 1.2; font-weight: 800; letter-spacing: -0.02em; color: #17161A; }',
      '.sk-rv-all, .sk-rv-more { border: 0; background: none; padding: 0; color: #8A847C; font: inherit; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }',
      '.sk-rv-all:hover, .sk-rv-more:hover { color: #17161A; }',
      '.sk-rv-chev::before { content: "›"; }',
      '[dir="rtl"] .sk-rv-chev::before { content: "‹"; }',
      '.sk-rv-summary { display: flex; align-items: center; justify-content: space-between; gap: 28px; margin-bottom: 16px; }',
      '.sk-rv-score { min-width: 108px; }',
      '.sk-rv-avg { margin: 0; font-size: 56px; line-height: 0.9; font-weight: 700; letter-spacing: -0.045em; font-variant-numeric: tabular-nums; }',
      '.sk-rv-stars { display: inline-flex; align-items: center; gap: 2px; margin-top: 8px; }',
      '.sk-rv-star { position: relative; width: 16px; height: 16px; display: inline-block; }',
      '.sk-rv-star svg { position: absolute; inset: 0; width: 16px; height: 16px; }',
      '.sk-rv-star .is-empty { fill: #D8D4CC; }',
      '.sk-rv-star .is-fill { fill: #17161A; clip-path: inset(0 calc((1 - var(--fill, 0)) * 100%) 0 0); }',
      '[dir="rtl"] .sk-rv-star .is-fill { clip-path: inset(0 0 0 calc((1 - var(--fill, 0)) * 100%)); }',
      '.sk-rv-count { margin: 6px 0 0; color: #8A847C; font-size: 13px; }',
      '.sk-rv-bars { flex: 1 1 160px; min-width: 0; display: flex; flex-direction: column; gap: 7px; }',
      '.sk-rv-bar { display: grid; grid-template-columns: 14px minmax(0, 1fr) 42px; align-items: center; gap: 8px; }',
      '.sk-rv-bar-n, .sk-rv-pct { font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; }',
      '.sk-rv-pct { text-align: end; color: #17161A; }',
      '.sk-rv-track { display: block; height: 6px; border-radius: 99px; background: #EFEDE8; overflow: hidden; }',
      '.sk-rv-fill { display: block; height: 100%; border-radius: inherit; background: #17161A; }',
      '.sk-rv-fit { background: #F6F4EF; border-radius: 18px; padding: 16px 16px 14px; margin-bottom: 16px; }',
      '.sk-rv-fit-row + .sk-rv-fit-row { margin-top: 16px; padding-top: 16px; border-top: 1px solid #E7E2D8; }',
      '.sk-rv-kicker { margin: 0 0 14px; color: #8A847C; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }',
      '.sk-rv-fit-track { position: relative; height: 2px; background: #DDD8CE; border-radius: 99px; margin: 10px 8px 0; }',
      '.sk-rv-fit-dot { position: absolute; top: 50%; left: 0; width: 14px; height: 14px; border-radius: 50%; background: #17161A; transform: translate(-50%, -50%); }',
      '.sk-rv-fit-labels { display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; margin-top: 12px; font-size: 13px; color: #8A847C; }',
      '.sk-rv-fit-labels span:nth-child(1) { text-align: start; }',
      '.sk-rv-fit-labels span:nth-child(2) { text-align: center; font-weight: 800; color: #17161A; }',
      '.sk-rv-fit-labels span:nth-child(3) { text-align: end; }',
      '.sk-rv-fit-labels .is-on { font-weight: 800; color: #17161A; }',
      '.sk-rv-write { width: 100%; min-height: 54px; margin: 0 0 16px; border: 1.5px solid #17161A; border-radius: 16px; background: #fff; color: #17161A; font: inherit; font-size: 16px; font-weight: 800; cursor: pointer; }',
      '.sk-rv-write:hover { background: #17161A; color: #fff; }',
      '.sk-rv-notice { margin: 0 0 12px; color: #1B7F4A; font-size: 14px; font-weight: 600; }',
      '.sk-rv-empty { margin: 0 0 16px; color: #8A847C; font-size: 14px; line-height: 1.5; }',
      '.sk-rv-scroller { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; padding-bottom: 4px; overscroll-behavior-x: contain; -webkit-overflow-scrolling: touch; touch-action: pan-x pan-y; cursor: grab; }',
      '.sk-rv-scroller::-webkit-scrollbar { display: none; }',
      '.sk-rv-scroller .sk-rv-card { cursor: grab; }',
      '.sk-rv-scroller button, .sk-rv-scroller a { cursor: pointer; }',
      '.sk-rv-scroller.is-dragging, .sk-rv-scroller.is-dragging .sk-rv-card { cursor: grabbing; scroll-snap-type: none; user-select: none; }',
      '.sk-rv-scroller.is-dragging img { pointer-events: none; }',
      '.sk-rv-scroller:focus-visible { outline: 2px solid #17161A; outline-offset: 4px; border-radius: 8px; }',
      '.sk-rv-card { flex: 0 0 min(340px, 82%); width: min(340px, 82%); scroll-snap-align: start; display: flex; flex-direction: column; gap: 10px; min-height: 180px; padding: 16px; border: 1px solid #E6E2DA; border-radius: 18px; background: #fff; }',
      '.sk-rv-meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; }',
      '.sk-rv-meta .sk-rv-stars { margin-top: 0; }',
      '.sk-rv-time, .sk-rv-pending { color: #8A847C; font-size: 13px; white-space: nowrap; }',
      '.sk-rv-text { margin: 0; font-size: 15px; line-height: 1.45; font-weight: 500; color: #17161A; }',
      '.sk-rv-card.is-compact .sk-rv-text { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }',
      '.sk-rv-photos { display: flex; gap: 8px; }',
      '.sk-rv-photo { width: 64px; height: 64px; padding: 0; border: 0; border-radius: 10px; overflow: hidden; background: #F3F0EA; cursor: pointer; }',
      '.sk-rv-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }',
      '.sk-rv-person { display: flex; align-items: center; gap: 10px; margin-top: auto; padding-top: 4px; }',
      '.sk-rv-avatar { width: 32px; height: 32px; border-radius: 50%; background: #E7E4DE; color: #6F6A64; display: inline-flex; align-items: center; justify-content: center; overflow: hidden; flex: 0 0 auto; font-size: 13px; font-weight: 700; }',
      '.sk-rv-avatar img { width: 100%; height: 100%; object-fit: cover; }',
      '.sk-rv-who { min-width: 0; display: flex; flex-direction: column; gap: 2px; }',
      '.sk-rv-name { font-size: 14px; font-weight: 800; display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }',
      '.sk-rv-verified { color: #1B7F4A; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 3px; }',
      '.sk-rv-verified svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2.4; }',
      '.sk-rv-bought { color: #8A847C; font-size: 12px; }',
      '.sk-rv-reply { margin: 0; padding-top: 8px; border-top: 1px solid #F0ECE6; color: #4E4A46; font-size: 13px; line-height: 1.45; }',
      '.sk-rv-reply b { display: block; margin-bottom: 2px; color: #17161A; font-size: 12px; }',
      'dialog.sk-rv-dialog { position: fixed; top: 50%; left: 50%; right: auto; bottom: auto; transform: translate(-50%, -50%); width: min(520px, calc(100vw - 24px)); height: fit-content; max-height: min(84vh, 780px); margin: 0; border: 0; border-radius: 20px; padding: 0; color: #17161A; font-family: inherit; box-shadow: 0 24px 60px rgba(23, 22, 26, 0.18); z-index: 10000; }',
      '.sk-rv-dialog::backdrop { background: rgba(23, 22, 26, 0.46); }',
      '.sk-rv-dialog-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 18px 8px; }',
      '.sk-rv-dialog-head h3 { margin: 0; font-size: 18px; font-weight: 800; }',
      '.sk-rv-x { width: 36px; height: 36px; border: 0; border-radius: 50%; background: #F3F0EA; color: #17161A; font: inherit; font-size: 20px; line-height: 1; cursor: pointer; }',
      '.sk-rv-dialog-body { overflow: auto; padding: 8px 18px 18px; max-height: calc(84vh - 68px); }',
      '.sk-rv-list { display: flex; flex-direction: column; gap: 12px; }',
      '.sk-rv-list .sk-rv-card { flex: none; width: 100%; min-height: 0; }',
      '.sk-rv-more { display: block; margin: 14px auto 0; }',
      '.sk-rv-dialog .s-comment-form-wrapper { display: block !important; }',
      '.sk-rv-dialog .s-comment-form-content br { display: none; }',
      '.sk-rv-dialog .s-comment-form-input { width: 100% !important; min-height: 128px !important; margin: 0 !important; padding: 12px 14px !important; border: 1px solid #E4E0D8 !important; border-radius: 12px !important; background: #fff !important; color: #17161A !important; font-family: inherit !important; font-size: 15px !important; line-height: 1.5 !important; resize: vertical; }',
      '.sk-rv-dialog .s-comment-form-content { flex-direction: column !important; align-items: stretch !important; }',
      '.sk-rv-dialog .s-comment-form-action { display: block !important; width: 100% !important; margin-top: 12px; align-self: stretch !important; }',
      '.sk-rv-dialog .s-comment-form-action salla-button { display: block !important; width: 100% !important; }',
      '.sk-rv-dialog button.s-button-element { width: 100% !important; min-height: 46px !important; border-radius: 12px !important; background: #17161A !important; color: #fff !important; }',
      '.sk-rv-dialog .s-button-text { color: #fff !important; }',
      '.sk-rv-photo-dialog { width: min(720px, calc(100vw - 24px)); background: transparent; box-shadow: none; }',
      '.sk-rv-photo-dialog .sk-rv-dialog-body { padding: 0; }',
      '.sk-rv-photo-dialog img { width: 100%; height: auto; border-radius: 16px; display: block; background: #fff; }',
      '.sk-rv-skel { display: grid; gap: 12px; }',
      '.sk-rv-skel i { display: block; height: 12px; border-radius: 99px; background: #EFEDE8; animation: sk-rv-pulse 1.2s ease-in-out infinite; }',
      '.sk-rv-skel i:nth-child(1) { width: 42%; height: 22px; }',
      '.sk-rv-skel i:nth-child(2) { width: 100%; height: 72px; border-radius: 16px; }',
      '.sk-rv-skel i:nth-child(3) { width: 100%; height: 52px; border-radius: 16px; }',
      '@keyframes sk-rv-pulse { 50% { opacity: 0.55; } }',
      '@container (max-width: 320px) { .sk-rv-summary { flex-direction: column; align-items: stretch; gap: 16px; } .sk-rv-avg { font-size: 48px; } }',
      '@media (prefers-reduced-motion: reduce) { .sk-rv-skel i { animation: none; } .sk-rv-scroller { scroll-behavior: auto; } }',
      '.sk-rv button:focus-visible, .sk-rv-dialog button:focus-visible, .sk-rv-dialog textarea:focus-visible { outline: 2px solid #17161A; outline-offset: 3px; }',
    ].join('\n');
    document.head.appendChild(style);
  }

  function commentsHost() {
    return document.querySelector('salla-comments[type="product"]');
  }

  function productIdFrom(comments) {
    return (comments && comments.getAttribute('item-id')) || '';
  }

  function formatRating(value) {
    var number = Number(value);
    if (!isFinite(number)) return '0.0';
    return (Math.round(number * 10) / 10).toFixed(1);
  }

  function reviewsLabel(count) {
    var n = Number(count) || 0;
    if (LANG === 'ar') {
      if (n === 1) return t(CONFIG.i18n.reviewOne);
      if (n === 2) return t(CONFIG.i18n.reviewTwo);
      if (n >= 3 && n <= 10) return t(CONFIG.i18n.reviewFew, { count: n });
      return t(CONFIG.i18n.reviewMany, { count: n });
    }
    if (n === 1) return t(CONFIG.i18n.reviewOne);
    return t(CONFIG.i18n.reviews, { count: n });
  }

  function parseDate(comment) {
    var raw = comment && comment.created_at && (comment.created_at.date || comment.created_at);
    if (typeof raw === 'string') {
      var parsed = new Date(raw.replace(' ', 'T').replace(/\.\d+$/, ''));
      if (!isNaN(parsed.getTime())) return parsed;
    }
    var stamp = Number(comment && comment.date);
    if (stamp > 1e12) return new Date(stamp);
    if (stamp > 1e9) return new Date(stamp * 1000);
    return null;
  }

  function relativeTime(comment) {
    var date = parseDate(comment);
    if (!date || typeof Intl === 'undefined' || !Intl.RelativeTimeFormat) return '';
    var seconds = Math.round((date.getTime() - Date.now()) / 1000);
    var minutes = Math.round(seconds / 60);
    var hours = Math.round(minutes / 60);
    var days = Math.round(hours / 24);
    var weeks = Math.round(days / 7);
    var months = Math.round(days / 30);
    var years = Math.round(days / 365);
    var format = new Intl.RelativeTimeFormat(LANG === 'ar' ? 'ar' : 'en', { numeric: 'auto' });
    if (Math.abs(seconds) < 45) return format.format(0, 'second');
    if (Math.abs(minutes) < 60) return format.format(minutes, 'minute');
    if (Math.abs(hours) < 24) return format.format(hours, 'hour');
    if (Math.abs(days) < 7) return format.format(days, 'day');
    if (Math.abs(weeks) < 5) return format.format(weeks, 'week');
    if (Math.abs(months) < 12) return format.format(months, 'month');
    return format.format(years, 'year');
  }

  function distribution(reviews) {
    var map = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (!reviews) return null;
    if (Array.isArray(reviews)) {
      if (!reviews.length) return null;
      reviews.forEach(function (item) {
        if (!item || typeof item !== 'object') return;
        var star = Number(item.rating || item.stars || item.star);
        var value = Number(item.percentage != null ? item.percentage : item.percent != null ? item.percent : item.count);
        if (star >= 1 && star <= 5 && isFinite(value)) map[star] = value;
      });
    } else if (typeof reviews === 'object') {
      var found = false;
      [1, 2, 3, 4, 5].forEach(function (star) {
        if (reviews[star] == null && reviews[String(star)] == null) return;
        found = true;
        map[star] = Number(reviews[star] != null ? reviews[star] : reviews[String(star)]) || 0;
      });
      if (!found) return null;
    } else {
      return null;
    }
    var sum = map[1] + map[2] + map[3] + map[4] + map[5];
    var total = Number(state.summary && state.summary.count) || 0;
    if (sum > 100.5 || (total > 0 && Math.abs(sum - total) <= 1)) {
      [1, 2, 3, 4, 5].forEach(function (star) {
        map[star] = sum ? (map[star] / sum) * 100 : 0;
      });
    }
    return map;
  }

  function factorLabels(factor) {
    var options = factor && (factor.options || factor.labels || factor.choices);
    if (!Array.isArray(options) || options.length < 3) return null;
    return options.slice(0, 3).map(function (item) {
      if (typeof item === 'string') return item;
      if (!item || typeof item !== 'object') return '';
      return item.name || item.label || item.value || '';
    });
  }

  function imageUrl(image) {
    if (!image) return '';
    if (typeof image === 'string') return image;
    return image.url || image.src || (image.image && (image.image.url || image.image.src)) || '';
  }

  function commentImages(comment) {
    var images = comment && (comment.images || comment.attachments);
    if (!Array.isArray(images)) return [];
    return images.map(imageUrl).filter(Boolean);
  }

  function optionText(comment) {
    var sources = [comment.options, comment.selected_options, comment.product_options, comment.order_options];
    var parts = [];
    sources.forEach(function (source) {
      if (!source) return;
      var list = Array.isArray(source) ? source : [source];
      list.forEach(function (item) {
        if (!item) return;
        if (typeof item === 'string') {
          parts.push(item);
          return;
        }
        var name = item.name || item.option || item.key || '';
        var value = item.value || item.detail || item.label || '';
        if (typeof value === 'object' && value) value = value.name || value.value || '';
        if (name && value) parts.push(name + ' ' + value);
        else if (value || name) parts.push(String(value || name));
      });
    });
    var seen = {};
    return parts.filter(function (part) {
      if (!part || seen[part]) return false;
      seen[part] = true;
      return true;
    }).join(LANG === 'ar' ? '، ' : ', ');
  }

  function repliesOf(comment) {
    var raw = comment.replies || comment.reply || [];
    if (!raw) return [];
    if (!Array.isArray(raw)) raw = [raw];
    return raw.map(function (reply) {
      if (!reply) return null;
      if (typeof reply === 'string') return reply;
      return reply.content || reply.comment || reply.text || '';
    }).filter(Boolean);
  }

  function stars(value) {
    var wrap = el('span', 'sk-rv-stars');
    var score = Number(value);
    if (!isFinite(score)) score = 0;
    wrap.setAttribute('role', 'img');
    wrap.setAttribute('aria-label', t(CONFIG.i18n.outOf, { rating: formatRating(score) }));
    for (var index = 1; index <= 5; index += 1) {
      var fill = Math.max(0, Math.min(1, score - (index - 1)));
      var star = el('span', 'sk-rv-star');
      star.style.setProperty('--fill', String(fill));
      var empty = svg(STAR_PATH, 'is-empty');
      var full = svg(STAR_PATH, 'is-fill');
      star.appendChild(empty);
      star.appendChild(full);
      wrap.appendChild(star);
    }
    return wrap;
  }

  function person(comment) {
    var row = el('div', 'sk-rv-person');
    var avatar = el('span', 'sk-rv-avatar');
    var name = comment.name || t(CONFIG.i18n.guest);
    var photo = comment.avatar || '';
    if (photo && !PLACEHOLDER_RE.test(photo)) {
      var image = el('img');
      image.src = photo;
      image.alt = '';
      avatar.appendChild(image);
    } else {
      avatar.textContent = String(name).trim().charAt(0) || '·';
    }
    var who = el('span', 'sk-rv-who');
    var nameRow = el('span', 'sk-rv-name');
    nameRow.appendChild(document.createTextNode(name));
    if (comment.has_order || comment.is_verified || comment.verified) {
      var badge = el('span', 'sk-rv-verified');
      badge.appendChild(svg('M5 12.5 9.2 16.5 19 7', ''));
      badge.appendChild(document.createTextNode(t(CONFIG.i18n.verified)));
      nameRow.appendChild(badge);
    }
    who.appendChild(nameRow);
    var bought = optionText(comment);
    if (bought) who.appendChild(el('span', 'sk-rv-bought', t(CONFIG.i18n.bought, { options: bought })));
    if (comment.is_pending) who.appendChild(el('span', 'sk-rv-pending', t(CONFIG.i18n.pending)));
    row.appendChild(avatar);
    row.appendChild(who);
    return row;
  }

  function openPhoto(url, label) {
    if (!ui.photoDialog) return;
    ui.photoDialogBody.textContent = '';
    var image = el('img');
    image.src = url;
    image.alt = label || t(CONFIG.i18n.photo);
    ui.photoDialogBody.appendChild(image);
    if (typeof ui.photoDialog.showModal === 'function') ui.photoDialog.showModal();
  }

  function card(comment, compact) {
    var article = el('article', 'sk-rv-card' + (compact ? ' is-compact' : ''));
    var meta = el('div', 'sk-rv-meta');
    var rating = Number(comment.rating || comment.stars || 0);
    if (rating > 0) meta.appendChild(stars(rating));
    else meta.appendChild(el('span'));
    var when = relativeTime(comment);
    if (when) meta.appendChild(el('time', 'sk-rv-time', when));
    article.appendChild(meta);
    var text = comment.content || comment.text || '';
    if (text) article.appendChild(el('p', 'sk-rv-text', text));
    var images = commentImages(comment);
    if (images.length) {
      var photos = el('div', 'sk-rv-photos');
      images.slice(0, compact ? 3 : images.length).forEach(function (url, index) {
        var button = el('button', 'sk-rv-photo');
        button.type = 'button';
        button.setAttribute('aria-label', t(CONFIG.i18n.photo) + ' ' + (index + 1));
        var image = el('img');
        image.src = url;
        image.alt = '';
        button.appendChild(image);
        button.addEventListener('click', function () {
          openPhoto(url, t(CONFIG.i18n.photo));
        });
        photos.appendChild(button);
      });
      article.appendChild(photos);
    }
    article.appendChild(person(comment));
    if (!compact) {
      repliesOf(comment).forEach(function (reply) {
        var block = el('p', 'sk-rv-reply');
        block.appendChild(el('b', null, t(CONFIG.i18n.storeReply)));
        block.appendChild(document.createTextNode(reply));
        article.appendChild(block);
      });
    }
    return article;
  }

  function commentStars() {
    var map = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    var total = 0;
    var sum = 0;
    (state.comments || []).forEach(function (comment) {
      var value = Number(comment && (comment.rating || comment.stars));
      if (!(value > 0)) return;
      var star = Math.round(value);
      if (star < 1 || star > 5) return;
      map[star] += 1;
      total += 1;
      sum += value;
    });
    return { map: map, total: total, sum: sum };
  }

  function summaryBlock(summary) {
    var count = Number(summary && summary.count) || 0;
    var rating = Number(summary && summary.rating) || 0;
    var barsData = distribution(summary && summary.reviews);
    if (!barsData) {
      var fromComments = commentStars();
      barsData = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      if (fromComments.total > 0) {
        [1, 2, 3, 4, 5].forEach(function (star) {
          barsData[star] = (fromComments.map[star] / fromComments.total) * 100;
        });
        if (count <= 0) count = fromComments.total;
        if (rating <= 0) rating = fromComments.sum / fromComments.total;
      }
    }
    var block = el('div', 'sk-rv-summary');
    var score = el('div', 'sk-rv-score');
    score.appendChild(el('p', 'sk-rv-avg', formatRating(rating)));
    score.appendChild(stars(rating));
    score.appendChild(el('p', 'sk-rv-count', reviewsLabel(count)));
    block.appendChild(score);
    var bars = el('div', 'sk-rv-bars');
    [5, 4, 3, 2, 1].forEach(function (star) {
      var percent = Math.max(0, Math.min(100, Number(barsData[star]) || 0));
      var row = el('div', 'sk-rv-bar');
      row.appendChild(el('span', 'sk-rv-bar-n', String(star)));
      var track = el('span', 'sk-rv-track');
      var fill = el('span', 'sk-rv-fill');
      var width = percent <= 0 ? 0 : Math.max(percent, 1.5);
      fill.style.width = width + '%';
      track.appendChild(fill);
      row.appendChild(track);
      row.appendChild(el('span', 'sk-rv-pct', Math.round(percent) + '%'));
      bars.appendChild(row);
    });
    block.appendChild(bars);
    return block;
  }

  function factorsBlock(summary) {
    var factors = summary && summary.factors;
    if (!Array.isArray(factors) || !factors.length) return null;
    var usable = factors.filter(function (factor) {
      return factor && factor.name && Number(factor.rating) > 0;
    });
    if (!usable.length) return null;
    var box = el('div', 'sk-rv-fit');
    usable.forEach(function (factor) {
      var rating = Math.max(0, Math.min(5, Number(factor.rating)));
      var row = el('div', 'sk-rv-fit-row');
      row.appendChild(el('p', 'sk-rv-kicker', factor.name));
      var track = el('div', 'sk-rv-fit-track');
      var dot = el('span', 'sk-rv-fit-dot');
      var position = ((rating - 1) / 4) * 100;
      if (LANG === 'ar') position = 100 - position;
      dot.style.left = Math.max(0, Math.min(100, position)) + '%';
      track.appendChild(dot);
      row.appendChild(track);
      var labels = el('div', 'sk-rv-fit-labels');
      var ends = factorLabels(factor);
      if (ends && ends[0] && ends[2]) {
        var active = rating < 2.5 ? 0 : rating < 3.5 ? 1 : 2;
        ends.forEach(function (label, index) {
          labels.appendChild(el('span', index === active ? 'is-on' : '', label));
        });
      } else {
        labels.appendChild(el('span', null, '1'));
        labels.appendChild(el('span', null, t(CONFIG.i18n.outOf, { rating: formatRating(factor.rating) })));
        labels.appendChild(el('span', null, '5'));
      }
      row.appendChild(labels);
      box.appendChild(row);
    });
    return box;
  }

  function verifiedButton() {
    var host = document.querySelector('salla-verified-review');
    if (!host) return null;
    var root = host.shadowRoot || host;
    var button = root.querySelector('button');
    if (!button) return null;
    var rect = button.getBoundingClientRect();
    if (rect.width < 2 && rect.height < 2) return null;
    return button;
  }

  function commentForm() {
    return document.querySelector('salla-comment-form');
  }

  function canWrite() {
    return !!(verifiedButton() || commentForm());
  }

  function openWrite() {
    var native = verifiedButton();
    if (native) {
      native.click();
      return;
    }
    var form = commentForm();
    if (!form || !ui.writeDialog) return;
    var field = form.querySelector('textarea');
    if (field) field.setAttribute('placeholder', t(CONFIG.i18n.placeholder));
    ui.writeBody.appendChild(form);
    if (typeof ui.writeDialog.showModal === 'function') ui.writeDialog.showModal();
    if (field) field.focus();
  }

  function renderList() {
    if (!ui.listBody) return;
    ui.listBody.textContent = '';
    var list = el('div', 'sk-rv-list');
    state.comments.forEach(function (comment) {
      list.appendChild(card(comment, false));
    });
    ui.listBody.appendChild(list);
    if (state.page < state.totalPages) {
      var more = el('button', 'sk-rv-more', state.loadingMore ? '…' : t(CONFIG.i18n.loadMore));
      more.type = 'button';
      more.disabled = state.loadingMore;
      more.addEventListener('click', function () {
        loadMore();
      });
      ui.listBody.appendChild(more);
    }
  }

  function openAll() {
    if (!ui.listDialog) return;
    renderList();
    if (typeof ui.listDialog.showModal === 'function') ui.listDialog.showModal();
  }

  function render(host) {
    refreshLang();
    var root = host.querySelector('.sk-rv');
    if (!root) return;
    var dir = LANG === 'ar' ? 'rtl' : 'ltr';
    root.setAttribute('dir', dir);
    root.setAttribute('lang', LANG);
    root.textContent = '';

    var head = el('div', 'sk-rv-head');
    var title = el('h2', 'sk-rv-title', t(CONFIG.i18n.title));
    title.id = 'sk-rv-title';
    head.appendChild(title);
    if (state.total > 0) {
      var all = el('button', 'sk-rv-all');
      all.type = 'button';
      all.appendChild(document.createTextNode(t(CONFIG.i18n.seeAll, { count: state.total })));
      all.appendChild(el('span', 'sk-rv-chev'));
      all.addEventListener('click', openAll);
      head.appendChild(all);
    }
    root.appendChild(head);
    root.setAttribute('aria-labelledby', 'sk-rv-title');

    if (state.notice) root.appendChild(el('p', 'sk-rv-notice', state.notice));

    var summary = summaryBlock(state.summary);
    if (summary) root.appendChild(summary);
    var factors = factorsBlock(state.summary);
    if (factors) root.appendChild(factors);
    if (canWrite()) {
      var write = el('button', 'sk-rv-write', t(CONFIG.i18n.write));
      write.type = 'button';
      write.addEventListener('click', openWrite);
      root.appendChild(write);
    }
    if (!state.comments.length) {
      root.appendChild(el('p', 'sk-rv-empty', t(CONFIG.i18n.empty)));
      return;
    }
    var scroller = el('div', 'sk-rv-scroller');
    scroller.tabIndex = 0;
    scroller.setAttribute('role', 'region');
    scroller.setAttribute('aria-label', t(CONFIG.i18n.title));
    state.comments.forEach(function (comment) {
      scroller.appendChild(card(comment, true));
    });
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scroller.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      var cardWidth = 280;
      var first = scroller.querySelector('.sk-rv-card');
      if (first) cardWidth = first.getBoundingClientRect().width + 12;
      var delta = event.key === 'ArrowRight' ? cardWidth : -cardWidth;
      scroller.scrollBy({ left: delta, behavior: reduce ? 'auto' : 'smooth' });
      event.preventDefault();
    });
    bindHandScroll(scroller);
    root.appendChild(scroller);
  }

  function bindHandScroll(scroller) {
    var drag = null;
    scroller.addEventListener('pointerdown', function (event) {
      if (event.pointerType === 'touch' || event.button !== 0) return;
      if (event.target.closest('button, a, input, textarea')) return;
      drag = { id: event.pointerId, x: event.clientX, left: scroller.scrollLeft, moved: false };
      scroller.classList.add('is-dragging');
      if (scroller.setPointerCapture) scroller.setPointerCapture(event.pointerId);
    });
    scroller.addEventListener('pointermove', function (event) {
      if (!drag || event.pointerId !== drag.id) return;
      var dx = event.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      // Increasing scrollLeft shifts the cards left in both LTR and RTL
      // (Chrome/Safari report a negative RTL scrollLeft). Subtract the
      // pointer delta so the row follows the hand on desktop.
      scroller.scrollLeft = drag.left - dx;
    });
    function endDrag(event) {
      if (!drag || event.pointerId !== drag.id) return;
      if (drag.moved) scroller.setAttribute('data-sk-drag', '1');
      drag = null;
      scroller.classList.remove('is-dragging');
    }
    scroller.addEventListener('pointerup', endDrag);
    scroller.addEventListener('pointercancel', endDrag);
    scroller.addEventListener('click', function (event) {
      if (scroller.getAttribute('data-sk-drag') !== '1') return;
      scroller.removeAttribute('data-sk-drag');
      event.preventDefault();
      event.stopPropagation();
    }, true);
  }

  function dialog(title) {
    var node = el('dialog', 'sk-rv-dialog');
    node.setAttribute('dir', LANG === 'ar' ? 'rtl' : 'ltr');
    var head = el('div', 'sk-rv-dialog-head');
    head.appendChild(el('h3', null, title));
    var close = el('button', 'sk-rv-x', '×');
    close.type = 'button';
    close.setAttribute('aria-label', t(CONFIG.i18n.close));
    close.addEventListener('click', function () {
      node.close();
    });
    head.appendChild(close);
    var body = el('div', 'sk-rv-dialog-body');
    node.appendChild(head);
    node.appendChild(body);
    node.addEventListener('click', function (event) {
      if (event.target === node) node.close();
    });
    node.addEventListener('close', function () {
      node.setAttribute('dir', LANG === 'ar' ? 'rtl' : 'ltr');
    });
    document.body.appendChild(node);
    return { node: node, body: body, title: head.querySelector('h3') };
  }

  function ensureDialogs() {
    if (ui.writeDialog) return;
    var write = dialog(t(CONFIG.i18n.formTitle));
    var list = dialog(t(CONFIG.i18n.allTitle));
    var photo = dialog('');
    photo.node.classList.add('sk-rv-photo-dialog');
    ui.writeDialog = write.node;
    ui.writeBody = write.body;
    ui.writeDialog.addEventListener('close', function () {
      var form = ui.writeBody.querySelector('salla-comment-form');
      var comments = commentsHost();
      if (form && comments) comments.appendChild(form);
    });
    ui.writeTitle = write.title;
    ui.listDialog = list.node;
    ui.listBody = list.body;
    ui.listTitle = list.title;
    ui.photoDialog = photo.node;
    ui.photoDialogBody = photo.body;
  }

  function skeleton() {
    var box = el('div', 'sk-rv-skel');
    box.setAttribute('aria-busy', 'true');
    box.setAttribute('aria-label', t(CONFIG.i18n.loading));
    box.appendChild(el('i'));
    box.appendChild(el('i'));
    box.appendChild(el('i'));
    return box;
  }

  function numericId(id) {
    return /^\d+$/.test(String(id)) ? Number(id) : id;
  }

  function loadSummary(id) {
    return salla.api.request('rating/summary/' + id).then(function (response) {
      return response && response.data ? response.data : null;
    });
  }

  function loadComments(id, page) {
    return salla.comment.api.fetchComments({
      type: 'products',
      ids: [numericId(id)],
      page: page,
      per_page: 8,
      sort: 'latest',
    }).then(function (response) {
      var items = response && Array.isArray(response.data) ? response.data : [];
      var pagination = (response && response.pagination) || {};
      return {
        items: items,
        page: pagination.currentPage || page,
        total: pagination.total != null ? pagination.total : items.length,
        totalPages: pagination.totalPages || 1,
      };
    });
  }

  function sortPinned(items) {
    var pinned = [];
    var rest = [];
    items.forEach(function (item) {
      if (item && item.is_pinned) pinned.push(item);
      else rest.push(item);
    });
    return pinned.concat(rest);
  }

  function bindAdded() {
    if (bindAdded.done || !window.salla || !salla.event || !salla.event.comment || !salla.event.comment.onAdded) return;
    bindAdded.done = true;
    salla.event.comment.onAdded(function () {
      state.notice = t(CONFIG.i18n.sent);
      if (ui.writeDialog && ui.writeDialog.open) ui.writeDialog.close();
      var host = document.querySelector('.sk-rv-on');
      var comments = commentsHost();
      if (!host || !comments) return;
      loadComments(state.productId, 1).then(function (payload) {
        state.comments = sortPinned(payload.items);
        state.page = payload.page;
        state.total = payload.total;
        state.totalPages = payload.totalPages;
        render(host);
      }).catch(function () {
        render(host);
      });
    });
  }

  function loadMore() {
    if (state.loadingMore || state.page >= state.totalPages) return;
    state.loadingMore = true;
    renderList();
    loadComments(state.productId, state.page + 1).then(function (payload) {
      var seen = {};
      state.comments.forEach(function (item) { seen[item.id] = true; });
      payload.items.forEach(function (item) {
        if (!seen[item.id]) state.comments.push(item);
      });
      state.page = payload.page;
      state.totalPages = payload.totalPages;
      state.loadingMore = false;
      renderList();
    }).catch(function () {
      state.loadingMore = false;
      renderList();
    });
  }

  function fail(host) {
    inflight = '';
    if (!host) return;
    host.classList.remove('sk-rv-on');
    host.setAttribute('data-sk-rv-fail', state.productId || productIdFrom(commentsHost()));
    var root = host.querySelector('.sk-rv');
    if (root) root.remove();
  }

  function mount() {
    var comments = commentsHost();
    if (!comments || !window.salla || !salla.api || !salla.comment || !salla.comment.api) return;
    var id = productIdFrom(comments);
    if (!id) return;
    var host = comments.closest('#product-tabs-faqs') || comments.parentElement;
    if (!host) return;
    if (host.getAttribute('data-sk-rv-fail') === String(id)) return;
    if (host.querySelector('.sk-rv[data-product="' + id + '"]')) return;
    if (inflight === String(id)) return;

    var previous = host.querySelector('.sk-rv');
    if (previous) previous.remove();
    inflight = String(id);
    state.productId = String(id);
    state.notice = '';
    state.comments = [];
    state.summary = null;
    refreshLang();
    ensureStyle();
    ensureDialogs();
    bindAdded();

    var root = el('section', 'sk-rv');
    root.setAttribute('data-product', String(id));
    root.setAttribute('dir', LANG === 'ar' ? 'rtl' : 'ltr');
    root.appendChild(skeleton());
    host.insertBefore(root, comments);
    host.classList.add('sk-rv-on');

    Promise.all([
      loadSummary(id).catch(function () { return null; }),
      loadComments(id, 1).catch(function () { return null; }),
    ]).then(function (result) {
      if (productIdFrom(commentsHost()) !== String(id)) return;
      var summary = result[0];
      var commentsPayload = result[1];
      if (!summary && !commentsPayload) {
        fail(host);
        return;
      }
      state.summary = summary;
      if (commentsPayload) {
        state.comments = sortPinned(commentsPayload.items);
        state.page = commentsPayload.page;
        state.total = commentsPayload.total;
        state.totalPages = commentsPayload.totalPages;
      }
      inflight = '';
      render(host);
    }).catch(function () {
      fail(host);
    });
  }

  function schedule() {
    if (schedule.frame) return;
    schedule.frame = window.requestAnimationFrame(function () {
      schedule.frame = 0;
      mount();
    });
  }

  function start() {
    schedule();
    if (start.watching || !document.body) return;
    start.watching = true;
    var observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function whenReady(done) {
    if (window.salla && typeof salla.onReady === 'function') {
      salla.onReady().then(done).catch(done);
      return;
    }
    var tries = 0;
    var timer = window.setInterval(function () {
      tries += 1;
      if (window.salla && typeof salla.onReady === 'function') {
        window.clearInterval(timer);
        salla.onReady().then(done).catch(done);
      } else if (tries > 40) {
        window.clearInterval(timer);
      }
    }, 250);
  }

  whenReady(start);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { whenReady(start); });
  }
})();
