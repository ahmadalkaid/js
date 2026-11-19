/* Alshiaka module: product-options */
window.__SHEYAKA_CONFIGS__ = window.__SHEYAKA_CONFIGS__ || {};
window.__SHEYAKA_CONFIGS__["product-options"] = {
  "shipsInDays": 2,
  "matrix": {
    "under-165": {
      "S": [
        "54",
        "S"
      ],
      "M": [
        "55",
        "M"
      ],
      "L": [
        "56",
        "L"
      ],
      "XL": [
        "57",
        "XL"
      ],
      "2XL": [
        "58",
        "XXL"
      ]
    },
    "165-175": {
      "S": [
        "56",
        "S"
      ],
      "M": [
        "58",
        "M"
      ],
      "L": [
        "59",
        "L"
      ],
      "XL": [
        "60",
        "XL"
      ],
      "2XL": [
        "61",
        "XXL"
      ]
    },
    "over-175": {
      "S": [
        "58",
        "S"
      ],
      "M": [
        "60",
        "M"
      ],
      "L": [
        "61",
        "L"
      ],
      "XL": [
        "62",
        "XL"
      ],
      "2XL": [
        "64",
        "XXL"
      ]
    }
  },
  "heightBands": [
    {
      "id": "under-165",
      "ar": "أقل من 165",
      "en": "Under 165"
    },
    {
      "id": "165-175",
      "ar": "165–175",
      "en": "165–175"
    },
    {
      "id": "over-175",
      "ar": "أكثر من 175",
      "en": "Over 175"
    }
  ],
  "shirtSizes": [
    "S",
    "M",
    "L",
    "XL",
    "2XL"
  ],
  "i18n": {
    "ar": {
      "size": "المقاس",
      "find": "اعرف مقاسي",
      "inStock": "متوفر — يشحن خلال يومين",
      "inStockDays": "متوفر — يشحن خلال {{days}} أيام",
      "outStock": "غير متوفر",
      "title": "اعرف مقاسي",
      "sub": "سؤالين. بدون شريط قياس.",
      "height": "طولك",
      "shirt": "مقاس قميصك المعتاد",
      "recommend": "نرشّح لك",
      "inThis": "متوفر في هذا الثوب",
      "outThis": "غير متوفر في هذا الثوب",
      "use": "استخدم هذا المقاس",
      "chart": "شاهد جدول المقاسات",
      "chartTitle": "جدول المقاسات",
      "back": "رجوع",
      "close": "إغلاق",
      "lengthCol": "الطول",
      "widthCol": "العرض",
      "youCol": "طولك",
      "shirtCol": "قميصك"
    },
    "en": {
      "size": "Size",
      "find": "Find my size",
      "inStock": "In stock — ships in 2 days",
      "inStockDays": "In stock — ships in {{days}} days",
      "outStock": "Out of stock",
      "title": "Find my size",
      "sub": "Two questions. No measuring tape needed.",
      "height": "Your height",
      "shirt": "Your usual shirt size",
      "recommend": "We recommend",
      "inThis": "In stock in this thobe",
      "outThis": "Not in stock in this thobe",
      "use": "Use this size",
      "chart": "See full size chart",
      "chartTitle": "Size chart",
      "back": "Back",
      "close": "Close",
      "lengthCol": "Length",
      "widthCol": "Width",
      "youCol": "Your height",
      "shirtCol": "Your shirt"
    }
  }
};
(function () {
  'use strict';

  if (window.__sheyakaProductOptions) return;
  window.__sheyakaProductOptions = true;

  var STOCK_ID = 'sk-pdp-stock';
  var SIZE_HEAD_ID = 'sk-pdp-size-head';
  var MODAL_ID = 'sk-pdp-modal';
  var STYLE_ID = 'sk-pdp-style';
  var FINDER_KEY = 'sheyaka-size-finder';
  var MY_SIZE_OFF_KEY = 'sheyaka-my-size-off';

  var CONFIG = {
    shipsInDays: 2,

    // Only show «اعرف مقاسي» on these Salla category ids (men's thobes by default).
    // Shemaghs, shoes, kids, and other products skip the height/shirt finder.
    showOnCategoryIds: [919750293],
    autoDetectSizeFinder: true,
    enableSizeFinder: true,

    // Person height band + usual shirt size → thobe length (number) and width (letter).
    // 165–175 and shirt M → length 58, width M.
    matrix: {
      'under-165': { S: ['54', 'S'], M: ['55', 'M'], L: ['56', 'L'], XL: ['57', 'XL'], '2XL': ['58', 'XXL'] },
      '165-175': { S: ['56', 'S'], M: ['58', 'M'], L: ['59', 'L'], XL: ['60', 'XL'], '2XL': ['61', 'XXL'] },
      'over-175': { S: ['58', 'S'], M: ['60', 'M'], L: ['61', 'L'], XL: ['62', 'XL'], '2XL': ['64', 'XXL'] },
    },

    heightBands: [
      { id: 'under-165', ar: 'أقل من 165', en: 'Under 165' },
      { id: '165-175', ar: '165–175', en: '165–175' },
      { id: 'over-175', ar: 'أكثر من 175', en: 'Over 175' },
    ],
    shirtSizes: ['S', 'M', 'L', 'XL', '2XL'],

    i18n: {
      ar: {
        size: 'المقاس',
        find: 'اعرف مقاسي',
        inStock: 'متوفر — يشحن خلال يومين',
        inStockDays: 'متوفر — يشحن خلال {{days}} أيام',
        outStock: 'غير متوفر',
        title: 'اعرف مقاسي',
        sub: 'سؤالين. بدون شريط قياس.',
        height: 'طولك',
        shirt: 'مقاس قميصك المعتاد',
        recommend: 'نرشّح لك',
        inThis: 'متوفر في هذا الثوب',
        outThis: 'غير متوفر في هذا الثوب',
        use: 'استخدم هذا المقاس',
        chart: 'شاهد جدول المقاسات',
        chartTitle: 'جدول المقاسات',
        back: 'رجوع',
        close: 'إغلاق',
        lengthCol: 'الطول',
        widthCol: 'العرض',
        youCol: 'طولك',
        shirtCol: 'قميصك',
      },
      en: {
        size: 'Size',
        find: 'Find my size',
        inStock: 'In stock — ships in 2 days',
        inStockDays: 'In stock — ships in {{days}} days',
        outStock: 'Out of stock',
        title: 'Find my size',
        sub: 'Two questions. No measuring tape needed.',
        height: 'Your height',
        shirt: 'Your usual shirt size',
        recommend: 'We recommend',
        inThis: 'In stock in this thobe',
        outThis: 'Not in stock in this thobe',
        use: 'Use this size',
        chart: 'See full size chart',
        chartTitle: 'Size chart',
        back: 'Back',
        close: 'Close',
        lengthCol: 'Length',
        widthCol: 'Width',
        youCol: 'Your height',
        shirtCol: 'Your shirt',
      },
    },
  };

  function applySheyakaConfig(config, slug) {
    var bag = window.__SHEYAKA_CONFIGS__;
    var remote = bag && bag[slug];
    if (!remote || typeof remote !== 'object' || Array.isArray(remote)) return;
    Object.keys(remote).forEach(function (key) {
      config[key] = remote[key];
    });
  }
  applySheyakaConfig(CONFIG, 'product-options');
  if (window.SHEYAKA_PRODUCT_OPTIONS && typeof window.SHEYAKA_PRODUCT_OPTIONS === 'object') {
    Object.keys(window.SHEYAKA_PRODUCT_OPTIONS).forEach(function (key) {
      CONFIG[key] = window.SHEYAKA_PRODUCT_OPTIONS[key];
    });
  }

  var LETTER_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'];

  var ui = {
    height: '',
    shirt: '',
    view: 'finder',
    lastFocus: null,
  };

  function detectLang() {
    var html = document.documentElement;
    var lang = String(html.getAttribute('lang') || '').toLowerCase();
    if (lang.indexOf('en') === 0) return 'en';
    if (lang.indexOf('ar') === 0) return 'ar';
    return html.getAttribute('dir') === 'ltr' ? 'en' : 'ar';
  }

  function t(key) {
    var lang = detectLang();
    var pack = CONFIG.i18n[lang] || CONFIG.i18n.ar;
    var text = pack[key] || (CONFIG.i18n.ar[key] || key);
    if (key === 'inStock' && CONFIG.shipsInDays !== 2) {
      text = (pack.inStockDays || text).replace('{{days}}', String(CONFIG.shipsInDays));
    }
    return text;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fold(value) {
    return String(value || '')
      .replace(/[\u064B-\u0652]/g, '')
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      .toLowerCase();
  }

  function cssText() {
    return [
      'body.sk-pdp-on .sk-size-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin:4px 0 12px}',
      'body.sk-pdp-on .sk-size-head span{font-size:15px;font-weight:600}',
      'body.sk-pdp-on .sk-find{margin:0;padding:0;border:0;background:transparent;color:#161616;font:inherit;font-size:14px;font-weight:600;text-decoration:underline;text-underline-offset:3px;cursor:pointer}',
      'body.sk-pdp-on .sk-find:focus-visible{outline:2px solid #111;outline-offset:3px}',
      'body.sk-pdp-on .sk-opt{margin-bottom:14px}',
      'body.sk-pdp-on .sk-opt .s-product-options-option-label{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px}',
      'body.sk-pdp-on .sk-opt .s-product-options-option-label b{font-size:14px;font-weight:600}',
      'body.sk-pdp-on .sk-opt .s-product-options-option-label > b > span{display:none}',
      'body.sk-pdp-on .sk-opt .s-product-options-option-label small{display:none}',
      'body.sk-pdp-on .sk-opt .s-product-options-grid-mode{display:flex;flex-wrap:wrap;gap:8px}',
      'body.sk-pdp-on .sk-opt .s-product-options-grid-mode > label{position:relative;margin:0;cursor:pointer}',
      'body.sk-pdp-on .sk-opt .s-product-options-grid-mode input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:inherit}',
      'body.sk-pdp-on .sk-opt .s-product-options-grid-mode-span{display:inline-flex;align-items:center;justify-content:center;min-width:58px;min-height:48px;padding:0 12px;border:1px solid #e6e6e6;border-radius:12px;background:#fff;color:#161616;box-shadow:inset 0 0 0 1px transparent;font-size:14px;font-weight:500;line-height:1}',
      'body.sk-pdp-on .sk-opt .s-product-options-grid-mode input:checked + .s-product-options-grid-mode-span{border-color:#111;box-shadow:inset 0 0 0 1px #111;font-weight:700}',
      'body.sk-pdp-on .sk-opt .s-product-options-grid-mode input:focus-visible + .s-product-options-grid-mode-span{outline:2px solid #111;outline-offset:2px}',
      'body.sk-pdp-on .sk-opt--neck .s-product-options-grid-mode-span{min-width:132px;padding:0 18px;border-radius:999px}',
      'body.sk-pdp-on .sk-opt .s-product-options-option-stock-out .s-product-options-grid-mode-span{color:#a3a3a3}',
      'body.sk-pdp-on #' + STOCK_ID + '{display:block;width:100%;margin:10px 0 16px;font-size:14px;font-weight:600;line-height:1.4;text-align:start}',
      'body.sk-pdp-on #' + STOCK_ID + '.is-in{color:#1d7a45}',
      'body.sk-pdp-on #' + STOCK_ID + '.is-out{color:#9a4d4d}',
      '#' + MODAL_ID + '{position:fixed;inset:0;z-index:100000;display:flex;align-items:flex-end;justify-content:center;background:rgba(22,22,22,.35);font-family:inherit;color:#161616}',
      '#' + MODAL_ID + '[hidden]{display:none !important}',
      '#' + MODAL_ID + ' *{box-sizing:border-box}',
      '#' + MODAL_ID + ' .sk-sheet{width:min(480px,100%);max-height:min(92vh,760px);overflow:auto;padding:22px 20px 28px;border-radius:20px 20px 0 0;background:#fff}',
      '#' + MODAL_ID + ' .sk-sheet-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}',
      '#' + MODAL_ID + ' h2{margin:0;font-size:22px;font-weight:700;line-height:1.25}',
      '#' + MODAL_ID + ' .sk-x{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;margin:-6px -4px 0 0;border:0;border-radius:8px;background:transparent;color:#444;cursor:pointer}',
      '#' + MODAL_ID + ' .sk-x:hover{background:#f4f4f4}',
      '#' + MODAL_ID + ' .sk-x:focus-visible{outline:2px solid #111;outline-offset:2px}',
      '#' + MODAL_ID + ' .sk-sub{margin:6px 0 18px;color:#8a8a8a;font-size:14px;line-height:1.5}',
      '#' + MODAL_ID + ' .sk-q{margin:0 0 16px}',
      '#' + MODAL_ID + ' .sk-q p{margin:0 0 8px;font-size:14px;font-weight:600}',
      '#' + MODAL_ID + ' .sk-choices{display:grid;gap:8px}',
      '#' + MODAL_ID + ' .sk-choices[data-count="3"]{grid-template-columns:repeat(3,minmax(0,1fr))}',
      '#' + MODAL_ID + ' .sk-choices[data-count="5"]{grid-template-columns:repeat(5,minmax(0,1fr))}',
      '#' + MODAL_ID + ' .sk-choice{min-height:52px;padding:8px 4px;border:1px solid #e6e6e6;border-radius:12px;background:#fff;color:#161616;font:inherit;font-size:14px;font-weight:500;cursor:pointer;box-shadow:inset 0 0 0 1px transparent}',
      '#' + MODAL_ID + ' .sk-choice[aria-pressed="true"]{border-color:#111;box-shadow:inset 0 0 0 1px #111;font-weight:700}',
      '#' + MODAL_ID + ' .sk-choice:focus-visible{outline:2px solid #111;outline-offset:2px}',
      '#' + MODAL_ID + ' .sk-rec{margin:6px 0 16px;padding:16px 16px 14px;border:1px solid #e6e6e6;border-radius:14px}',
      '#' + MODAL_ID + ' .sk-rec p{margin:0}',
      '#' + MODAL_ID + ' .sk-rec__k{color:#8a8a8a;font-size:13px}',
      '#' + MODAL_ID + ' .sk-rec__v{margin-top:4px;font-size:22px;font-weight:700;line-height:1.3}',
      '#' + MODAL_ID + ' .sk-rec__s{margin-top:6px;color:#1d7a45;font-size:14px;font-weight:600}',
      '#' + MODAL_ID + ' .sk-rec__s.is-out{color:#9a4d4d}',
      '#' + MODAL_ID + ' .sk-use{display:flex;align-items:center;justify-content:center;width:100%;min-height:52px;margin-top:8px;border:0;border-radius:12px;background:#111;color:#fff;font:inherit;font-size:16px;font-weight:600;cursor:pointer}',
      '#' + MODAL_ID + ' .sk-use:disabled{opacity:.4;cursor:not-allowed}',
      '#' + MODAL_ID + ' .sk-use:focus-visible{outline:2px solid #111;outline-offset:3px}',
      '#' + MODAL_ID + ' .sk-chart-btn{display:block;width:100%;margin-top:14px;padding:6px;border:0;background:transparent;color:#8a8a8a;font:inherit;font-size:14px;cursor:pointer}',
      '#' + MODAL_ID + ' .sk-chart-btn:focus-visible{outline:2px solid #111;outline-offset:2px}',
      '#' + MODAL_ID + ' .sk-table-wrap{overflow-x:auto;margin-top:8px}',
      '#' + MODAL_ID + ' table{width:100%;border-collapse:collapse;font-size:13.5px;text-align:center}',
      '#' + MODAL_ID + ' th,#' + MODAL_ID + ' td{padding:11px 8px;border-bottom:1px solid #eee}',
      '#' + MODAL_ID + ' th{font-weight:600;color:#6f6f6f}',
      '@media (min-width:768px){',
      '#' + MODAL_ID + '{align-items:center;padding:24px}',
      '#' + MODAL_ID + ' .sk-sheet{border-radius:20px;box-shadow:0 18px 50px rgba(0,0,0,.16)}',
      '}',
      '@media (prefers-reduced-motion:reduce){#' + MODAL_ID + ' .sk-sheet{scroll-behavior:auto}}',
      'html.sk-pdp-lock,html.sk-pdp-lock body{overflow:hidden}',
    ].join('');
  }

  function injectStyles() {
    var style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }
    var css = cssText();
    if (style.textContent !== css) style.textContent = css;
  }

  function isProductPage() {
    try {
      if (window.salla && salla.config && typeof salla.config.get === 'function') {
        var page = salla.config.get('page');
        if (page && page.slug) return page.slug === 'product.single';
      }
    } catch (error) {
      /* ignore */
    }
    return /\/p\d+(?:\/|$|\?)/.test(window.location.pathname);
  }

  function pageCategoryIds() {
    var ids = [];
    function push(value) {
      var id = String(value || '').replace(/^c/i, '');
      if (/^\d+$/.test(id) && ids.indexOf(id) === -1) ids.push(id);
    }
    function pushHref(href) {
      var match = String(href || '').match(/c(\d+)/);
      if (match) push(match[1]);
    }
    pushHref(location.href);
    try {
      if (window.salla && salla.config && typeof salla.config.get === 'function') {
        var page = salla.config.get('page');
        var node = page;
        var guard = 0;
        while (node && guard < 6) {
          pushHref(node.url || '');
          node = node.parent;
          guard += 1;
        }
        var product = salla.config.get('product');
        var cats = (product && (product.categories || product.category)) || [];
        if (!Array.isArray(cats) && cats) cats = [cats];
        (cats || []).forEach(function (cat) {
          if (!cat) return;
          if (typeof cat === 'object') push(cat.id || cat.category_id);
          else push(cat);
        });
      }
    } catch (error) {
      /* ignore */
    }
    Array.prototype.forEach.call(
      document.querySelectorAll('.breadcrumb a[href*="/c"], nav.breadcrumb a[href*="/c"], .breadcrumbs a[href*="/c"]'),
      function (link) {
        pushHref(link.href);
      }
    );
    return ids;
  }

  function sizeFinderAllowed() {
    // Existing explicitly configured categories remain supported.
    var allowed = Array.isArray(CONFIG.showOnCategoryIds) ? CONFIG.showOnCategoryIds : [];
    var pageIds = pageCategoryIds();
    if (allowed.some(function (id) { return pageIds.indexOf(String(id)) !== -1; })) return true;

    // New categories need no dashboard entry when their actual Salla options
    // contain a thobe-length (e.g. 58/60) AND a width (e.g. M/XL) selector.
    if (CONFIG.autoDetectSizeFinder === false) return false;
    var options = readOptions();
    var length = options.some(function (option) {
      return /(?:طول|length)/i.test(fold(option.name)) &&
        (option.details || []).some(function (detail) { return /^(?:5[0-9]|6[0-6])$/.test(normalizeToken(detail.name)); });
    });
    var width = options.some(function (option) {
      return /(?:عرض|width)/i.test(fold(option.name)) &&
        (option.details || []).some(function (detail) { return /^(?:S|M|L|XL|XXL|2XL)$/i.test(normalizeToken(detail.name)); });
    });
    return length && width;
  }

  function decodeAttr(raw) {
    return String(raw || '')
      .replace(/&quot;/g, '"')
      .replace(/&#0?39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
  }

  function readOptions() {
    var el = document.querySelector('salla-product-options');
    if (!el) return [];
    if (Array.isArray(el.options) && el.options.length) return el.options;
    var raw = el.getAttribute('options');
    if (!raw) return [];
    try {
      var parsed = JSON.parse(decodeAttr(raw));
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function optionKind(option) {
    var name = fold(option && option.name);
    if (/ياقه|رقبه|neck|yaga|yaka|collar/.test(name)) return 'neck';
    var details = (option && option.details) || [];
    var numbers = 0;
    var letters = 0;
    details.forEach(function (detail) {
      var token = normalizeToken(detail && detail.name);
      if (/^\d+$/.test(token)) numbers += 1;
      else if (LETTER_ORDER.indexOf(token) !== -1 || token.indexOf('/') !== -1) letters += 1;
    });
    if (/طول|length|height/.test(name) && numbers >= letters) return 'length';
    if (/عرض|width/.test(name) && letters >= numbers) return 'width';
    if (numbers > letters && numbers > 0) return 'length';
    if (letters > numbers && letters > 0) return 'width';
    if (/مقاس|قياس|size/.test(name)) return letters ? 'width' : numbers ? 'length' : 'size';
    return '';
  }

  function normalizeToken(value) {
    var text = fold(value).replace(/\s+/g, '').toUpperCase();
    text = text.replace(/٢XL/g, '2XL').replace(/٣XL/g, '3XL');
    if (text === '2XL' || text === 'XX-L') return 'XXL';
    if (text === '3XL' || text === 'XXX-L') return 'XXXL';
    if (text === '4XL') return 'XXXXL';
    return text;
  }

  function tokensOf(value) {
    return normalizeToken(value)
      .split(/[^A-Z0-9]+/)
      .filter(Boolean)
      .map(function (part) {
        if (part === '2XL') return 'XXL';
        if (part === '3XL') return 'XXXL';
        return part;
      });
  }

  function letterRank(value) {
    var tokens = tokensOf(value);
    var best = 99;
    tokens.forEach(function (token) {
      var index = LETTER_ORDER.indexOf(token);
      if (index !== -1 && index < best) best = index;
    });
    return best;
  }

  function containerFor(option) {
    if (!option || option.id == null) return null;
    return document.querySelector('.s-product-options-option-container[data-option-id="' + option.id + '"]');
  }

  function decorateOptions() {
    var options = readOptions();
    var roles = [];
    options.forEach(function (option) {
      var container = containerFor(option);
      if (!container) return;
      if (isColorOption(option)) return;
      var kind = optionKind(option);
      if (!kind) return;
      container.classList.add('sk-opt', 'sk-opt--' + kind);
      container.setAttribute('data-sk-role', kind);
      roles.push({ kind: kind, option: option, container: container });
      // Salla owns these nodes, labels and availability. Only add styling hooks.
    });
    ensureSizeHead(roles);
    ensureStock(roles);
    return roles;
  }

  function bundleAnchor() {
    return document.querySelector(
      '[data-widget-name="widget-bundle-style-1"], .zudapp-widget__bundle-style-1__container, .sk-zud-on'
    );
  }

  function ensureSizeHead(roles) {
    var existing = document.getElementById(SIZE_HEAD_ID);
    var hasLength = roles.some(function (role) { return role.kind === 'length'; });
    var hasWidth = roles.some(function (role) { return role.kind === 'width'; });
    // Height + shirt matrix only fits thobes that expose both length and width,
    // and only on the allowed categories (not shemagh / shoes / kids, etc.).
    if (!hasLength || !hasWidth || CONFIG.enableSizeFinder === false || !sizeFinderAllowed()) {
      if (existing) existing.remove();
      return;
    }
    var optionsEl = document.querySelector('salla-product-options');
    var anchor = bundleAnchor() || optionsEl;
    if (!anchor || !anchor.parentNode) return;
    if (!existing) {
      existing = document.createElement('div');
      existing.id = SIZE_HEAD_ID;
      existing.className = 'sk-size-head';
      existing.innerHTML = '<span></span><button type="button" class="sk-find"></button>';
      existing.querySelector('button').addEventListener('click', function () {
        openModal();
      });
    }
    var title = existing.querySelector('span');
    var button = existing.querySelector('button');
    if (title.textContent !== t('size')) title.textContent = t('size');
    if (button.textContent !== t('find')) button.textContent = t('find');
    existing.style.removeProperty('display');
    if (existing.nextElementSibling !== anchor) anchor.parentNode.insertBefore(existing, anchor);
  }

  function productIsOut(roles) {
    var flag = document.querySelector('.product-form .out-of-stock, .details .out-of-stock');
    if (flag && !flag.classList.contains('hidden')) return true;
    var sizeDetails = [];
    (roles || []).forEach(function (role) {
      if (role.kind === 'neck') return;
      (role.option.details || []).forEach(function (detail) {
        sizeDetails.push(detail);
      });
    });
    if (!sizeDetails.length) return false;
    return sizeDetails.every(function (detail) {
      return detail && detail.is_out;
    });
  }

  function isMoneyText(text) {
    var value = String(text || '').replace(/\s+/g, ' ').trim();
    if (!value || value.length > 80) return false;
    if (!/\d/.test(value)) return false;
    return /(?:EGP|SAR|USD|AED|ر\.?\s*س|ج\.?\s*م|ريال)/i.test(value);
  }

  function isShown(el) {
    if (!el) return false;
    var style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  function stockAnchor() {
    var tested = document.querySelector('[data-testid="store-product-price"]');
    if (
      tested &&
      isShown(tested) &&
      !tested.closest('form.product-form, .sticky-product-bar, [data-widget-name="widget-bundle-style-1"]')
    ) {
      return tested;
    }

    var title = document.querySelector('[data-testid="store-product-title"], .main-content h1, h1');
    var options = document.querySelector('salla-product-options');
    if (!title) return null;

    var root = title.parentElement;
    while (root && options && !root.contains(options) && root.parentElement) root = root.parentElement;
    if (!root) return null;

    var nodes = root.querySelectorAll('h2, h3, h4, p, div, span, b, strong, salla-price');
    var best = null;
    for (var i = 0; i < nodes.length; i += 1) {
      var el = nodes[i];
      if (!el || el.id === STOCK_ID || el.closest('#' + STOCK_ID)) continue;
      if (!(title.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)) continue;
      if (options && (el === options || el.contains(options) || options.contains(el))) continue;
      if (el.closest('form.product-form, .sticky-product-bar, [data-widget-name="widget-bundle-style-1"], salla-product-options')) continue;
      if (!isShown(el)) continue;
      if (!isMoneyText(el.innerText || el.textContent)) continue;
      best = el;
      break;
    }
    if (!best) return null;

    var parent = best.parentElement;
    while (parent && parent !== root && parent !== title.parentElement) {
      if (options && parent.contains(options)) break;
      if (!isMoneyText(parent.innerText || parent.textContent)) break;
      best = parent;
      parent = parent.parentElement;
    }
    return best;
  }

  function ensureStock(roles) {
    var anchor = stockAnchor();
    if (!anchor) return;
    var stock = document.getElementById(STOCK_ID);
    if (!stock) {
      stock = document.createElement('p');
      stock.id = STOCK_ID;
    }
    var out = productIsOut(roles);
    stock.className = out ? 'is-out' : 'is-in';
    var text = out ? t('outStock') : t('inStock');
    if (stock.textContent !== text) stock.textContent = text;
    stock.style.removeProperty('display');
    if (stock.previousElementSibling !== anchor) anchor.insertAdjacentElement('afterend', stock);
  }

  function isColorOption(option) {
    var type = String((option && (option.type || option.display_type)) || '').toLowerCase();
    if (type === 'color' || type === 'colors') return true;
    var name = fold(option && option.name).replace(/\s+/g, '');
    return name === 'اللون' || name === 'لون' || name === 'لونالقماش' || name === 'color' || name === 'colour' ||
      name === 'fabriccolor' || name === 'fabriccolour' || name === 'productcolor' || name === 'productcolour';
  }

  function optionByKind(kind) {
    var options = readOptions();
    for (var i = 0; i < options.length; i += 1) {
      if (optionKind(options[i]) === kind) return options[i];
    }
    return null;
  }

  function pickDetail(option, wanted, kind) {
    var details = (option && option.details) || [];
    if (!details.length || !wanted) return null;
    var inStock = details.filter(function (detail) {
      return detail && !detail.is_out;
    });
    var pool = inStock.length ? inStock : details;
    var target = normalizeToken(wanted);

    if (kind === 'length') {
      var exact = null;
      pool.forEach(function (detail) {
        if (normalizeToken(detail.name) === target) exact = detail;
      });
      if (exact) return { detail: exact, available: !exact.is_out };
      var number = parseInt(target, 10);
      var best = null;
      var bestDist = Infinity;
      pool.forEach(function (detail) {
        var value = parseInt(detail.name, 10);
        if (!isFinite(value)) return;
        var dist = Math.abs(value - number);
        if (dist < bestDist) {
          bestDist = dist;
          best = detail;
        }
      });
      return best ? { detail: best, available: !best.is_out } : null;
    }

    var tokenHit = null;
    pool.forEach(function (detail) {
      if (tokenHit) return;
      if (tokensOf(detail.name).indexOf(target) !== -1) tokenHit = detail;
    });
    if (tokenHit) return { detail: tokenHit, available: !tokenHit.is_out };

    var rank = LETTER_ORDER.indexOf(target);
    var nearest = null;
    var nearestDist = 99;
    pool.forEach(function (detail) {
      var detailRank = letterRank(detail.name);
      if (detailRank === 99) return;
      var dist = Math.abs(detailRank - rank);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = detail;
      }
    });
    return nearest ? { detail: nearest, available: !nearest.is_out } : null;
  }

  function selectDetail(option, detail) {
    if (!option || !detail) return false;
    var name = 'options[' + option.id + ']';
    var radio = document.querySelector('input[type="radio"][name="' + name + '"][value="' + detail.id + '"]');
    var applied = false;
    if (radio) {
      if (radio.disabled) return false;
      // Let the browser change checked and emit input/change exactly once.
      if (!radio.checked) radio.click();
      applied = radio.checked;
    } else {
      var select = document.querySelector('select[name="' + name + '"]');
      if (select && !select.disabled) {
        var choice = select.querySelector('option[value="' + detail.id + '"]');
        if (!choice || choice.disabled) return false;
        select.value = String(detail.id);
        select.dispatchEvent(new Event('change', { bubbles: true }));
        applied = true;
      }
    }
    if (applied) syncOpenBundlePiece(option, detail);
    return applied;
  }

  function syncOpenBundlePiece(option, detail) {
    var piece = document.querySelector('.sk-zud-piece.is-open') || document.querySelector('.sk-zud-piece');
    if (!piece || !piece._skSelects) return;
    Array.prototype.forEach.call(piece._skSelects, function (bundleSelect) {
      if (String(bundleSelect.getAttribute('data-option-id')) !== String(option.id)) return;
      var match = bundleSelect.querySelector('option[value="' + detail.id + '"]');
      if (!match || match.disabled) return;
      piece.setAttribute('data-sk-touched', '1');
      if (String(bundleSelect.value) === String(detail.id)) return;
      bundleSelect.value = String(detail.id);
      bundleSelect.dispatchEvent(new Event('input', { bubbles: true }));
      bundleSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  function recommendation() {
    var row = (CONFIG.matrix[ui.height] || {})[ui.shirt];
    if (!row) return null;
    var lengthWanted = row[0];
    var widthWanted = row[1];
    var lengthOption = optionByKind('length');
    var widthOption = optionByKind('width');
    var parts = [];
    var picks = [];
    var available = true;

    if (lengthOption) {
      var lengthPick = pickDetail(lengthOption, lengthWanted, 'length');
      if (lengthPick) {
        parts.push({ name: lengthOption.name, value: lengthPick.detail.name });
        picks.push({ option: lengthOption, detail: lengthPick.detail });
        if (lengthPick.detail.is_out) available = false;
      }
    }
    if (widthOption && widthOption !== lengthOption) {
      var widthPick = pickDetail(widthOption, widthWanted, 'width');
      if (widthPick) {
        parts.push({ name: widthOption.name, value: widthPick.detail.name });
        picks.push({ option: widthOption, detail: widthPick.detail });
        if (widthPick.detail.is_out) available = false;
      }
    }
    if (!parts.length) return null;
    return {
      parts: parts,
      picks: picks,
      available: available,
      label: parts
        .map(function (part) {
          return part.name + ' ' + part.value;
        })
        .join(' · '),
    };
  }

  function choiceButtons(items, pressedId, attr) {
    return items
      .map(function (item) {
        var id = typeof item === 'string' ? item : item.id;
        var label = typeof item === 'string' ? item : detectLang() === 'en' ? item.en : item.ar;
        return (
          '<button type="button" class="sk-choice" ' +
          attr +
          '="' +
          escapeHtml(id) +
          '" aria-pressed="' +
          (id === pressedId ? 'true' : 'false') +
          '">' +
          escapeHtml(label) +
          '</button>'
        );
      })
      .join('');
  }

  function chartRows() {
    var rows = [];
    CONFIG.heightBands.forEach(function (band) {
      var line = CONFIG.matrix[band.id] || {};
      CONFIG.shirtSizes.forEach(function (size) {
        var cell = line[size];
        if (!cell) return;
        rows.push({
          height: detectLang() === 'en' ? band.en : band.ar,
          shirt: size,
          length: cell[0],
          width: cell[1] === 'XXL' ? '2XL' : cell[1],
        });
      });
    });
    return rows;
  }

  function renderModal() {
    var overlay = document.getElementById(MODAL_ID);
    if (!overlay) return;
    var sheet = overlay.querySelector('.sk-sheet');
    var result = ui.height && ui.shirt ? recommendation() : null;
    var body = '';
    if (ui.view === 'chart') {
      var rows = chartRows()
        .map(function (row) {
          return (
            '<tr><td>' +
            escapeHtml(row.height) +
            '</td><td>' +
            escapeHtml(row.shirt) +
            '</td><td>' +
            escapeHtml(row.length) +
            '</td><td>' +
            escapeHtml(row.width) +
            '</td></tr>'
          );
        })
        .join('');
      body =
        '<div class="sk-table-wrap"><table><thead><tr><th>' +
        escapeHtml(t('youCol')) +
        '</th><th>' +
        escapeHtml(t('shirtCol')) +
        '</th><th>' +
        escapeHtml(t('lengthCol')) +
        '</th><th>' +
        escapeHtml(t('widthCol')) +
        '</th></tr></thead><tbody>' +
        rows +
        '</tbody></table></div><button type="button" class="sk-chart-btn" data-sk="finder">' +
        escapeHtml(t('back')) +
        '</button>';
    } else {
      body =
        '<p class="sk-sub">' +
        escapeHtml(t('sub')) +
        '</p><div class="sk-q"><p id="sk-pdp-height-label">' +
        escapeHtml(t('height')) +
        '</p><div class="sk-choices" data-count="3" role="group" aria-labelledby="sk-pdp-height-label">' +
        choiceButtons(CONFIG.heightBands, ui.height, 'data-height') +
        '</div></div><div class="sk-q"><p id="sk-pdp-shirt-label">' +
        escapeHtml(t('shirt')) +
        '</p><div class="sk-choices" data-count="5" role="group" aria-labelledby="sk-pdp-shirt-label">' +
        choiceButtons(CONFIG.shirtSizes, ui.shirt, 'data-shirt') +
        '</div></div>' +
        (result
          ? '<div class="sk-rec" aria-live="polite"><p class="sk-rec__k">' +
            escapeHtml(t('recommend')) +
            '</p><p class="sk-rec__v">' +
            escapeHtml(result.label) +
            '</p><p class="sk-rec__s' +
            (result.available ? '' : ' is-out') +
            '">' +
            escapeHtml(result.available ? t('inThis') : t('outThis')) +
            '</p></div>'
          : '') +
        '<button type="button" class="sk-use" data-sk="use"' +
        (result ? '' : ' disabled') +
        '>' +
        escapeHtml(t('use')) +
        '</button><button type="button" class="sk-chart-btn" data-sk="chart">' +
        escapeHtml(t('chart')) +
        '</button>';
    }

    sheet.innerHTML =
      '<div class="sk-sheet-head"><h2 id="sk-pdp-title">' +
      escapeHtml(ui.view === 'chart' ? t('chartTitle') : t('title')) +
      '</h2><button type="button" class="sk-x" data-sk="close" aria-label="' +
      escapeHtml(t('close')) +
      '"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      body;
    var closeBtn = sheet.querySelector('.sk-x');
    if (closeBtn) closeBtn.focus();
  }

  function ensureModal() {
    var overlay = document.getElementById(MODAL_ID);
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = MODAL_ID;
    overlay.hidden = true;
    overlay.innerHTML = '<div class="sk-sheet" role="dialog" aria-modal="true" aria-labelledby="sk-pdp-title"></div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay || event.target.closest('[data-sk="close"]')) {
        closeModal();
        return;
      }
      var heightBtn = event.target.closest('[data-height]');
      if (heightBtn) {
        ui.height = heightBtn.getAttribute('data-height');
        storeFinder();
        renderModal();
        return;
      }
      var shirtBtn = event.target.closest('[data-shirt]');
      if (shirtBtn) {
        ui.shirt = shirtBtn.getAttribute('data-shirt');
        storeFinder();
        renderModal();
        return;
      }
      if (event.target.closest('[data-sk="chart"]')) {
        ui.view = 'chart';
        renderModal();
        return;
      }
      if (event.target.closest('[data-sk="finder"]')) {
        ui.view = 'finder';
        renderModal();
        return;
      }
      if (event.target.closest('[data-sk="use"]')) applyRecommendation();
    });
    overlay.addEventListener('keydown', function (event) {
      var group = event.target.closest('.sk-choices');
      if (!group) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      var buttons = Array.prototype.slice.call(group.querySelectorAll('button'));
      var index = buttons.indexOf(document.activeElement);
      if (index < 0) return;
      event.preventDefault();
      var dir = event.key === 'ArrowRight' ? 1 : -1;
      if (document.documentElement.getAttribute('dir') === 'rtl') dir = -dir;
      buttons[(index + dir + buttons.length) % buttons.length].focus();
    });
    return overlay;
  }

  // length and width let category-filters.js put this customer's size first.
  function finderRecord(height, shirt) {
    var record = { height: height, shirt: shirt };
    var row = (CONFIG.matrix[height] || {})[shirt];
    if (row) {
      record.length = row[0];
      record.width = row[1];
    }
    return record;
  }

  function storeFinder() {
    try {
      window.localStorage.setItem(FINDER_KEY, JSON.stringify(finderRecord(ui.height, ui.shirt)));
      // Using the finder again turns the category «مقاسك أولاً» order back on.
      window.localStorage.removeItem(MY_SIZE_OFF_KEY);
    } catch (error) {
      /* private mode */
    }
  }

  // Saves from before length/width were stored only have height and shirt.
  function upgradeStoredFinder() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(FINDER_KEY) || '{}');
      if (!saved.height || !saved.shirt || saved.length) return;
      window.localStorage.setItem(FINDER_KEY, JSON.stringify(finderRecord(saved.height, saved.shirt)));
    } catch (error) {
      /* private mode */
    }
  }

  function restoreFinder() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(FINDER_KEY) || '{}');
      ui.height = saved.height || '';
      ui.shirt = saved.shirt || '';
    } catch (error) {
      ui.height = '';
      ui.shirt = '';
    }
  }

  function openModal() {
    if (CONFIG.enableSizeFinder === false) return;
    injectStyles();
    restoreFinder();
    ui.view = 'finder';
    ui.lastFocus = document.activeElement;
    var overlay = ensureModal();
    renderModal();
    overlay.hidden = false;
    document.documentElement.classList.add('sk-pdp-lock');
  }

  function closeModal() {
    var overlay = document.getElementById(MODAL_ID);
    if (overlay) overlay.hidden = true;
    document.documentElement.classList.remove('sk-pdp-lock');
    if (ui.lastFocus && typeof ui.lastFocus.focus === 'function') {
      try {
        ui.lastFocus.focus();
      } catch (error) {
        /* replaced node */
      }
    }
  }

  function applyRecommendation() {
    var result = recommendation();
    if (!result) return;
    storeFinder();
    result.picks.forEach(function (pick) {
      selectDetail(pick.option, pick.detail);
    });
    decorateOptions();
    closeModal();
  }

  function hideNativeGuide() {
    ['section:has(salla-product-size-guide)', 'salla-button[onclick*="size-guide::open"]'].forEach(function (selector) {
      try {
        document.querySelectorAll(selector).forEach(function (node) {
          node.style.display = 'none';
        });
      } catch (error) {
        /* ignore */
      }
    });
  }

  function refresh() {
    if (!isProductPage()) {
      teardown();
      return;
    }
    document.body.classList.add('sk-pdp-on');
    injectStyles();
    hideNativeGuide();
    // Opening a page must not select variants or trigger native validation.
    decorateOptions();
  }

  function teardown() {
    document.body.classList.remove('sk-pdp-on');
    [STOCK_ID, SIZE_HEAD_ID].forEach(function (id) {
      var node = document.getElementById(id);
      if (node) node.remove();
    });
    closeModal();
  }

  var booting = false;
  function boot() {
    if (booting) return;
    booting = true;
    try {
      refresh();
    } finally {
      booting = false;
    }
  }

  var bootTimer = null;
  function schedule() {
    if (bootTimer) return;
    bootTimer = setTimeout(function () {
      bootTimer = null;
      boot();
    }, 60);
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeModal();
  });

  function start() {
    schedule();
    if (window.salla && typeof salla.onReady === 'function') {
      salla.onReady().then(function () {
        schedule();
        var tries = 0;
        var timer = setInterval(function () {
          tries += 1;
          boot();
          if (tries > 20 || document.getElementById(SIZE_HEAD_ID) || document.getElementById(STOCK_ID)) {
            clearInterval(timer);
          }
        }, 200);
      });
    }
    if (window.salla && salla.event && typeof salla.event.on === 'function') {
      salla.event.on('page::loaded', function () {
        schedule();
      });
    }
  }

  var observer = new MutationObserver(function (records) {
    var selector = 'salla-product-options, [data-testid="store-product-price"], [data-testid="store-product-title"], h1, .out-of-stock';
    for (var i = 0; i < records.length; i++) {
      var target = records[i].target;
      if (target.nodeType === 3) target = target.parentElement;
      if (target && target.closest && target.closest(selector)) {
        schedule();
        return;
      }
      var nodes = Array.prototype.slice.call(records[i].addedNodes).concat(Array.prototype.slice.call(records[i].removedNodes));
      for (var j = 0; j < nodes.length; j++) {
        var node = nodes[j];
        if (node.nodeType === 1 && (node.matches(selector) || node.querySelector(selector))) {
          schedule();
          return;
        }
      }
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['options', 'product-id'] });

  upgradeStoredFinder();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  window.SheyakaProductOptions = {
    open: openModal,
    close: closeModal,
    recommend: recommendation,
  };
})();
