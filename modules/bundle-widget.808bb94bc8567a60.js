/* Alshiaka module: bundle-widget */
window.__SHEYAKA_CONFIGS__ = window.__SHEYAKA_CONFIGS__ || {};
window.__SHEYAKA_CONFIGS__["bundle-widget"] = {
  "selectedBorder": "#17161A",
  "border": "#E8E4DC",
  "saveColor": "#15803D",
  "radius": 12
};
/**
 * Sheyaka — restyle ZudApp "buy more, save more" cards.
 * Layout/CSS + piece accordion. ZudApp no longer prints option selects inside
 * the offer; add to cart opens its native options popup. We rebuild those
 * selects for the accordion, and when the popup opens we fill it from the
 * accordion and confirm it without showing it. A tier whose compare-at price
 * is not unit × quantity is rewritten from the unit price the other tiers agree on.
 */
(function () {
  'use strict';

  if (window.__skZudBundle) return;
  window.__skZudBundle = true;

  var CONFIG = {
    selectedBorder: '#17161A',
    border: '#E8E4DC',
    saveColor: '#15803D',
    radius: 12,
    i18n: {
      yourPieces: { ar: 'قطعك الـ {{n}}', en: 'Your {{n}} pieces' },
      chosenProgress: { ar: '{{x}} من {{n}} مختارة', en: '{{x}} of {{n}} chosen' },
      helper: {
        ar: 'أي لون، أي مقاس — كل قطعة باختيارك.',
        en: 'Any colour, any size — each one is up to you.',
      },
      pickAnything: { ar: 'اختَر ما يعجبك', en: 'Pick anything you like' },
      edit: { ar: 'تعديل', en: 'Edit' },
      ready: { ar: 'متوفر', en: 'in stock' },
      savePercent: { ar: 'وفّر {{value}}%', en: 'Save {{value}}%' },
      saveAmount: { ar: 'وفّر {{value}}', en: 'Save {{value}}' },
      needChoice: {
        ar: 'اختَر المقاس لكل قطعة، وبعدين أضف للسلة.',
        en: 'Choose a size for each piece, then add to cart.',
      },
    },
  };

  function applySheyakaConfig(config, slug) {
    var bag = window.__SHEYAKA_CONFIGS__;
    var remote = bag && bag[slug];
    if (!remote || typeof remote !== 'object' || Array.isArray(remote)) return;
    Object.keys(remote).forEach(function (key) {
      if (
        key === 'i18n' &&
        remote.i18n &&
        typeof remote.i18n === 'object' &&
        !Array.isArray(remote.i18n)
      ) {
        config.i18n = config.i18n || {};
        Object.keys(remote.i18n).forEach(function (k) {
          config.i18n[k] = remote.i18n[k];
        });
        return;
      }
      config[key] = remote[key];
    });
  }
  applySheyakaConfig(CONFIG, 'bundle-widget');

  var STYLE_ID = 'sk-zud-bundle-style';
  var CLASS_ON = 'sk-zud-on';
  var WIDGET_SEL =
    '[data-widget-name="widget-bundle-style-1"], .zudapp-widget__bundle-style-1__container';
  var COLOR_OPTION_RE = /لون|colour|color/i;
  var COLOR_HEX = {
    white: '#FFFFFF',
    offwhite: '#F5F0E6',
    cream: '#E8D9C0',
    beige: '#D9C4A5',
    ivory: '#FFFFF0',
    black: '#111111',
    navy: '#1B2A4A',
    blue: '#2563EB',
    gray: '#9CA3AF',
    grey: '#9CA3AF',
    green: '#166534',
    red: '#B91C1C',
    brown: '#7C4A2D',
    gold: '#C9A227',
    أبيض: '#FFFFFF',
    ابيض: '#FFFFFF',
    كريمي: '#E8D9C0',
    بيج: '#D9C4A5',
    أسود: '#111111',
    اسود: '#111111',
    كحلي: '#1B2A4A',
    أزرق: '#2563EB',
    ازرق: '#2563EB',
    رمادي: '#9CA3AF',
    أخضر: '#166534',
    اخضر: '#166534',
    أحمر: '#B91C1C',
    احمر: '#B91C1C',
    بني: '#7C4A2D',
    ذهبي: '#C9A227',
  };

  function detectLang(widget) {
    var locale = (widget && widget.getAttribute('data-locale')) || '';
    if (/^ar/i.test(locale)) return 'ar';
    if (/^en/i.test(locale)) return 'en';
    var html = document.documentElement;
    var lang =
      html.getAttribute('lang') ||
      (document.body && document.body.getAttribute('lang')) ||
      '';
    if (/^ar/i.test(lang)) return 'ar';
    if (/^en/i.test(lang)) return 'en';
    var dir =
      (widget && widget.getAttribute('dir')) ||
      html.getAttribute('dir') ||
      (document.body && document.body.getAttribute('dir')) ||
      '';
    return String(dir).toLowerCase() === 'ltr' ? 'en' : 'ar';
  }

  function t(value, lang, vars) {
    var text = '';
    if (value && typeof value === 'object') {
      text = value[lang] || value.ar || value.en || '';
    } else {
      text = value || '';
    }
    if (vars) {
      Object.keys(vars).forEach(function (key) {
        text = text.replace(new RegExp('\\{\\{' + key + '\\}\\}', 'g'), String(vars[key]));
      });
    }
    return text;
  }

  var extraRoots = [];
  var rootsDiscovered = false;
  var knownRoots = new WeakMap();

  function discoverRoots(node) {
    var discovered = false;
    function inspect(element) {
      var root = element.shadowRoot || knownRoots.get(element);
      if (!root || extraRoots.indexOf(root) !== -1) return;
      watchRoot(root);
      discovered = true;
      discoverRoots(root);
    }
    if (node.nodeType === 1) inspect(node);
    if (node.querySelectorAll) Array.prototype.forEach.call(node.querySelectorAll('*'), inspect);
    return discovered;
  }

  function eachRoot(fn) {
    if (!rootsDiscovered) {
      rootsDiscovered = true;
      discoverRoots(document);
    }
    fn(document);
    extraRoots = extraRoots.filter(function (root) { return root.host && root.host.isConnected; });
    extraRoots.forEach(fn);
  }

  function queryDeep(selector) {
    var found = null;
    eachRoot(function (root) {
      if (found || !root.querySelector) return;
      found = root.querySelector(selector);
    });
    return found;
  }

  function queryDeepAll(selector) {
    var out = [];
    eachRoot(function (root) {
      if (!root.querySelectorAll) return;
      Array.prototype.forEach.call(root.querySelectorAll(selector), function (el) {
        out.push(el);
      });
    });
    return out;
  }

  function widgets() {
    return queryDeepAll(WIDGET_SEL);
  }

  var GALLERY_IMAGE_SELS = [
    'salla-slider.details-slider img',
    '.details-slider img',
    '.image-slider img',
    '.product-single .product-images img',
    '.s-product-details-slider img',
    '.product-details__image img',
    '.product-images img',
    '.s-product-cover img',
    '[data-product-image] img',
    '.main-image img',
  ];

  var FOREIGN_IMAGE_SEL = [
    'salla-product-card',
    '.s-product-card',
    'salla-products-list',
    '.s-products-list',
    '.s-products-slider',
    'header',
    'footer',
    'nav',
    '.sk-zud-piece',
    '.sk-zud-opts-host',
  ].join(', ');

  function isForeignImage(node) {
    var current = node;
    while (current) {
      if (current.closest && current.closest(FOREIGN_IMAGE_SEL)) return true;
      var root = current.getRootNode && current.getRootNode();
      if (!root || root === document || root === current) break;
      current = root.host || null;
    }
    return false;
  }

  function usableImageUrl(img) {
    if (!img || !img.tagName || img.tagName !== 'IMG') return '';
    var src = String(img.getAttribute('src') || '').trim();
    var lazy = String(
      img.getAttribute('data-src') ||
        img.getAttribute('data-lazy-src') ||
        img.getAttribute('data-splide-lazy') ||
        ''
    ).trim();
    if (!src || /placeholder|spinner|loader|data:image|blank/i.test(src)) src = lazy;
    if (!src || /^(data:|blob:|#)/.test(src)) return '';
    if (/loader|spinner|placeholder|tax\.png|payment|logo|icon|favicon|sprite/i.test(src)) return '';
    return img.currentSrc || img.src || src;
  }

  function imageFromMeta() {
    var og = document.querySelector('meta[property="og:image"], meta[name="twitter:image"]');
    var src = og && String(og.getAttribute('content') || '').trim();
    if (!src || /logo|icon|favicon|placeholder|spinner/i.test(src)) return '';
    return src;
  }

  function ldImageUrl(image) {
    if (!image) return '';
    if (typeof image === 'string') return image;
    if (Array.isArray(image)) return ldImageUrl(image[0]);
    if (typeof image === 'object') return image.url || image.contentUrl || '';
    return '';
  }

  function productLdImage(data) {
    if (!data) return '';
    if (Array.isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        var found = productLdImage(data[i]);
        if (found) return found;
      }
      return '';
    }
    if (data['@graph']) return productLdImage(data['@graph']);
    var type = data['@type'];
    var types = Array.isArray(type) ? type.join(' ') : String(type || '');
    if (types.indexOf('Product') === -1) return '';
    var src = String(ldImageUrl(data.image) || '').trim();
    if (!src || /logo|icon|favicon|placeholder/i.test(src)) return '';
    return src;
  }

  function imageFromJsonLd() {
    var nodes = document.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < nodes.length; i++) {
      var data;
      try {
        data = JSON.parse(nodes[i].textContent || '');
      } catch (err) {
        continue;
      }
      var src = productLdImage(data);
      if (src) return src;
    }
    return '';
  }

  function productImage() {
    for (var s = 0; s < GALLERY_IMAGE_SELS.length; s++) {
      var imgs = queryDeepAll(GALLERY_IMAGE_SELS[s]);
      for (var i = 0; i < imgs.length; i++) {
        if (isForeignImage(imgs[i])) continue;
        var src = usableImageUrl(imgs[i]);
        if (src) return src;
      }
    }
    return imageFromMeta() || imageFromJsonLd() || '';
  }

  function injectStyles(root) {
    var parent = !root || root === document ? document.body || document.head : root;
    if (!parent || !parent.appendChild) return;
    var style = parent.querySelector ? parent.querySelector('#' + STYLE_ID) : null;
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
    }
    var radius = Number(CONFIG.radius) || 12;
    var selected = String(CONFIG.selectedBorder || '#17161A');
    var border = String(CONFIG.border || '#E8E4DC');
    var save = String(CONFIG.saveColor || '#15803D');
    var css = [
      '.' + CLASS_ON + '{',
      '--sk-zud-border:' + border + ';',
      '--sk-zud-selected:' + selected + ';',
      '--sk-zud-save:' + save + ';',
      '--sk-zud-radius:' + radius + 'px;',
      '--background-color:#fff;',
      '--active-background-color:#fff;',
      '--border-color:var(--sk-zud-border);',
      '--active-border-color:var(--sk-zud-selected);',
      '--discount-color:var(--sk-zud-save);',
      '--discount-background-color:transparent;',
      '--price-color:#17161A;',
      '--old-price-color:#9CA3AF;',
      '--title-color:#17161A;',
      '--title-font-size:1.125rem;',
      '--title-font-weight:700;',
      '--title-text-align:start;',
      '--copy-color:#8C877F;',
      '--copy-font-size:0.8125rem;',
      '--offer-title-color:#17161A;',
      '--offer-title-font-size:1.25rem;',
      '--offer-title-font-weight:700;',
      '--offer-subtitle-color:#8C877F;',
      '--offer-subtitle-font-size:0.75rem;',
      '--offer-subtitle-font-weight:500;',
      'font-family:inherit;',
      'max-width:100%;',
      'margin:8px 0 20px;',
      '}',
      '.' + CLASS_ON + ' > div:has(.zudapp-widget__bundle-style-1__title){',
      'display:flex;',
      'align-items:baseline;',
      'justify-content:space-between;',
      'gap:12px;',
      'margin:0 0 12px;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__title,',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__title *{',
      'margin:0 !important;',
      'color:#17161A !important;',
      'font-size:1.125rem !important;',
      'font-weight:700 !important;',
      'line-height:1.3 !important;',
      'text-align:start !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__copy{',
      'display:none !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__fieldset,',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__fieldset.--layout-card{',
      'display:grid !important;',
      'grid-template-columns:repeat(var(--sk-zud-cols, 3),minmax(0,1fr));',
      'gap:10px;',
      'border:0 !important;',
      'margin:0 !important;',
      'padding:0 !important;',
      'min-inline-size:0;',
      'position:relative !important;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-opts-host{',
      'display:block;',
      'width:100%;',
      'margin:18px 0 8px;',
      'padding:0;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-summary{',
      'margin:0 0 12px;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-summary__row{',
      'display:flex;',
      'align-items:baseline;',
      'justify-content:space-between;',
      'gap:12px;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-summary__title{',
      'margin:0;',
      'color:#17161A;',
      'font-size:1rem;',
      'font-weight:700;',
      'line-height:1.3;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-summary__progress{',
      'color:#9CA3AF;',
      'font-size:0.8125rem;',
      'font-weight:500;',
      'white-space:nowrap;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-summary__hint{',
      'margin:4px 0 0;',
      'color:#9CA3AF;',
      'font-size:0.8125rem;',
      'font-weight:400;',
      'line-height:1.4;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-summary__hint.is-alert{',
      'color:#B91C1C;',
      'font-weight:600;',
      '}',
      '.' + CLASS_ON + ' .zud-options-badge{',
      'display:none !important;',
      '}',
      'body.sk-zud-autocart .zud-native-options-overlay,',
      '.zud-native-options-overlay.sk-zud-overlay-hidden{',
      'visibility:hidden !important;',
      'opacity:0 !important;',
      'pointer-events:none !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__sr-only{',
      'position:absolute !important;',
      'width:1px !important;',
      'height:1px !important;',
      'padding:0 !important;',
      'margin:-1px !important;',
      'overflow:hidden !important;',
      'clip:rect(0,0,0,0) !important;',
      'white-space:nowrap !important;',
      'border:0 !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-card{',
      'display:flex !important;',
      'flex-direction:column !important;',
      'align-items:stretch !important;',
      'justify-content:flex-start !important;',
      'position:static !important;',
      'margin:0 !important;',
      'padding:20px 8px 14px !important;',
      'min-height:148px;',
      'height:auto !important;',
      'overflow:visible !important;',
      'background:#fff !important;',
      'border:1px solid var(--sk-zud-border) !important;',
      'border-radius:16px !important;',
      'box-shadow:none !important;',
      'cursor:pointer;',
      'box-sizing:border-box;',
      'text-align:center !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-card:has(input:checked){',
      'border:2px solid var(--sk-zud-selected) !important;',
      'padding:19px 7px 13px !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-details{',
      'display:flex !important;',
      'flex-direction:column !important;',
      'align-items:center !important;',
      'gap:0 !important;',
      'padding:0 !important;',
      'margin:0 !important;',
      'width:100%;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-content,',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-titles,',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-title{',
      'display:contents !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__radio-custom{',
      'display:none !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-title-text{',
      'order:1;',
      'width:100%;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-title-text,',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-title-text *{',
      'margin:0 !important;',
      'color:#17161A !important;',
      'font-size:2rem !important;',
      'font-weight:700 !important;',
      'line-height:1 !important;',
      'text-align:center !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-discount-wrapper{',
      'order:4;',
      'width:100%;',
      'margin:4px 0 0 !important;',
      'padding:0 !important;',
      'background:transparent !important;',
      'color:var(--sk-zud-save) !important;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-save{',
      'order:4;',
      'display:block !important;',
      'width:100%;',
      'margin:4px 0 0 !important;',
      'padding:0 !important;',
      'color:var(--sk-zud-save) !important;',
      'background:transparent !important;',
      'font-size:0.8125rem !important;',
      'font-weight:600 !important;',
      'line-height:1.3 !important;',
      'text-align:center !important;',
      'white-space:nowrap !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-discount,',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-discount *{',
      'margin:0 !important;',
      'color:var(--sk-zud-save) !important;',
      'background:transparent !important;',
      'font-size:0.8125rem !important;',
      'font-weight:600 !important;',
      'line-height:1.3 !important;',
      'text-align:center !important;',
      'white-space:nowrap !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-subtitle{',
      'order:2;',
      'display:block !important;',
      'width:100%;',
      'margin:4px 0 0 !important;',
      'padding:0 !important;',
      'color:#9C978F !important;',
      'font-size:0.9375rem !important;',
      'font-weight:500 !important;',
      'line-height:1.3 !important;',
      'text-align:center !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__price-section{',
      'order:3;',
      'width:100%;',
      'margin:14px 0 0 !important;',
      'padding:0 !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__price-stack{',
      'display:flex !important;',
      'flex-direction:column !important;',
      'align-items:center !important;',
      'gap:0 !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__price,',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__price *{',
      'margin:0 !important;',
      'color:#17161A !important;',
      'font-size:0.95rem !important;',
      'font-weight:700 !important;',
      'line-height:1.25 !important;',
      'text-align:center !important;',
      'white-space:nowrap !important;',
      '}',
      '[data-widget-name="widget-bundle-style-1"].' + CLASS_ON + ' .zudapp-widget__bundle-style-1__radio-custom,',
      '[data-widget-name="widget-bundle-style-1"].' + CLASS_ON + ' .zudapp-widget__bundle-style-1__old-price,',
      '[data-widget-name="widget-bundle-style-1"].' + CLASS_ON + ' .zudapp-widget__bundle-style-1__save-bar,',
      '[data-widget-name="widget-bundle-style-1"].' + CLASS_ON + ' .zudapp-widget__bundle-style-1__badge-ticket,',
      'html body [data-widget-name="widget-bundle-style-1"].' + CLASS_ON + ' .zudapp-widget__bundle-style-1__radio-custom,',
      'html body [data-widget-name="widget-bundle-style-1"].' + CLASS_ON + ' .zudapp-widget__bundle-style-1__old-price,',
      'html body [data-widget-name="widget-bundle-style-1"].' + CLASS_ON + ' .zudapp-widget__bundle-style-1__save-bar,',
      'html body [data-widget-name="widget-bundle-style-1"].' + CLASS_ON + ' .zudapp-widget__bundle-style-1__badge-ticket{',
      'display:none !important;',
      'visibility:hidden !important;',
      'height:0 !important;',
      'overflow:hidden !important;',
      'padding:0 !important;',
      'margin:0 !important;',
      'border:0 !important;',
      '}',
      '[data-widget-name="widget-bundle-style-1"].' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-card input[type="radio"],',
      'html body [data-widget-name="widget-bundle-style-1"].' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-card input[type="radio"]{',
      'position:absolute !important;',
      'width:1px !important;',
      'height:1px !important;',
      'padding:0 !important;',
      'margin:-1px !important;',
      'overflow:hidden !important;',
      'clip:rect(0,0,0,0) !important;',
      'white-space:nowrap !important;',
      'border:0 !important;',
      'opacity:0 !important;',
      '}',
      '[data-widget-name="widget-bundle-style-1"].' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-discount-wrapper,',
      'html body [data-widget-name="widget-bundle-style-1"].' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-discount-wrapper{',
      'display:flex !important;',
      'justify-content:center !important;',
      'visibility:visible !important;',
      'height:auto !important;',
      'width:100% !important;',
      'order:4;',
      'margin:4px 0 0 !important;',
      'padding:0 !important;',
      'background:transparent !important;',
      'color:var(--sk-zud-save) !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-details.--has-badge{',
      'padding-inline-end:0 !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style__options{',
      'display:none !important;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-opts-host > .zudapp-widget__bundle-style__options{',
      'display:flex !important;',
      'flex-direction:column;',
      'gap:10px;',
      'position:static !important;',
      'inset:auto !important;',
      'left:auto !important;',
      'right:auto !important;',
      'top:auto !important;',
      'width:100% !important;',
      'max-width:none !important;',
      'padding:0;',
      'margin:0;',
      'box-sizing:border-box;',
      'text-align:start;',
      'z-index:auto;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style__options-title{',
      'position:absolute !important;',
      'width:1px !important;',
      'height:1px !important;',
      'padding:0 !important;',
      'margin:-1px !important;',
      'overflow:hidden !important;',
      'clip:rect(0,0,0,0) !important;',
      'white-space:nowrap !important;',
      'border:0 !important;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece{',
      'display:block;',
      'width:100%;',
      'background:#fff;',
      'border:1px solid var(--sk-zud-border);',
      'border-radius:var(--sk-zud-radius);',
      'box-sizing:border-box;',
      'overflow:hidden;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece.is-open{',
      'border:2px solid var(--sk-zud-selected);',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece.is-pending{',
      'border-style:dashed;',
      'border-color:#D1D5DB;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece__head{',
      'display:flex;',
      'align-items:center;',
      'gap:12px;',
      'width:100%;',
      'margin:0;',
      'padding:12px;',
      'border:0;',
      'background:transparent;',
      'color:inherit;',
      'font:inherit;',
      'text-align:start;',
      'cursor:pointer;',
      'box-sizing:border-box;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece__thumb{',
      'flex:0 0 48px;',
      'width:48px;',
      'height:48px;',
      'border-radius:8px;',
      'background:#F3F1EC;',
      'border:1px solid #E8E4DC;',
      'overflow:hidden;',
      'display:flex;',
      'align-items:center;',
      'justify-content:center;',
      'position:relative;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece__thumb img{',
      'width:100%;',
      'height:100%;',
      'object-fit:cover;',
      'display:block;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece__thumb-plus{',
      'color:#C4C0B8;',
      'font-size:22px;',
      'font-weight:400;',
      'line-height:1;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece.is-pending .sk-zud-piece__thumb{',
      'background:#FAFAF8;',
      'border-color:transparent;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece__meta{',
      'flex:1 1 auto;',
      'min-width:0;',
      'display:flex;',
      'flex-direction:column;',
      'gap:2px;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece__title{',
      'margin:0;',
      'color:#17161A;',
      'font-size:0.95rem;',
      'font-weight:700;',
      'line-height:1.3;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece.is-pending .sk-zud-piece__title{',
      'color:#B0ABA3;',
      'font-weight:600;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece__sub{',
      'margin:0;',
      'color:#8C877F;',
      'font-size:0.78rem;',
      'font-weight:400;',
      'line-height:1.35;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece__action{',
      'flex:0 0 auto;',
      'color:#17161A;',
      'font-size:0.875rem;',
      'font-weight:600;',
      'text-decoration:underline;',
      'text-underline-offset:2px;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece__chev{',
      'flex:0 0 auto;',
      'width:20px;',
      'height:20px;',
      'color:#9CA3AF;',
      'display:inline-flex;',
      'align-items:center;',
      'justify-content:center;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece__chev svg{',
      'width:14px;',
      'height:14px;',
      'display:block;',
      'transition:transform .15s ease;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece.is-open .sk-zud-piece__chev svg{',
      'transform:rotate(180deg);',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece__body{',
      'display:none;',
      'padding:0 12px 14px;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece.is-open .sk-zud-piece__body{',
      'display:block;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece.is-open .sk-zud-piece__action{',
      'display:none;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece:not(.is-open) .sk-zud-piece__body{',
      'display:none !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style__one-piece-options{',
      'display:flex !important;',
      'flex-direction:column !important;',
      'gap:14px !important;',
      'background:transparent !important;',
      'border:0 !important;',
      'padding:0 !important;',
      'margin:0 !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style__option-wrapper{',
      'display:flex !important;',
      'flex-direction:column !important;',
      'align-items:stretch !important;',
      'gap:8px !important;',
      'position:relative;',
      'width:100% !important;',
      'max-width:none !important;',
      'background:transparent !important;',
      'border:0 !important;',
      'box-shadow:none !important;',
      'padding:0 !important;',
      'margin:0 !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style__option-name,',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style__option-name *{',
      'display:block !important;',
      'margin:0 !important;',
      'color:#9CA3AF !important;',
      'opacity:1 !important;',
      'visibility:visible !important;',
      'font-size:0.7rem !important;',
      'font-weight:600 !important;',
      'line-height:1.3 !important;',
      'letter-spacing:0.06em !important;',
      'text-transform:uppercase !important;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style__select,',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style__select-arrow{',
      'position:absolute !important;',
      'width:1px !important;',
      'height:1px !important;',
      'padding:0 !important;',
      'margin:-1px !important;',
      'overflow:hidden !important;',
      'clip:rect(0,0,0,0) !important;',
      'white-space:nowrap !important;',
      'border:0 !important;',
      'opacity:0 !important;',
      'pointer-events:none;',
      'appearance:none !important;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-chips{',
      'display:flex;',
      'flex-wrap:wrap;',
      'gap:8px;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-chip{',
      'display:inline-flex;',
      'align-items:center;',
      'justify-content:center;',
      'min-width:48px;',
      'min-height:44px;',
      'padding:0 12px;',
      'margin:0;',
      'border:1px solid #E5E5E5;',
      'border-radius:10px;',
      'background:#fff;',
      'color:#161616;',
      'box-shadow:none;',
      'font:inherit;',
      'font-size:0.875rem;',
      'font-weight:500;',
      'line-height:1;',
      'cursor:pointer;',
      'appearance:none;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-chip.is-on{',
      'border-color:#111;',
      'box-shadow:inset 0 0 0 1px #111;',
      'font-weight:700;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-chip:disabled{',
      'color:#C4C4C4;',
      'border-color:#EFEFEF;',
      'cursor:not-allowed;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-chip:focus-visible{',
      'outline:2px solid #111;',
      'outline-offset:2px;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-swatches{',
      'display:flex;',
      'flex-wrap:wrap;',
      'gap:10px;',
      'align-items:center;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-swatch{',
      'width:34px;',
      'height:34px;',
      'padding:0;',
      'margin:0;',
      'border-radius:999px;',
      'border:1px solid rgba(0,0,0,.12);',
      'box-shadow:inset 0 0 0 2px #fff;',
      'background:#ddd;',
      'cursor:pointer;',
      'appearance:none;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-swatch.is-on{',
      'box-shadow:0 0 0 2px #111, inset 0 0 0 2px #fff;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-swatch:disabled{',
      'opacity:.4;',
      'cursor:not-allowed;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-swatch:focus-visible{',
      'outline:2px solid #111;',
      'outline-offset:3px;',
      '}',
      '.' + CLASS_ON + ' .sk-zud-piece__status{',
      'margin:12px 0 0;',
      'color:var(--sk-zud-save);',
      'font-size:0.8125rem;',
      'font-weight:600;',
      'line-height:1.35;',
      '}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-card:focus-visible{',
      'outline:2px solid #17161A;',
      'outline-offset:3px;',
      '}',
      '[data-sk-bundle-suppressed]{',
      'display:none !important;',
      '}',
      '@media (max-width:360px){',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-card{min-height:136px;padding:16px 4px 12px !important}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-card:has(input:checked){padding:15px 3px 11px !important}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-title-text,.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-title-text *{font-size:1.65rem !important}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__offer-subtitle{font-size:0.8125rem !important}',
      '.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__price,.' + CLASS_ON + ' .zudapp-widget__bundle-style-1__price *{font-size:0.8rem !important}',
      '.' + CLASS_ON + ' .sk-zud-save{font-size:0.75rem !important}',
      '}',
    ].join('');
    if (style.textContent !== css) style.textContent = css;
    if (style.parentNode !== parent) parent.appendChild(style);
  }

  function restoreNativeOptions() {
    Array.prototype.forEach.call(
      queryDeepAll('[data-sk-bundle-suppressed]'),
      function (node) {
        node.removeAttribute('data-sk-bundle-suppressed');
        Array.prototype.forEach.call(node.querySelectorAll('[data-sk-bundle-required]'), function (input) {
          input.required = true;
          input.removeAttribute('data-sk-bundle-required');
        });
      }
    );
  }

  function suppressNativeOptions(widget) {
    var scope = widget.closest('form') || document;
    Array.prototype.forEach.call(scope.querySelectorAll('salla-product-options, .s-product-options-wrapper'), function (node) {
      if (node.contains(widget) || node.closest('.zud-native-options-overlay, .zud-native-options-panel, ' + WIDGET_SEL)) return;
      node.setAttribute('data-sk-bundle-suppressed', '');
      // Only relax controls we actually replace; popup validation stays native.
      Array.prototype.forEach.call(node.querySelectorAll('input[required], select[required]'), function (input) {
        input.setAttribute('data-sk-bundle-required', '');
        input.required = false;
      });
    });
  }

  function fireNativeChange(el) {
    ['input', 'change'].forEach(function (type) {
      var event;
      try {
        event = new Event(type, { bubbles: true });
      } catch (err) {
        event = document.createEvent('Event');
        event.initEvent(type, true, true);
      }
      el.dispatchEvent(event);
    });
  }

  function findControl(selector) {
    var found = null;
    eachRoot(function (root) {
      if (found || !root.querySelectorAll) return;
      Array.prototype.forEach.call(root.querySelectorAll(selector), function (el) {
        if (found || (el.closest && el.closest(WIDGET_SEL + ', .zud-native-options-overlay, .zud-native-options-panel'))) return;
        found = el;
      });
    });
    return found;
  }

  function applyNativeOptionValue(optionId, value) {
    if (!optionId || value == null || value === '') return false;
    var name = 'options[' + optionId + ']';
    var radio = findControl(
      'input[type="radio"][name="' + name + '"][value="' + value + '"]'
    );
    if (radio) {
      if (!radio.checked) {
        if (radio.disabled) return false;
        radio.click();
      }
      return radio.checked;
    }
    var select = findControl('select[name="' + name + '"]');
    if (select && String(select.value) !== String(value)) {
      select.value = value;
      fireNativeChange(select);
      return true;
    }
    return !!select;
  }

  function syncNativeFromBundle(widget) {
    if (!bundleOptionsReady(widget)) {
      restoreNativeOptions();
      return;
    }
    suppressNativeOptions(widget);

    // Native defaults are not customer choices. Sync only a piece they touched,
    // so mounting/rerendering the widget cannot request a different variant.
    var piece = widget.querySelector('.sk-zud-piece.is-open[data-sk-touched="1"]') ||
      widget.querySelector('.sk-zud-piece[data-sk-touched="1"]');
    if (!piece) return;

    Array.prototype.forEach.call(
      piece._skSelects || [],
      function (select) {
        var optionId = select.getAttribute('data-option-id');
        if (!optionId) return;
        var value = String(select.value || '');
        if (!value) return;
        applyNativeOptionValue(optionId, value);
      }
    );
  }

  function paintChrome(widget) {
    Array.prototype.forEach.call(
      widget.querySelectorAll(
        '.zudapp-widget__bundle-style-1__save-bar, .zudapp-widget__bundle-style-1__old-price, .zudapp-widget__bundle-style-1__radio-custom, .zudapp-widget__bundle-style-1__badge-ticket'
      ),
      function (node) {
        node.style.setProperty('display', 'none', 'important');
      }
    );
    Array.prototype.forEach.call(
      widget.querySelectorAll('.zudapp-widget__bundle-style-1__offer-discount-wrapper'),
      function (node) {
        var text = String(node.textContent || '').replace(/\s+/g, '');
        if (!text) {
          node.style.setProperty('display', 'none', 'important');
          return;
        }
        node.style.setProperty('display', 'flex', 'important');
        node.style.setProperty('justify-content', 'center', 'important');
        node.style.setProperty('visibility', 'visible', 'important');
        node.style.setProperty('height', 'auto', 'important');
        node.style.setProperty('background', 'transparent', 'important');
      }
    );
    paintOfferUnits(widget);
    paintOfferSavings(widget);
  }

  function discountOn(card) {
    var flag = card.getAttribute('data-enable-discount');
    if (flag == null) return Number(card.getAttribute('data-discount-value')) > 0;
    return flag !== 'false' && flag !== '0' && flag !== '';
  }

  function discountLabel(card, lang) {
    if (!discountOn(card)) return '';
    var type = card.getAttribute('data-discount-type') || 'percentage';
    var value = parseAmount(card.getAttribute('data-discount-value'));
    if (!isFinite(value) || value <= 0) return '';
    if (type === 'fixed') {
      var sample = card.querySelector('.zudapp-widget__bundle-style-1__price');
      return t(CONFIG.i18n.saveAmount, lang, { value: formatAmount(value, sample && sample.textContent) });
    }
    var pct = Math.round(value * 100) / 100;
    var shown = Math.abs(pct - Math.round(pct)) < 0.001 ? String(Math.round(pct)) : String(pct);
    return t(CONFIG.i18n.savePercent, lang, { value: shown });
  }

  function foreignDiscountText(card) {
    var nodes = card.querySelectorAll(
      '.zudapp-widget__bundle-style-1__offer-discount, .zudapp-widget__bundle-style-1__save-bar, .zudapp-widget__bundle-style-1__badge-ticket'
    );
    for (var i = 0; i < nodes.length; i++) {
      var text = String(nodes[i].textContent || '').replace(/\s+/g, ' ').trim();
      if (text && /\d/.test(text) && /%|٪|وفّر|وفر|خصم|save|off/i.test(text)) return text;
    }
    return '';
  }

  function paintOfferSavings(widget) {
    var lang = detectLang(widget);
    Array.prototype.forEach.call(
      widget.querySelectorAll('.zudapp-widget__bundle-style-1__offer-card'),
      function (card) {
        var label = discountLabel(card, lang) || foreignDiscountText(card);
        var line = card.querySelector('.sk-zud-save');
        if (!label) {
          if (line) line.remove();
          return;
        }
        if (!line) {
          line = document.createElement('p');
          line.className = 'sk-zud-save';
          card.appendChild(line);
        }
        if (line.textContent !== label) line.textContent = label;
        var original = card.querySelector('.zudapp-widget__bundle-style-1__offer-discount-wrapper');
        if (original) original.style.setProperty('display', 'none', 'important');
      }
    );
  }

  function offerUnit(qty, lang) {
    if (lang === 'ar') return qty === 1 ? 'ثوب' : 'أثواب';
    return qty === 1 ? 'thobe' : 'thobes';
  }

  function paintOfferUnits(widget) {
    var lang = detectLang(widget);
    Array.prototype.forEach.call(
      widget.querySelectorAll('.zudapp-widget__bundle-style-1__offer-card'),
      function (card) {
        var qty = Number(card.getAttribute('data-quantity')) || 0;
        if (qty < 1) {
          var input = card.querySelector('input[type="radio"]');
          qty = Number(input && input.value) || 0;
        }
        if (qty < 1) return;
        var title = card.querySelector('.zudapp-widget__bundle-style-1__offer-title-text');
        if (title && !title.childElementCount && title.textContent.trim() !== String(qty)) {
          title.textContent = String(qty);
        }
        var sub = card.querySelector('.zudapp-widget__bundle-style-1__offer-subtitle');
        if (!sub) {
          sub = document.createElement('div');
          sub.className = 'zudapp-widget__bundle-style-1__offer-subtitle';
          var titles =
            card.querySelector('.zudapp-widget__bundle-style-1__offer-titles') ||
            card.querySelector('.zudapp-widget__bundle-style-1__offer-title') ||
            card.querySelector('.zudapp-widget__bundle-style-1__offer-details');
          if (titles) titles.appendChild(sub);
        }
        var label = offerUnit(qty, lang);
        if (sub && sub.textContent !== label) sub.textContent = label;
      }
    );
  }

  function ensureOptsHost(widget) {
    var fieldset = widget.querySelector('.zudapp-widget__bundle-style-1__fieldset');
    if (!fieldset || !fieldset.parentNode) return null;
    var host = widget.querySelector('.sk-zud-opts-host');
    if (!host) {
      host = document.createElement('div');
      host.className = 'sk-zud-opts-host';
      fieldset.parentNode.insertBefore(host, fieldset.nextSibling);
    } else if (host.previousElementSibling !== fieldset) {
      fieldset.parentNode.insertBefore(host, fieldset.nextSibling);
    }
    return host;
  }

  function selectedCard(widget) {
    var checked = widget.querySelector(
      '.zudapp-widget__bundle-style-1__offer-card input[type="radio"]:checked'
    );
    if (checked) return checked.closest('.zudapp-widget__bundle-style-1__offer-card');
    return widget.querySelector('.zudapp-widget__bundle-style-1__offer-card:not(.--inactive)');
  }

  function placeOptions(widget) {
    return ensureOptsHost(widget);
  }

  function selectedQuantity(widget) {
    var card = selectedCard(widget);
    if (!card) return 1;
    var qty = Number(card.getAttribute('data-quantity'));
    if (qty > 0) return qty;
    var input = card.querySelector('input[type="radio"]');
    qty = Number(input && input.value);
    return qty > 0 ? qty : 1;
  }

  function setText(node, text) {
    if (node.textContent !== text) node.textContent = text;
  }

  function ensureSummary(host, widget) {
    var lang = detectLang(widget);
    var summary = host.querySelector('.sk-zud-summary');
    if (!summary) {
      summary = document.createElement('div');
      summary.className = 'sk-zud-summary';
      summary.innerHTML =
        '<div class="sk-zud-summary__row">' +
        '<p class="sk-zud-summary__title"></p>' +
        '<span class="sk-zud-summary__progress"></span>' +
        '</div>' +
        '<p class="sk-zud-summary__hint"></p>';
      host.insertBefore(summary, host.firstChild);
    }
    var qty = selectedQuantity(widget);
    var pieces = host.querySelectorAll('.sk-zud-piece');
    var done = 0;
    Array.prototype.forEach.call(pieces, function (piece) {
      if (piece.classList.contains('is-done') || piece.classList.contains('is-open')) {
        if (piece.classList.contains('is-done')) done += 1;
      }
    });
    // Count done only; open piece that already has user touch counts via is-done when closed.
    // While open, show max(done, openIndex) style: done pieces + whether current feels chosen.
    var openPiece = host.querySelector('.sk-zud-piece.is-open');
    var chosen = done;
    if (openPiece && openPiece.getAttribute('data-sk-touched') === '1') {
      chosen = done + 1;
    }
    if (!pieces.length) {
      chosen = 0;
    }
    setText(summary.querySelector('.sk-zud-summary__title'), t(CONFIG.i18n.yourPieces, lang, {
      n: qty,
    }));
    setText(summary.querySelector('.sk-zud-summary__progress'), t(
      CONFIG.i18n.chosenProgress,
      lang,
      { x: Math.min(chosen, qty), n: qty }
    ));
    var hint = summary.querySelector('.sk-zud-summary__hint');
    if (host._skNeedChoice && missingPieceIndex(widget) >= 0) {
      setText(hint, t(CONFIG.i18n.needChoice, lang));
      hint.classList.add('is-alert');
    } else {
      host._skNeedChoice = false;
      setText(hint, t(CONFIG.i18n.helper, lang));
      hint.classList.remove('is-alert');
    }
    return summary;
  }

  function chevronSvg() {
    return (
      '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true">' +
      '<path d="M2.625 4.3125L6 7.6875L9.375 4.3125" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>'
    );
  }

  function pieceTitleText(titleEl, index, lang) {
    var raw = titleEl ? String(titleEl.textContent || '').trim() : '';
    if (raw) return raw;
    return lang === 'ar' ? 'قطعة #' + (index + 1) : 'Piece #' + (index + 1);
  }

  function selectedLabels(pieceEl) {
    var labels = [];
    var selects = pieceEl._skSelects || pieceEl.querySelectorAll('.zudapp-widget__bundle-style__select');
    Array.prototype.forEach.call(
      selects,
      function (select) {
        var opt = select.options && select.options[select.selectedIndex];
        var label = opt ? String(opt.textContent || '').trim() : '';
        if (label) labels.push(label);
      }
    );
    return labels;
  }

  function colorHexFor(label) {
    var key = String(label || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '');
    if (COLOR_HEX[key]) return COLOR_HEX[key];
    var compact = key.replace(/[^a-z\u0600-\u06ff]/g, '');
    if (COLOR_HEX[compact]) return COLOR_HEX[compact];
    var hash = 0;
    for (var i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
    var hue = Math.abs(hash) % 360;
    return 'hsl(' + hue + ' 28% 62%)';
  }

  function isColorOption(nameEl, select) {
    var name = nameEl ? String(nameEl.textContent || '') : '';
    if (COLOR_OPTION_RE.test(name)) return true;
    var labels = Array.prototype.map.call(select.options || [], function (opt) {
      return String(opt.textContent || '').trim();
    });
    if (!labels.length) return false;
    var hits = labels.filter(function (label) {
      var key = label.toLowerCase().replace(/\s+/g, '');
      return !!(COLOR_HEX[key] || COLOR_HEX[key.replace(/[^a-z\u0600-\u06ff]/g, '')]);
    }).length;
    return hits >= Math.ceil(labels.length * 0.5);
  }

  function optionSignature(select) {
    return Array.prototype.map
      .call(select.options || [], function (opt) {
        return String(opt.value) + ':' + String(opt.textContent || '').trim() + ':' + (opt.disabled ? '0' : '1');
      })
      .join('|');
  }

  function fireSelectChange(select) {
    ['input', 'change'].forEach(function (type) {
      var event;
      try {
        event = new Event(type, { bubbles: true });
      } catch (err) {
        event = document.createEvent('Event');
        event.initEvent(type, true, true);
      }
      select.dispatchEvent(event);
    });
  }

  function syncChoiceUI(select) {
    var host = select._skZudChoices;
    if (!host) return;
    var value = String(select.value || '');
    Array.prototype.forEach.call(host.children, function (btn) {
      var on = btn.getAttribute('data-value') === value;
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  function rebuildChoices(select, host, asSwatches) {
    host.innerHTML = '';
    host.className = asSwatches ? 'sk-zud-swatches' : 'sk-zud-chips';
    host.setAttribute('role', 'listbox');
    Array.prototype.forEach.call(select.options || [], function (opt) {
      var label = String(opt.textContent || '').trim();
      if (!label) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = asSwatches ? 'sk-zud-swatch' : 'sk-zud-chip';
      btn.setAttribute('role', 'option');
      btn.setAttribute('data-value', opt.value);
      btn.setAttribute('aria-label', label);
      if (asSwatches) {
        btn.style.backgroundColor = colorHexFor(label);
        btn.title = label;
      } else {
        btn.textContent = label;
      }
      if (opt.disabled) btn.disabled = true;
      btn.addEventListener('pointerdown', function (event) {
        event.stopPropagation();
      });
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (select.disabled || btn.disabled) return;
        if (String(select.value) === String(opt.value)) return;
        select.value = opt.value;
        syncChoiceUI(select);
        fireSelectChange(select);
        var piece = host.closest('.sk-zud-piece');
        if (piece) {
          piece.setAttribute('data-sk-touched', '1');
          refreshPieceChrome(piece);
          var widget = piece.closest(WIDGET_SEL);
          if (widget) {
            var hostEl = widget.querySelector('.sk-zud-opts-host');
            if (hostEl) ensureSummary(hostEl, widget);
          }
        }
      });
      host.appendChild(btn);
    });
    syncChoiceUI(select);
  }

  function enhanceSelects(widget) {
    Array.prototype.forEach.call(widget.querySelectorAll('.sk-zud-choice-slot'), function (slot) {
      var select = slot._skSelect;
      if (!select) return;
      var nameEl = slot.previousElementSibling;
      var asSwatches = isColorOption(nameEl, select);
      select._skZudChoices = slot;
      if (!select._skZudListening) {
        select._skZudListening = true;
        select.addEventListener('change', function (event) {
          syncChoiceUI(select);
          var live = select._skZudChoices;
          var piece = live && live.closest('.sk-zud-piece');
          if (piece) {
            if (event.isTrusted) piece.setAttribute('data-sk-touched', '1');
            refreshPieceChrome(piece);
          }
        });
      }
      var signature = (asSwatches ? 's|' : 'c|') + optionSignature(select);
      if (!slot.childElementCount || select.getAttribute('data-sk-zud-sig') !== signature) {
        select.setAttribute('data-sk-zud-sig', signature);
        rebuildChoices(select, slot, asSwatches);
      } else {
        syncChoiceUI(select);
      }
    });
  }

  function refreshPieceChrome(piece) {
    if (!piece) return;
    var widget = piece.closest(WIDGET_SEL);
    var lang = detectLang(widget);
    var titleEl = piece.querySelector('.zudapp-widget__bundle-style__options-title');
    var index = Number(piece.getAttribute('data-sk-index') || 0);
    var baseTitle = piece.getAttribute('data-sk-base') || pieceTitleText(titleEl, index, lang);
    var labels = selectedLabels(piece);
    var titleNode = piece.querySelector('.sk-zud-piece__title');
    var subNode = piece.querySelector('.sk-zud-piece__sub');
    var actionNode = piece.querySelector('.sk-zud-piece__action');
    var chevNode = piece.querySelector('.sk-zud-piece__chev');
    var statusNode = piece.querySelector('.sk-zud-piece__status');
    var thumb = piece.querySelector('.sk-zud-piece__thumb');
    var imgUrl = productImage();
    var isOpen = piece.classList.contains('is-open');
    var isDone = piece.classList.contains('is-done');
    var isPending = piece.classList.contains('is-pending');
    var head = piece.querySelector('.sk-zud-piece__head');
    if (head) head.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    if (titleNode) {
      if (isDone && labels.length) {
        setText(titleNode, baseTitle + ' — ' + labels[0]);
      } else {
        setText(titleNode, baseTitle);
      }
    }
    if (subNode) {
      if (isOpen) {
        setText(subNode, t(CONFIG.i18n.pickAnything, lang));
        subNode.hidden = false;
      } else if (isDone && labels.length) {
        setText(subNode, labels.slice(1).join(' · ') || labels.join(' · '));
        subNode.hidden = !subNode.textContent;
      } else {
        setText(subNode, '');
        subNode.hidden = true;
      }
    }
    if (actionNode) {
      setText(actionNode, t(CONFIG.i18n.edit, lang));
      actionNode.hidden = !(isDone && !isOpen);
    }
    if (chevNode) {
      chevNode.hidden = isDone && !isOpen;
    }
    if (statusNode) {
      if (isOpen && labels.length) {
        setText(statusNode, labels.join(' · ') + ' ' + t(CONFIG.i18n.ready, lang));
        statusNode.hidden = false;
      } else {
        statusNode.hidden = true;
      }
    }
    if (thumb) {
      var img = thumb.querySelector('img');
      var plus = thumb.querySelector('.sk-zud-piece__thumb-plus');
      if (isPending || !imgUrl) {
        if (img) img.remove();
        if (!plus) {
          plus = document.createElement('span');
          plus.className = 'sk-zud-piece__thumb-plus';
          plus.textContent = '+';
          plus.setAttribute('aria-hidden', 'true');
          thumb.appendChild(plus);
        }
      } else {
        if (plus) plus.remove();
        if (!img) {
          img = document.createElement('img');
          img.alt = '';
          thumb.appendChild(img);
        }
        if (img.getAttribute('src') !== imgUrl) img.src = imgUrl;
      }
    }
  }

  function setPieceState(piece, state) {
    piece.classList.remove('is-open', 'is-done', 'is-pending');
    piece.classList.add(state);
    piece.setAttribute('data-sk-state', state);
    refreshPieceChrome(piece);
  }

  function pieceHasChoice(piece) {
    var selects = piece._skSelects || piece.querySelectorAll('.zudapp-widget__bundle-style__select');
    if (!selects || !selects.length) return false;
    for (var i = 0; i < selects.length; i++) {
      if (selects[i].value) return true;
    }
    return false;
  }

  function syncPieceSummary(panel) {
    var widget = panel.closest(WIDGET_SEL);
    var host = widget && widget.querySelector('.sk-zud-opts-host');
    if (host && widget) ensureSummary(host, widget);
  }

  function openPiece(panel, index) {
    var pieces = panel.querySelectorAll('.sk-zud-piece');
    Array.prototype.forEach.call(pieces, function (piece, i) {
      if (i === index) {
        setPieceState(piece, 'is-open');
        return;
      }
      if (piece.getAttribute('data-sk-touched') === '1' || i < index) {
        setPieceState(piece, 'is-done');
      } else {
        setPieceState(piece, 'is-pending');
      }
    });
    panel._skZudOpenIndex = index;
    syncPieceSummary(panel);
  }

  function collapsePiece(panel, piece) {
    var keep = piece.getAttribute('data-sk-touched') === '1' || pieceHasChoice(piece);
    setPieceState(piece, keep ? 'is-done' : 'is-pending');
    panel._skZudOpenIndex = -1;
    syncPieceSummary(panel);
  }

  function piecePairs(panel) {
    var nodes = Array.prototype.filter.call(panel.children, function (node) {
      return (
        node.classList.contains('zudapp-widget__bundle-style__options-title') ||
        node.classList.contains('zudapp-widget__bundle-style__one-piece-options')
      );
    });
    var pairs = [];
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.classList.contains('zudapp-widget__bundle-style__options-title')) {
        var next = nodes[i + 1];
        if (next && next.classList.contains('zudapp-widget__bundle-style__one-piece-options')) {
          pairs.push({ title: node, piece: next });
          i += 1;
        }
      } else if (node.classList.contains('zudapp-widget__bundle-style__one-piece-options')) {
        pairs.push({ title: null, piece: node });
      }
    }
    return pairs;
  }

  function panelSignature(panel) {
    return Array.prototype.map
      .call(panel.querySelectorAll('.zudapp-widget__bundle-style__select'), function (select) {
        return optionSignature(select);
      })
      .join('||');
  }

  function enhancePieces(widget, host) {
    var card = selectedCard(widget);
    var panel = card && card.querySelector('.zudapp-widget__bundle-style__options');
    var mount = host.querySelector('.sk-zud-pieces');
    if (!mount) {
      mount = document.createElement('div');
      mount.className = 'sk-zud-pieces';
      host.appendChild(mount);
    }
    if (!panel) {
      if (mount.childNodes.length) mount.innerHTML = '';
      mount.removeAttribute('data-sk-sig');
      return;
    }

    var qty = selectedQuantity(widget);
    var sig = String(qty) + '|' + panelSignature(panel);
    var controls = Array.prototype.slice.call(panel.querySelectorAll('.zudapp-widget__bundle-style__select'));
    var sameControls = mount._skControls && mount._skControls.length === controls.length && controls.every(function (control, index) {
      return mount._skControls[index] === control;
    });
    if (sameControls && mount.getAttribute('data-sk-sig') === sig && mount.querySelector('.sk-zud-piece')) {
      if (!mount.querySelector('.sk-zud-piece.is-open') && mount._skZudOpenIndex !== -1) {
        var kept = typeof mount._skZudOpenIndex === 'number' ? mount._skZudOpenIndex : 0;
        openPiece(mount, kept);
      } else {
        Array.prototype.forEach.call(mount.querySelectorAll('.sk-zud-piece'), refreshPieceChrome);
      }
      return;
    }

    var sameQty = mount.getAttribute('data-sk-sig') && mount.getAttribute('data-sk-sig').indexOf(String(qty) + '|') === 0;
    var openIndex = sameQty && typeof mount._skZudOpenIndex === 'number' ? mount._skZudOpenIndex : 0;
    mount._skControls = controls;
    mount.setAttribute('data-sk-sig', sig);
    mount.innerHTML = '';
    var pairs = piecePairs(panel);
    var lang = detectLang(widget);
    pairs.forEach(function (pair, index) {
      var piece = document.createElement('div');
      piece.className = 'sk-zud-piece is-pending';
      piece.setAttribute('data-sk-index', String(index));
      piece.setAttribute('data-sk-state', 'is-pending');
      piece.setAttribute('data-sk-base', pieceTitleText(pair.title, index, lang));

      var head = document.createElement('button');
      head.type = 'button';
      head.className = 'sk-zud-piece__head';
      head.innerHTML =
        '<span class="sk-zud-piece__thumb"></span>' +
        '<span class="sk-zud-piece__meta">' +
        '<span class="sk-zud-piece__title"></span>' +
        '<span class="sk-zud-piece__sub"></span>' +
        '</span>' +
        '<span class="sk-zud-piece__action" hidden></span>' +
        '<span class="sk-zud-piece__chev" aria-hidden="true">' +
        chevronSvg() +
        '</span>';

      var body = document.createElement('div');
      body.className = 'sk-zud-piece__body';
      var selects = [];
      Array.prototype.forEach.call(
        pair.piece.querySelectorAll('.zudapp-widget__bundle-style__select'),
        function (select) {
          selects.push(select);
          var wrap = select.closest('.zudapp-widget__bundle-style__option-wrapper');
          var nameEl = wrap && wrap.querySelector('.zudapp-widget__bundle-style__option-name');
          var group = document.createElement('div');
          group.className = 'zudapp-widget__bundle-style__option-wrapper';
          var name = document.createElement('div');
          name.className = 'zudapp-widget__bundle-style__option-name';
          name.textContent = nameEl ? String(nameEl.textContent || '').trim() : '';
          var slot = document.createElement('div');
          slot.className = 'sk-zud-choice-slot';
          slot._skSelect = select;
          group.appendChild(name);
          group.appendChild(slot);
          body.appendChild(group);
        }
      );
      piece._skSelects = selects;

      var status = document.createElement('p');
      status.className = 'sk-zud-piece__status';
      status.hidden = true;
      body.appendChild(status);
      piece.appendChild(head);
      piece.appendChild(body);
      mount.appendChild(piece);

      head.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (piece.classList.contains('is-open')) {
          collapsePiece(mount, piece);
          return;
        }
        openPiece(mount, index);
      });
    });
    if (openIndex < 0) {
      mount._skZudOpenIndex = -1;
      Array.prototype.forEach.call(mount.querySelectorAll('.sk-zud-piece'), function (piece) {
        setPieceState(piece, 'is-pending');
      });
      syncPieceSummary(mount);
    } else {
      if (openIndex >= pairs.length) openIndex = 0;
      openPiece(mount, openIndex);
    }
  }

  function parseAmount(text) {
    var source = String(text || '')
      .replace(/[٠-٩]/g, function (digit) {
        return String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit));
      })
      .replace(/[۰-۹]/g, function (digit) {
        return String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit));
      });
    var match = source.match(/(\d[\d,]*(?:\.\d+)?)/);
    if (!match) return NaN;
    var amount = parseFloat(match[1].replace(/,/g, ''));
    return isFinite(amount) ? amount : NaN;
  }

  function currencyTail(text) {
    var match = String(text || '').match(/(\d[\d,]*(?:\.\d+)?)([\s\S]*)$/);
    return match ? match[2] : '';
  }

  function formatAmount(amount, sample) {
    return (Math.round(amount * 100) / 100).toFixed(2) + currencyTail(sample);
  }

  function isStruckPrice(el) {
    if (!el || el.nodeType !== 1) return false;
    var tag = el.tagName;
    if (tag === 'S' || tag === 'DEL' || tag === 'STRIKE') return true;
    var cls = typeof el.className === 'string' ? el.className : '';
    if (/price-before|before-price|old-price|compare-at|line-through|regular-price/i.test(cls)) return true;
    try {
      var deco = window.getComputedStyle(el).textDecorationLine || window.getComputedStyle(el).textDecoration || '';
      if (String(deco).indexOf('line-through') !== -1) return true;
    } catch (err) {
      /* ignore */
    }
    return false;
  }

  function textWithoutStruck(el) {
    var out = '';
    function walk(node) {
      if (!node) return;
      if (node.nodeType === 3) {
        out += node.nodeValue || '';
        return;
      }
      if (node.nodeType !== 1 || isStruckPrice(node)) return;
      if (node.matches && node.matches(WIDGET_SEL)) return;
      var kids = node.childNodes;
      for (var i = 0; i < kids.length; i++) walk(kids[i]);
    }
    walk(el);
    return out;
  }

  function looksLikeMoney(text) {
    var value = String(text || '').replace(/\s+/g, ' ').trim();
    if (!value || value.length > 80 || !/\d/.test(value)) return false;
    return /(?:EGP|SAR|USD|AED|ر\.?\s*س|ج\.?\s*م|ريال)/i.test(value);
  }

  function pageUnitPrice() {
    var title = document.querySelector('[data-testid="store-product-title"], h1');
    var roots = [];
    function addAll(list) {
      for (var i = 0; i < list.length; i++) roots.push(list[i]);
    }
    addAll(
      document.querySelectorAll(
        '[data-testid="store-product-price"], .product-price, .price-wrapper, .s-product-price, salla-price'
      )
    );
    var scope = title && title.parentElement;
    if (scope) addAll(scope.querySelectorAll('h2, h3, h4, p, span, b, strong, div, salla-price'));
    for (var i = 0; i < roots.length; i++) {
      var el = roots[i];
      if (!el || el.nodeType !== 1) continue;
      if (title) {
        var pos = title.compareDocumentPosition(el);
        if (!(pos & Node.DOCUMENT_POSITION_FOLLOWING) && !el.contains(title)) continue;
      }
      if (el.querySelector && el.querySelector(WIDGET_SEL)) continue;
      if (
        el.closest &&
        el.closest(
          WIDGET_SEL + ', salla-product-card, .s-product-card, header, footer, nav, #sk-pdp-stock, .sticky-product-bar'
        )
      ) {
        continue;
      }
      if (isStruckPrice(el)) continue;
      var text = textWithoutStruck(el);
      if (!looksLikeMoney(text)) continue;
      var amount = parseAmount(text);
      if (isFinite(amount) && amount > 0) return amount;
    }
    return NaN;
  }

  function offerBase(card) {
    var qty = Number(card.getAttribute('data-quantity')) || 0;
    if (qty < 1) return NaN;
    var discountOn = card.getAttribute('data-enable-discount') === 'true';
    var discount = discountOn ? Number(card.getAttribute('data-discount-value')) || 0 : 0;
    var type = card.getAttribute('data-discount-type') || 'percentage';
    var priceEl = card.querySelector('.zudapp-widget__bundle-style-1__price');
    var oldEl = card.querySelector('.zudapp-widget__bundle-style-1__old-price');
    if (oldEl) return parseAmount(oldEl.textContent) / qty;
    if (!discountOn || !discount) return parseAmount(priceEl && priceEl.textContent) / qty;
    if (type === 'percentage' && discount < 100) {
      return parseAmount(priceEl && priceEl.textContent) / qty / (1 - discount / 100);
    }
    return NaN;
  }

  function consensusUnit(cards) {
    var groups = [];
    Array.prototype.forEach.call(cards, function (card) {
      var base = offerBase(card);
      if (!isFinite(base) || base <= 0) return;
      var rounded = Math.round(base * 100) / 100;
      var group = null;
      groups.forEach(function (item) {
        if (!group && Math.abs(item.base - rounded) <= 0.05) group = item;
      });
      if (!group) {
        group = { base: rounded, count: 0, qty: Number(card.getAttribute('data-quantity')) || 99 };
        groups.push(group);
      }
      group.count += 1;
      group.qty = Math.min(group.qty, Number(card.getAttribute('data-quantity')) || 99);
    });
    if (!groups.length) return NaN;
    groups.sort(function (a, b) {
      if (b.count !== a.count) return b.count - a.count;
      return a.qty - b.qty;
    });
    if (groups.length > 1 && groups[0].count < 2) return NaN;
    return groups[0].base;
  }

  function writeAmount(el, amount, sample) {
    if (!el || !isFinite(amount)) return;
    var next = formatAmount(amount, sample || el.textContent);
    if (el.textContent !== next) el.textContent = next;
  }

  function correctOfferPrices(widget) {
    var cards = widget.querySelectorAll('.zudapp-widget__bundle-style-1__offer-card');
    var pageUnit = pageUnitPrice();
    var unit = isFinite(pageUnit) && pageUnit > 0 ? pageUnit : consensusUnit(cards);
    if (!isFinite(unit) || unit <= 0) return;
    Array.prototype.forEach.call(cards, function (card) {
      var qty = Number(card.getAttribute('data-quantity')) || 0;
      if (qty < 1) return;
      var base = unit * qty;
      var type = card.getAttribute('data-discount-type') || 'percentage';
      var discountOn = card.getAttribute('data-enable-discount') === 'true';
      var discount = discountOn ? Number(card.getAttribute('data-discount-value')) || 0 : 0;
      var finalPrice = base;
      if (discountOn && type === 'percentage') finalPrice = base * (1 - discount / 100);
      else if (discountOn && type === 'fixed') finalPrice = Math.max(0, base - discount);
      var priceEl = card.querySelector('.zudapp-widget__bundle-style-1__price');
      var oldEl = card.querySelector('.zudapp-widget__bundle-style-1__old-price');
      writeAmount(priceEl, finalPrice, priceEl && priceEl.textContent);
      if (oldEl && discount > 0) writeAmount(oldEl, base, oldEl.textContent);
    });
  }

  var SIZE_RANK = { XS: 1, S: 2, M: 3, L: 4, XL: 5, XXL: 6, '2XL': 6, XXXL: 7, '3XL': 7, XXXXL: 8, '4XL': 8 };

  function detailRank(name) {
    var text = String(name || '').trim().toUpperCase();
    if (/^\d+$/.test(text)) return parseInt(text, 10);
    return SIZE_RANK[text] || 1000;
  }

  function optionDetails(option) {
    var details = option && (option.details || option.values);
    return Array.isArray(details) ? details : [];
  }

  function sortedDetails(details) {
    return details.slice().sort(function (a, b) {
      var delta = detailRank(a && a.name) - detailRank(b && b.name);
      if (delta) return delta;
      return String((a && a.name) || '').localeCompare(String((b && b.name) || ''), 'ar');
    });
  }

  function pageProductOptions() {
    var list = queryDeepAll('salla-product-options[options]');
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      if (el.closest && el.closest('.zud-native-options-overlay, .zud-native-options-panel')) continue;
      var raw = el.getAttribute('options');
      if (!raw) continue;
      try {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      } catch (err) {
        /* ignore */
      }
    }
    return null;
  }

  function selectableOptions(options) {
    return options.filter(function (opt) {
      if (!opt || !optionDetails(opt).length) return false;
      return String(opt.type || '') === 'single-option';
    });
  }

  function bundleOptionsReady(widget) {
    var options = pageProductOptions() || [];
    if (!options.length || selectableOptions(options).length !== options.length) return false;
    var card = selectedCard(widget);
    var panel = card && card.querySelector('.zudapp-widget__bundle-style__options');
    var pairs = panel && piecePairs(panel);
    var host = widget.querySelector('.sk-zud-opts-host');
    if (!pairs || pairs.length !== selectedQuantity(widget) || !host) return false;
    // Never hide the native form until every replacement group is usable.
    return pairs.every(function (pair, index) {
      var piece = host.querySelector('.sk-zud-piece[data-sk-index="' + index + '"]');
      return piece && options.every(function (option) {
        var select = pair.piece.querySelector('select[data-option-id="' + option.id + '"]');
        if (!select || select.disabled || !piece._skSelects || piece._skSelects.indexOf(select) === -1) return false;
        var choices = select._skZudChoices;
        return choices && choices.isConnected && choices.querySelector('button:not(:disabled)');
      });
    });
  }

  function optionsSchema(options, qty) {
    return (
      String(qty) +
      '|' +
      options
        .map(function (opt) {
          return (
            String(opt.id) +
            ':' +
            sortedDetails(optionDetails(opt))
              .map(function (detail) {
                return String(detail.id) + (detail.is_out ? 'x' : '');
              })
              .join(',')
          );
        })
        .join(';')
    );
  }

  function readPieceMaps(panel) {
    if (!panel) return [];
    return piecePairs(panel).map(function (pair) {
      var map = {};
      Array.prototype.forEach.call(
        pair.piece.querySelectorAll('.zudapp-widget__bundle-style__select'),
        function (select) {
          var id = select.getAttribute('data-option-id');
          if (id && select.value) map[id] = String(select.value);
        }
      );
      return map;
    });
  }

  function ensureSyntheticOptions(widget) {
    var card = selectedCard(widget);
    if (!card) return;
    var foreign = card.querySelector('.zudapp-widget__bundle-style__options:not([data-sk-synth])');
    if (
      foreign &&
      foreign.querySelector(
        '.zudapp-widget__bundle-style__select, .zudapp-widget__bundle-style__option-wrapper'
      )
    ) {
      return;
    }
    var options = selectableOptions(pageProductOptions() || []);
    if (!options.length) return;
    var qty = selectedQuantity(widget);
    var sig = optionsSchema(options, qty);
    var panel = card.querySelector('.zudapp-widget__bundle-style__options[data-sk-synth]');
    if (panel && panel.getAttribute('data-sk-synth') === sig) return;
    var saved = readPieceMaps(panel);
    if (panel) panel.remove();
    panel = document.createElement('div');
    panel.className = 'zudapp-widget__bundle-style__options';
    panel.setAttribute('data-sk-synth', sig);
    var lang = detectLang(widget);
    for (var index = 0; index < qty; index++) {
      var title = document.createElement('div');
      title.className = 'zudapp-widget__bundle-style__options-title';
      title.textContent = lang === 'ar' ? 'قطعة #' + (index + 1) : 'Piece #' + (index + 1);
      var piece = document.createElement('div');
      piece.className = 'zudapp-widget__bundle-style__one-piece-options';
      options.forEach(function (opt) {
        var wrap = document.createElement('div');
        wrap.className = 'zudapp-widget__bundle-style__option-wrapper';
        var name = document.createElement('div');
        name.className = 'zudapp-widget__bundle-style__option-name';
        name.textContent = String(opt.name || '').trim();
        var select = document.createElement('select');
        select.className = 'zudapp-widget__bundle-style__select';
        select.setAttribute('data-option-id', String(opt.id));
        var blank = document.createElement('option');
        blank.value = '';
        blank.textContent = '';
        select.appendChild(blank);
        sortedDetails(optionDetails(opt)).forEach(function (detail) {
          var choice = document.createElement('option');
          choice.value = String(detail.id);
          choice.textContent = String(detail.name || '').trim();
          if (detail.is_out) choice.disabled = true;
          select.appendChild(choice);
        });
        var previous = saved[index] && saved[index][String(opt.id)];
        if (previous) {
          var match = select.querySelector('option[value="' + previous + '"]');
          if (match && !match.disabled) select.value = previous;
        }
        wrap.appendChild(name);
        wrap.appendChild(select);
        piece.appendChild(wrap);
      });
      panel.appendChild(title);
      panel.appendChild(piece);
    }
    card.appendChild(panel);
  }

  function missingPieceIndex(widget) {
    var card = selectedCard(widget);
    var panel = card && card.querySelector('.zudapp-widget__bundle-style__options');
    if (!panel) return -1;
    var pairs = piecePairs(panel);
    if (!pairs.length) return -1;
    for (var i = 0; i < pairs.length; i++) {
      var selects = pairs[i].piece.querySelectorAll('.zudapp-widget__bundle-style__select');
      if (!selects.length) return i;
      for (var j = 0; j < selects.length; j++) {
        if (!selects[j].value) return i;
      }
    }
    return -1;
  }

  function focusMissingPiece(widget, index) {
    var host = widget.querySelector('.sk-zud-opts-host');
    if (host) host._skNeedChoice = true;
    var mount = host && host.querySelector('.sk-zud-pieces');
    if (mount) openPiece(mount, index);
    if (host) ensureSummary(host, widget);
    if (host && host.scrollIntoView) {
      try {
        host.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (err) {
        host.scrollIntoView();
      }
    }
  }

  var cartDrive = { active: false, saw: false, pieces: [], timer: 0, fallback: 0 };

  function stopCartDrive() {
    cartDrive.active = false;
    cartDrive.saw = false;
    cartDrive.pieces = [];
    document.body.classList.remove('sk-zud-autocart');
    if (cartDrive.timer) {
      window.clearInterval(cartDrive.timer);
      cartDrive.timer = 0;
    }
    if (cartDrive.fallback) {
      window.clearTimeout(cartDrive.fallback);
      cartDrive.fallback = 0;
    }
  }

  function revealNativeOverlay() {
    document.body.classList.remove('sk-zud-autocart');
    var overlay = document.querySelector('.zud-native-options-overlay');
    if (overlay) overlay.classList.remove('sk-zud-overlay-hidden');
    cartDrive.active = false;
    if (cartDrive.timer) {
      window.clearInterval(cartDrive.timer);
      cartDrive.timer = 0;
    }
    if (cartDrive.fallback) {
      window.clearTimeout(cartDrive.fallback);
      cartDrive.fallback = 0;
    }
  }

  function overlayPieceIndex(overlay) {
    var sub = overlay.querySelector('.zud-native-options-panel__subtitle');
    var match = String((sub && sub.textContent) || '').match(/(\d+)/);
    if (!match) return 0;
    var index = Number(match[1]) - 1;
    return index >= 0 ? index : 0;
  }

  function fillNativeOverlay(overlay, values) {
    var selects = overlay.querySelectorAll("select[name^='options[']");
    var radios = overlay.querySelectorAll("input[type='radio'][name^='options[']");
    if (!selects.length && !radios.length) return false;
    var ready = true;
    Array.prototype.forEach.call(selects, function (select) {
      var match = select.name.match(/options\[(\d+)\]/);
      if (!match) return;
      var value = values[match[1]];
      if (!value) {
        ready = false;
        return;
      }
      var option = select.querySelector('option[value="' + value + '"]');
      if (!option || option.disabled) {
        ready = false;
        return;
      }
      if (String(select.value) !== String(value)) {
        select.value = value;
        fireNativeChange(select);
      }
      if (String(select.value) !== String(value)) ready = false;
    });
    var radioGroups = {};
    Array.prototype.forEach.call(radios, function (radio) {
      var match = radio.name.match(/options\[(\d+)\]/);
      if (match) radioGroups[match[1]] = true;
    });
    Object.keys(radioGroups).forEach(function (id) {
      if (!values[id]) ready = false;
    });
    Array.prototype.forEach.call(radios, function (radio) {
      var match = radio.name.match(/options\[(\d+)\]/);
      if (!match) return;
      var value = values[match[1]];
      if (!value || String(radio.value) !== String(value) || radio.disabled) return;
      if (!radio.checked) {
        radio.click();
      }
    });
    Object.keys(radioGroups).forEach(function (id) {
      if (!values[id]) return;
      var picked = overlay.querySelector(
        "input[type='radio'][name='options[" + id + "]'][value='" + values[id] + "']:checked"
      );
      if (!picked) ready = false;
    });
    return ready;
  }

  function tryDriveOverlay() {
    if (!cartDrive.active) return;
    var overlay = document.querySelector('.zud-native-options-overlay:not([hidden])');
    if (!overlay) {
      if (cartDrive.saw) stopCartDrive();
      return;
    }
    cartDrive.saw = true;
    overlay.classList.add('sk-zud-overlay-hidden');
    var index = overlayPieceIndex(overlay);
    var values = cartDrive.pieces[index];
    if (!values) return;
    if (!fillNativeOverlay(overlay, values)) return;
    var key =
      String(index) +
      ':' +
      Object.keys(values)
        .map(function (id) {
          return id + '=' + values[id];
        })
        .join(',');
    if (overlay.getAttribute('data-sk-driven') === key) return;
    var button = overlay.querySelector('.zud-native-options-panel__confirm');
    if (!button || button.disabled || button.getAttribute('aria-disabled') === 'true') return;
    overlay.setAttribute('data-sk-driven', key);
    try {
      button.click();
    } catch (err) {
      overlay.removeAttribute('data-sk-driven');
    }
  }

  function beginCartDrive(widget) {
    var card = selectedCard(widget);
    var panel = card && card.querySelector('.zudapp-widget__bundle-style__options');
    cartDrive.pieces = readPieceMaps(panel);
    cartDrive.active = true;
    cartDrive.saw = false;
    document.body.classList.add('sk-zud-autocart');
    var overlay = document.querySelector('.zud-native-options-overlay');
    if (overlay) overlay.removeAttribute('data-sk-driven');
    if (cartDrive.timer) window.clearInterval(cartDrive.timer);
    cartDrive.timer = window.setInterval(tryDriveOverlay, 80);
    if (cartDrive.fallback) window.clearTimeout(cartDrive.fallback);
    cartDrive.fallback = window.setTimeout(function () {
      if (!cartDrive.active) return;
      var pending = document.querySelector('.zud-native-options-overlay:not([hidden])');
      if (pending) revealNativeOverlay();
      else stopCartDrive();
    }, 4500);
  }

  function widgetForForm(form) {
    var found = widgets();
    for (var i = 0; i < found.length; i++) {
      if (form.contains(found[i])) return found[i];
    }
    return found.length === 1 ? found[0] : null;
  }

  function onProductSubmit(event) {
    var form = event.target;
    if (!form || !form.tagName || form.tagName !== 'FORM') return;
    var widget = widgetForForm(form);
    if (!widget || !bundleOptionsReady(widget)) return;
    var card = selectedCard(widget);
    var panel = card && card.querySelector('.zudapp-widget__bundle-style__options');
    if (!panel || !panel.querySelector('.zudapp-widget__bundle-style__select')) return;
    var missing = missingPieceIndex(widget);
    if (missing >= 0) {
      event.preventDefault();
      event.stopPropagation();
      if (event.stopImmediatePropagation) event.stopImmediatePropagation();
      focusMissingPiece(widget, missing);
      return;
    }
    beginCartDrive(widget);
  }

  function placeSizeFinder(widget) {
    var head = document.getElementById('sk-pdp-size-head');
    if (!head || !widget || !widget.parentNode) return;
    head.style.removeProperty('display');
    if (head.nextElementSibling !== widget) widget.parentNode.insertBefore(head, widget);
  }

  function layoutOptions(widget) {
    placeSizeFinder(widget);
    paintChrome(widget);
    correctOfferPrices(widget);
    ensureSyntheticOptions(widget);
    var host = placeOptions(widget);
    if (!host) {
      restoreNativeOptions();
      return;
    }
    enhancePieces(widget, host);
    enhanceSelects(widget);
    Array.prototype.forEach.call(host.querySelectorAll('.sk-zud-piece'), refreshPieceChrome);
    ensureSummary(host, widget);
    syncNativeFromBundle(widget);
    var cards = widget.querySelectorAll('.zudapp-widget__bundle-style-1__offer-card');
    var cols = Math.max(1, Math.min(cards.length || 3, 4));
    widget.style.setProperty('--sk-zud-cols', String(cols));
  }

  function mark(widget) {
    if (widget._skLayoutPending) return;
    widget.classList.add(CLASS_ON);
    widget._skLayoutPending = true;
    window.requestAnimationFrame(function () {
      widget._skLayoutPending = false;
      if (!widget.isConnected) return;
      try {
        layoutOptions(widget);
      } catch (error) {
        // An optional enhancement must not strand the native product form.
        restoreNativeOptions();
      }
    });
  }

  function mutationMatters(records) {
    var selector = WIDGET_SEL + ', salla-product-options, .zud-native-options-overlay, .zud-native-options-panel, [data-testid="store-product-price"]';
    for (var i = 0; i < records.length; i++) {
      var node = records[i].target;
      if (node && node.nodeType === 3) node = node.parentNode;
      if (!node || !node.tagName) continue;
      var tag = node.tagName;
      if (tag === 'STYLE' || tag === 'SCRIPT' || tag === 'NOSCRIPT') continue;
      if (node.closest(selector)) return true;
      var nodes = Array.prototype.slice.call(records[i].addedNodes).concat(Array.prototype.slice.call(records[i].removedNodes));
      for (var j = 0; j < nodes.length; j++) {
        var child = nodes[j];
        if (child.nodeType === 1 && (child.matches(selector) || child.querySelector(selector) || child.shadowRoot || knownRoots.has(child))) return true;
      }
    }
    return false;
  }

  function watchRoot(root) {
    if (!root) return;
    if (root !== document && root.host) {
      knownRoots.set(root.host, root);
      if (extraRoots.indexOf(root) === -1) extraRoots.push(root);
    }
    if (root._skZudWatch) return;
    root._skZudWatch = true;
    try {
      new MutationObserver(function (records) {
        var discovered = false;
        records.forEach(function (record) {
          Array.prototype.forEach.call(record.addedNodes, function (node) {
            if (node.nodeType === 1 && discoverRoots(node)) discovered = true;
          });
        });
        if (!discovered && !mutationMatters(records)) return;
        tryDriveOverlay();
        schedule();
      }).observe(root.nodeType === 9 ? root.documentElement : root, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['options', 'product-id'],
      });
    } catch (err) {
      /* ignore */
    }
  }

  function boot() {
    var found = widgets();
    // Native form controls can live outside a widget's shadow root.
    injectStyles(document);
    var styled = [document];
    Array.prototype.forEach.call(found, function (widget) {
      var root = (widget.getRootNode && widget.getRootNode()) || document;
      if (styled.indexOf(root) === -1) {
        styled.push(root);
        injectStyles(root);
        watchRoot(root);
      }
    });
    if (!found.length) {
      restoreNativeOptions();
      return false;
    }
    Array.prototype.forEach.call(found, mark);
    return true;
  }

  var watching = false;
  var timer = null;

  function schedule() {
    if (timer) return;
    timer = window.setTimeout(function () {
      timer = null;
      boot();
    }, 60);
  }

  function retryUntilStyled() {
    [200, 700, 1500].forEach(function (delay) {
      window.setTimeout(function () {
        var found = widgets();
        if (!found.length) {
          boot();
          return;
        }
        for (var i = 0; i < found.length; i++) {
          if (!found[i].classList.contains(CLASS_ON)) {
            boot();
            return;
          }
        }
      }, delay);
    });
  }

  function widgetFromEvent(event) {
    var path = event.composedPath ? event.composedPath() : [event.target];
    for (var i = 0; i < path.length; i++) {
      var node = path[i];
      if (node && node.closest) {
        var widget = node.closest(WIDGET_SEL);
        if (widget) return widget;
      }
    }
    return null;
  }

  function start() {
    if (!Element.prototype.__skZudAttach && Element.prototype.attachShadow) {
      var nativeAttach = Element.prototype.attachShadow;
      Element.prototype.attachShadow = function () {
        var root = nativeAttach.apply(this, arguments);
        watchRoot(root);
        schedule();
        return root;
      };
      Element.prototype.__skZudAttach = true;
    }
    eachRoot(function (root) {
      if (root !== document) watchRoot(root);
    });
    boot();
    retryUntilStyled();
    if (watching) return;
    watching = true;
    watchRoot(document);
    document.addEventListener('submit', onProductSubmit, true);
    document.addEventListener(
      'change',
      function (event) {
        var widget = widgetFromEvent(event);
        if (widget) {
          window.requestAnimationFrame(function () {
            mark(widget);
          });
        }
      },
      true
    );
    window.addEventListener('resize', schedule);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
