/* Alshiaka module: product-faqs */
window.__SHEYAKA_CONFIGS__ = window.__SHEYAKA_CONFIGS__ || {};
window.__SHEYAKA_CONFIGS__["product-faqs"] = {
  "items": [],
  "i18n": {
    "title": {
      "ar": "الأسئلة الشائعة",
      "en": "Frequently asked questions"
    }
  }
};
/**
 * Sheyaka — Product FAQs
 *
 * Replaces the theme's default FAQ block with product-specific questions
 * published from the script manager (Excel/SKU keyed).
 */
(function () {
  'use strict';

  if (window.__sheyakaProductFaqs) return;
  window.__sheyakaProductFaqs = true;

  var ROOT_ID = 'sk-pdp-faqs';
  var STYLE_ID = 'sk-pdp-faqs-style';

  var CONFIG = {
    items: [],
    i18n: {
      title: { ar: 'الأسئلة الشائعة', en: 'Frequently asked questions' },
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
  applySheyakaConfig(CONFIG, 'product-faqs');

  var ui = { key: '' };

  function detectLang() {
    var html = document.documentElement;
    var lang = String(html.getAttribute('lang') || '').toLowerCase();
    if (lang.indexOf('en') === 0) return 'en';
    if (lang.indexOf('ar') === 0) return 'ar';
    return html.getAttribute('dir') === 'ltr' ? 'en' : 'ar';
  }

  function text(key) {
    var pack = CONFIG.i18n || {};
    var value = pack[key];
    var lang = detectLang();
    if (value && typeof value === 'object') return value[lang] || value.ar || value.en || '';
    return value || '';
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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

  function pageProductId() {
    var hidden = document.querySelector('form.product-form input[name="id"]');
    if (hidden && /^\d+$/.test(String(hidden.value || '').trim())) return String(hidden.value).trim();
    var match = window.location.pathname.match(/\/p(\d+)(?:\/|$)/);
    return match ? match[1] : '';
  }

  function pageSku() {
    try {
      if (window.salla && salla.config && typeof salla.config.get === 'function') {
        var product = salla.config.get('product');
        if (product && product.sku) return String(product.sku).trim();
      }
    } catch (error) {
      /* ignore */
    }
    var section = document.querySelector('section.sku, .sku.details, .product-sku');
    if (!section) return '';
    var raw = String(section.textContent || '').replace(/\s+/g, ' ').trim();
    var match = raw.match(/(?:رقم الموديل|sku|model)\s*[:：]?\s*([A-Za-z0-9._-]+)/i);
    if (match) return match[1];
    var tokens = raw.split(/\s+/).filter(function (token) {
      return /^[A-Za-z0-9][A-Za-z0-9._-]{3,}$/.test(token) && /[A-Za-z]/.test(token);
    });
    return tokens.length ? tokens[tokens.length - 1] : '';
  }

  function faqsForPage() {
    var productId = pageProductId();
    var sku = pageSku();
    var items = Array.isArray(CONFIG.items) ? CONFIG.items : [];
    for (var i = 0; i < items.length; i += 1) {
      var item = items[i];
      if (!item) continue;
      if (sku && item.sku && String(item.sku).toUpperCase() === String(sku).toUpperCase()) return item.faqs || [];
      if (productId && item.productId && String(item.productId) === String(productId)) return item.faqs || [];
    }
    return null;
  }

  function nativeFaqBlocks() {
    return Array.prototype.slice.call(
      document.querySelectorAll('.s-block--faqs, .s-block.s-block--faqs, [class*="s-block--faqs"]')
    );
  }

  function hideNativeFaqs() {
    nativeFaqBlocks().forEach(function (block) {
      block.setAttribute('data-sk-faq-hidden', '1');
      block.style.display = 'none';
    });
  }

  function cssText() {
    return [
      '#' + ROOT_ID + '{margin:28px 0 8px;color:#17161a;font-family:inherit}',
      '#' + ROOT_ID + ' *{box-sizing:border-box}',
      '#' + ROOT_ID + ' .sk-faq__title{margin:0 0 14px;font-size:1.25rem;font-weight:700;line-height:1.35}',
      '#' + ROOT_ID + ' .sk-faq__list{margin:0;padding:0;list-style:none;border-top:1px solid #ececec}',
      '#' + ROOT_ID + ' .sk-faq__item{border-bottom:1px solid #ececec}',
      '#' + ROOT_ID + ' .sk-faq__q{display:flex;align-items:center;justify-content:space-between;gap:16px;width:100%;margin:0;padding:16px 0;border:0;background:transparent;color:inherit;font:inherit;font-size:15px;font-weight:500;text-align:start;cursor:pointer}',
      '#' + ROOT_ID + ' .sk-faq__q:focus-visible{outline:2px solid #111;outline-offset:3px}',
      '#' + ROOT_ID + ' .sk-faq__icon{flex:0 0 auto;width:22px;height:22px;color:#9a9a9a;transition:transform .2s ease}',
      '#' + ROOT_ID + ' .sk-faq__item.is-open .sk-faq__icon{transform:rotate(45deg);color:#111}',
      '#' + ROOT_ID + ' .sk-faq__a{display:none;padding:0 0 16px;color:#5f5f5f;font-size:14px;line-height:1.7}',
      '#' + ROOT_ID + ' .sk-faq__item.is-open .sk-faq__a{display:block}',
    ].join('');
  }

  function injectStyles() {
    var style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }
    if (style.textContent !== cssText()) style.textContent = cssText();
  }

  function plusSvg() {
    return (
      '<svg class="sk-faq__icon" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/>' +
      '</svg>'
    );
  }

  function placeRoot(root) {
    var native = nativeFaqBlocks()[0];
    if (native && native.parentNode) {
      if (root.nextElementSibling !== native && root.previousElementSibling !== native) {
        native.parentNode.insertBefore(root, native);
      }
      return;
    }
    var wa = document.getElementById('sk-cta-end') || document.querySelector('.sk-cta__wa');
    var host = wa && (wa.closest('#sk-cta-end') || wa.parentElement);
    if (host && host.parentNode) {
      if (root.nextElementSibling !== host) host.parentNode.insertBefore(root, host);
      return;
    }
    var details = document.querySelector('.product-details, .main-content, .app-inner');
    if (details) details.appendChild(root);
  }

  function render(faqs) {
    injectStyles();
    hideNativeFaqs();
    var root = document.getElementById(ROOT_ID);
    if (!root) {
      root = document.createElement('div');
      root.id = ROOT_ID;
      root.addEventListener('click', function (event) {
        var button = event.target.closest('[data-sk-faq]');
        if (!button) return;
        var item = button.closest('.sk-faq__item');
        if (!item) return;
        var open = !item.classList.contains('is-open');
        root.querySelectorAll('.sk-faq__item.is-open').forEach(function (node) {
          if (node !== item) {
            node.classList.remove('is-open');
            var other = node.querySelector('[data-sk-faq]');
            if (other) other.setAttribute('aria-expanded', 'false');
          }
        });
        item.classList.toggle('is-open', open);
        button.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    root.setAttribute('dir', detectLang() === 'en' ? 'ltr' : 'rtl');
    root.innerHTML =
      '<h2 class="sk-faq__title">' +
      escapeHtml(text('title')) +
      '</h2><ul class="sk-faq__list">' +
      faqs
        .map(function (faq, index) {
          var id = 'sk-faq-a-' + index;
          return (
            '<li class="sk-faq__item">' +
            '<button type="button" class="sk-faq__q" data-sk-faq aria-expanded="false" aria-controls="' +
            id +
            '"><span>' +
            escapeHtml(faq.q) +
            '</span>' +
            plusSvg() +
            '</button>' +
            '<div class="sk-faq__a" id="' +
            id +
            '">' +
            escapeHtml(faq.a) +
            '</div></li>'
          );
        })
        .join('') +
      '</ul>';
    placeRoot(root);
  }

  function teardown() {
    var root = document.getElementById(ROOT_ID);
    if (root) root.remove();
    nativeFaqBlocks().forEach(function (block) {
      if (block.getAttribute('data-sk-faq-hidden') === '1') {
        block.style.display = '';
        block.removeAttribute('data-sk-faq-hidden');
      }
    });
    ui.key = '';
  }

  function refresh() {
    if (!isProductPage()) {
      teardown();
      return;
    }
    var faqs = faqsForPage();
    var key = pageProductId() + '|' + String(pageSku() || '').toUpperCase();
    if (!faqs || !faqs.length) {
      hideNativeFaqs();
      var stale = document.getElementById(ROOT_ID);
      if (stale) stale.remove();
      ui.key = key;
      return;
    }
    if (ui.key === key && document.getElementById(ROOT_ID)) {
      placeRoot(document.getElementById(ROOT_ID));
      hideNativeFaqs();
      return;
    }
    ui.key = key;
    render(faqs);
  }

  var timer = null;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(refresh, 80);
  }

  function start() {
    schedule();
    if (window.salla && typeof salla.onReady === 'function') salla.onReady().then(schedule);
    if (window.salla && salla.event && typeof salla.event.on === 'function') {
      salla.event.on('page::loaded', function () {
        ui.key = '';
        schedule();
      });
    }
  }

  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
