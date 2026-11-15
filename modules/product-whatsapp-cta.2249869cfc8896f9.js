/* Alshiaka module: product-whatsapp-cta */
window.__SHEYAKA_CONFIGS__ = window.__SHEYAKA_CONFIGS__ || {};
window.__SHEYAKA_CONFIGS__["product-whatsapp-cta"] = {
  "i18n": {
    "askWhatsapp": {
      "ar": "اسألنا على واتساب، نرد خلال دقائق",
      "en": "Ask us on WhatsApp, we reply in minutes"
    },
    "chooseOptions": {
      "ar": "اختر الخيارات",
      "en": "Choose options"
    },
    "stillNotSure": {
      "ar": "ما زلت غير متأكد؟",
      "en": "Still not sure?"
    },
    "waMessage": {
      "ar": "مرحبا، عندي استفسار عن: {{product}}\n{{options}}\n{{url}}",
      "en": "Hi, I have a question about: {{product}}\n{{options}}\n{{url}}"
    },
    "waOptionsLine": {
      "ar": "الخيارات: {{options}}",
      "en": "Options: {{options}}"
    }
  },
  "whatsappNumber": ""
};

(function () {
  'use strict';

  if (window.__sheyakaProductWhatsapp) return;
  window.__sheyakaProductWhatsapp = true;

  const CONFIG = {
    // Leave empty to use the store mobile number from Salla.
    whatsappNumber: '',

    i18n: {
      stillNotSure: { ar: 'لسه محتار؟', en: 'Still not sure?' },
      askWhatsapp: {
        ar: 'اسألنا على واتساب، نرد خلال دقائق',
        en: 'Ask us on WhatsApp, we reply in minutes',
      },
      chooseOptions: { ar: 'اختر الخيارات', en: 'Choose options' },
      waMessage: {
        ar: 'مرحبا، عندي استفسار عن: {{product}}\n{{options}}\n{{url}}',
        en: 'Hi, I have a question about: {{product}}\n{{options}}\n{{url}}',
      },
      waOptionsLine: { ar: 'الخيارات: {{options}}', en: 'Options: {{options}}' },
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
  applySheyakaConfig(CONFIG, 'product-whatsapp-cta');

  const ROOT_ID = 'sheyaka-product-cta';
  const END_ID = 'sheyaka-product-end';
  const HOME_ID = 'sk-cta-home';
  const SLOT_ID = 'sk-cta-end-slot';
  const PAD_ID = 'sk-cta-scroll-pad';
  const STYLE_ID = 'sheyaka-product-cta-style';
  const BAR_CLASS = 'is-sheyaka-cta';
  const SIZE_OPTION_RE = /طول|عرض|مقاس|size|length|width|height/i;
  const COMPACT_MQ = '(max-width: 767px)';

  function detectLang() {
    const html = document.documentElement;
    const body = document.body;
    const lang =
      html.getAttribute('lang') ||
      (body && body.getAttribute('lang')) ||
      html.getAttribute('xml:lang') ||
      '';
    if (/^ar/i.test(lang)) return 'ar';
    if (/^en/i.test(lang)) return 'en';
    const dir =
      html.getAttribute('dir') || (body && body.getAttribute('dir')) || '';
    return dir.toLowerCase() === 'ltr' ? 'en' : 'ar';
  }

  let LANG = detectLang();
  let DIR = LANG === 'ar' ? 'rtl' : 'ltr';

  function t(value, vars) {
    let text = '';
    if (value && typeof value === 'object') {
      text = value[LANG] || value.ar || value.en || '';
    } else {
      text = value || '';
    }
    if (vars) {
      Object.keys(vars).forEach(function (key) {
        text = text.replace(new RegExp('\\{\\{' + key + '\\}\\}', 'g'), vars[key]);
      });
    }
    return text;
  }

  function refreshLang() {
    LANG = detectLang();
    DIR = LANG === 'ar' ? 'rtl' : 'ltr';
  }

  function getPageInfo() {
    try {
      if (window.salla && salla.config && typeof salla.config.get === 'function') {
        return salla.config.get('page') || null;
      }
    } catch (e) {
      /* ignore */
    }
    return null;
  }

  function isProductPage() {
    const page = getPageInfo();
    if (page && page.slug === 'product.single') return true;
    return /\/p\d+(\/|$|\?)/.test(window.location.pathname);
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function decodeOptionsAttr(raw) {
    return String(raw || '')
      .replace(/&quot;/g, '"')
      .replace(/&#0?39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
  }

  function productTitle() {
    const page = getPageInfo();
    if (page && page.title) return String(page.title);
    const heading = document.querySelector('h1');
    return heading ? heading.textContent.trim() : document.title;
  }

  function storeMobile() {
    try {
      if (window.salla && salla.config && typeof salla.config.get === 'function') {
        const contacts = salla.config.get('store.contacts') || {};
        return contacts.mobile || contacts.whatsapp || contacts.phone || '';
      }
    } catch (e) {
      /* ignore */
    }
    return '';
  }

  function whatsappNumber() {
    const raw = CONFIG.whatsappNumber || storeMobile();
    return String(raw || '').replace(/[^\d]/g, '');
  }

  function parseProductOptions() {
    const el = document.querySelector('salla-product-options');
    if (!el) return [];
    const raw = el.getAttribute('options');
    if (!raw) return [];
    try {
      const parsed = JSON.parse(decodeOptionsAttr(raw));
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function optionInput(form, optionId) {
    const name = 'options[' + optionId + ']';
    const checked = form.querySelector(
      'input[name="' + name + '"]:checked, input[name="' + name + '"][type="hidden"]'
    );
    if (checked && checked.value) return checked.value;

    const select = form.querySelector('select[name="' + name + '"]');
    if (select && select.value) return select.value;

    const text = form.querySelector(
      'input[name="' + name + '"]:not([type="radio"]):not([type="checkbox"]), textarea[name="' + name + '"]'
    );
    if (text && String(text.value).trim()) return String(text.value).trim();

    const boxes = form.querySelectorAll('input[name="' + name + '[]"]:checked');
    if (boxes.length) {
      return Array.prototype.map.call(boxes, function (box) {
        return box.value;
      });
    }
    return '';
  }

  function detailName(option, valueId) {
    const details = option.details || [];
    for (let i = 0; i < details.length; i++) {
      if (String(details[i].id) === String(valueId)) {
        return String(details[i].name || '').replace(/\s*-\s*Out of Stock\s*$/i, '').trim();
      }
    }
    return String(valueId || '').trim();
  }

  function selectedOptions() {
    const form = document.querySelector('form.product-form');
    const options = parseProductOptions();
    if (!form || !options.length) return [];

    const picked = [];
    options.forEach(function (option) {
      const raw = optionInput(form, option.id);
      if (!raw) return;
      const values = Array.isArray(raw) ? raw : [raw];
      const names = values
        .map(function (value) {
          return detailName(option, value);
        })
        .filter(Boolean);
      if (!names.length) return;
      picked.push({
        optionName: option.name || '',
        valueName: names.join(', '),
      });
    });
    return picked;
  }

  function selectedQuantity() {
    const input = document.querySelector(
      '.sticky-product-bar input[name="quantity"], form.product-form input[name="quantity"]'
    );
    if (!input) return 0;
    const n = parseInt(input.value, 10);
    return n > 0 ? n : 0;
  }

  function formatSelectedLabel(picked) {
    if (!picked.length) return '';
    const groups = [];
    let i = 0;
    while (i < picked.length) {
      const current = picked[i];
      const next = picked[i + 1];
      if (
        next &&
        SIZE_OPTION_RE.test(current.optionName) &&
        SIZE_OPTION_RE.test(next.optionName)
      ) {
        groups.push(current.valueName + ' / ' + next.valueName);
        i += 2;
      } else {
        groups.push(current.valueName);
        i += 1;
      }
    }
    const qty = selectedQuantity();
    if (qty > 1) groups.push('× ' + qty);
    return groups.join(' · ');
  }

  const STOCK_PHRASE_RE = /نفدت|غير متوفر|out of stock|sold out/i;
  const ZERO_PRICE_RE = /^0(?:[.,]0+)?(?:\s*(?:EGP|USD|SAR|ج\.?\s*م|ر\.?\s*س))?$/i;

  function isDisplayed(el) {
    if (!el) return false;
    if (
      el.closest(
        '#' +
          ROOT_ID +
          ', .sk-cta-hide-original, .hidden, [hidden], .out-of-stock, .before-price, del, s'
      )
    ) {
      return false;
    }
    if (el.closest('.sticky-product-bar')) return false;
    let node = el;
    while (node && node.nodeType === 1 && node !== document.documentElement) {
      if (node.classList && node.classList.contains('hidden')) return false;
      if (node.hasAttribute && node.hasAttribute('hidden')) return false;
      const style = window.getComputedStyle(node);
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.opacity === '0'
      ) {
        return false;
      }
      node = node.parentElement;
    }
    return true;
  }

  function plainPriceText(value) {
    const raw = String(value == null ? '' : value);
    if (!raw) return '';
    let text = raw;
    // salla.money / formatted_price often embed currency icons as HTML
    if (/</.test(raw)) {
      try {
        const tmp = document.createElement('div');
        tmp.innerHTML = raw;
        text = tmp.textContent || tmp.innerText || '';
      } catch (e) {
        text = raw.replace(/<[^>]*>/g, ' ');
      }
    }
    return text
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const SAR_SVG =
    '<svg class="sk-cta__sar" viewBox="0 0 1124.14 1256.39" aria-hidden="true" focusable="false">' +
    '<path fill="currentColor" d="M699.62 1113.02h0c-20.06 44.48-33.32 92.75-38.4 143.37l424.51-90.24c20.06-44.47 33.31-92.75 38.4-143.37l-424.51 90.24z"></path>' +
    '<path fill="currentColor" d="M1085.73 895.8c20.06-44.47 33.32-92.75 38.4-143.37l-330.68 70.33v-135.2l292.27-62.11c20.06-44.47 33.32-92.75 38.4-143.37l-330.68 70.27V66.13c-50.67 28.45-95.67 66.32-132.25 110.99v403.35l-132.25 28.11V0c-50.67 28.44-95.67 66.32-132.25 110.99v525.69l-295.91 62.88c-20.06 44.48-33.33 92.75-38.42 143.37l334.33-71.05v170.26l-358.3 76.14c-20.06 44.47-33.32 92.75-38.4 143.37l375.04-79.7c30.53-6.35 56.77-24.4 73.83-49.24l68.78-101.97v-.02c7.14-10.55 11.3-23.27 11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28z"></path>' +
    '</svg>';

  function symbolElement(node) {
    if (!node || node.nodeType !== 1) return false;
    const tag = node.tagName;
    if (tag === 'SVG' || tag === 'IMG' || tag === 'I') return true;
    const cls = node.getAttribute('class') || '';
    if (/sar|riyal|currency|sicon/i.test(cls)) return true;
    if (node.querySelector('svg, i')) {
      const text = String(node.textContent || '').replace(/\s+/g, '');
      if (!/\d/.test(text)) return true;
    }
    return false;
  }

  function pricePiecesFrom(source) {
    const pieces = [];
    function pushText(value) {
      const chunk = String(value || '').replace(/\s+/g, ' ');
      if (!chunk.trim()) return;
      pieces.push({ text: chunk });
    }
    function walk(node) {
      if (!node) return;
      if (node.nodeType === 3) {
        pushText(node.textContent);
        return;
      }
      if (node.nodeType !== 1) return;
      if (node.matches('del, s, script, style, noscript, .before-price, .price-before, .old-price')) return;
      if (symbolElement(node)) {
        pieces.push({ node: node });
        return;
      }
      Array.prototype.forEach.call(node.childNodes, walk);
    }
    if (!source) return pieces;
    if (source.nodeType === 1) Array.prototype.forEach.call(source.childNodes, walk);
    else walk(source);
    return pieces;
  }

  function piecesText(pieces) {
    return plainPriceText(pieces.map(function (piece) { return piece.text || ''; }).join(' '));
  }

  function piecesHaveSymbol(pieces) {
    return pieces.some(function (piece) { return piece.node; });
  }

  function ensureRiyal(pieces) {
    if (!pieces || !pieces.length) return pieces;
    if (piecesHaveSymbol(pieces)) return pieces;
    const text = piecesText(pieces);
    if (/\b(?:EGP|USD|SAR|AED)\b|ج\.?\s*م|ر\.?\s*س|د\.?\s*إ|﷼|⃁/i.test(text)) return pieces;
    const holder = document.createElement('span');
    holder.innerHTML = SAR_SVG;
    const icon = holder.firstChild;
    if (!icon) return pieces;
    if (DIR === 'ltr') pieces.unshift({ node: icon });
    else pieces.push({ node: icon });
    return pieces;
  }

  function paintPrice(priceEl, pieces) {
    priceEl.replaceChildren();
    pieces.forEach(function (piece) {
      if (piece.node) priceEl.appendChild(piece.node.cloneNode(true));
      else if (piece.text) priceEl.appendChild(document.createTextNode(piece.text));
    });
  }

  function isCleanPrice(text) {
    text = plainPriceText(text);
    if (!text) return false;
    if (/[<>]/.test(text)) return false;
    if (STOCK_PHRASE_RE.test(text)) return false;
    if (ZERO_PRICE_RE.test(text.replace(/,/g, ''))) return false;
    const amounts = text.match(/\d[\d.,]*/g) || [];
    if (amounts.length !== 1) return false;
    const currencies = text.match(/\b(?:EGP|USD|SAR)\b|ج\.?\s*م|ر\.?\s*س/gi) || [];
    if (currencies.length > 1) return false;
    return true;
  }

  function readPricePieces() {
    const selectors = [
      '.price .price_is_on_sale:not(.hidden) .total-price',
      '.price .starting-or-normal-price .total-price',
      '.price span.total-price',
      '.price .total-price',
    ];
    for (let i = 0; i < selectors.length; i++) {
      const nodes = document.querySelectorAll(selectors[i]);
      for (let n = 0; n < nodes.length; n++) {
        const el = nodes[n];
        if (!isDisplayed(el)) continue;
        const pieces = pricePiecesFrom(el);
        if (isCleanPrice(piecesText(pieces))) return pieces;
      }
    }
    return null;
  }

  function formatMoney(amount) {
    const n = Number(amount);
    if (!isFinite(n)) return '';
    try {
      if (window.salla && typeof salla.money === 'function') {
        return salla.money(n);
      }
    } catch (e) {
      /* ignore */
    }
    return n.toLocaleString(LANG === 'ar' ? 'ar-SA' : 'en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  function priceFromEvent(payload) {
    if (payload == null) return '';
    const data = payload.detail || payload.data || payload;
    if (typeof data === 'string') {
      const text = plainPriceText(data);
      return isCleanPrice(text) ? data : '';
    }
    if (data && typeof data === 'object') {
      const formattedCandidates = [data.formatted_price, data.price_formatted];
      for (let i = 0; i < formattedCandidates.length; i++) {
        const text = plainPriceText(formattedCandidates[i]);
        if (isCleanPrice(text)) return formattedCandidates[i];
      }
      const amount =
        data.final_price != null
          ? data.final_price
          : data.sale_price != null
            ? data.sale_price
            : data.price;
      const formatted = formatMoney(amount);
      if (isCleanPrice(formatted)) return formatted;
    }
    if (typeof payload === 'number') {
      const formatted = formatMoney(payload);
      return isCleanPrice(formatted) ? formatted : '';
    }
    return '';
  }

  function whatsappHref(label) {
    const number = whatsappNumber();
    if (!number) return '#';
    const optionsLine = label
      ? t(CONFIG.i18n.waOptionsLine, { options: label })
      : '';
    const message = t(CONFIG.i18n.waMessage, {
      product: productTitle(),
      options: optionsLine,
      url: window.location.href,
    }).replace(/\n{2,}/g, '\n');
    return 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
  }

  function chevronSvg() {
    return (
      '<svg class="sk-cta__chevron" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>' +
      '</svg>'
    );
  }

  function injectStyles() {
    const existing = document.getElementById(STYLE_ID);
    if (existing) existing.remove();
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
#${ROOT_ID},#${ROOT_ID} *,#${END_ID},#${END_ID} *{box-sizing:border-box}
#${HOME_ID}{display:block;width:100%;height:1px;overflow:hidden;pointer-events:none;visibility:hidden}
#${PAD_ID}{display:block;width:100%;height:0;flex:0 0 auto;pointer-events:none}
#${END_ID}{
  display:block;
  width:100%;
  padding:12px 0 24px;
  background:transparent;
  position:relative;
  z-index:1;
}
#${END_ID} .sk-cta__end-pad{
  padding:0 16px 12px;
}
#${END_ID} .sk-cta__wa{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  width:100%;
  padding:14px 16px;
  border:1px solid #ececec;
  border-radius:16px;
  background:#fff;
  color:inherit;
  text-decoration:none!important;
  box-shadow:none;
  transition:border-color .15s ease,background-color .15s ease;
}
#${END_ID} .sk-cta__wa:hover{border-color:#ddd;background:#fafafa}
#${END_ID} .sk-cta__wa:focus-visible{outline:2px solid #111;outline-offset:2px}
#${END_ID} .sk-cta__wa-copy{min-width:0}
#${END_ID} .sk-cta__wa-title{
  margin:0;
  font-size:1.05rem;
  font-weight:700;
  color:#111;
  line-height:1.3;
}
#${END_ID} .sk-cta__wa-sub{
  margin:3px 0 0;
  font-size:.92rem;
  color:#9ca3af;
  line-height:1.4;
}
#${END_ID} .sk-cta__chevron{
  width:18px;
  height:18px;
  color:#c4c4c4;
  flex:0 0 auto;
}
[dir="rtl"] #${END_ID} .sk-cta__chevron{transform:scaleX(-1)}
#${SLOT_ID}{
  display:block;
  width:100%;
}
#${ROOT_ID}{
  display:flex;
  flex-direction:column;
  gap:0;
  width:100%;
  font-family:inherit;
}
#${ROOT_ID} .sk-cta__summary{
  display:flex;
  align-items:baseline;
  justify-content:space-between;
  gap:12px;
  width:100%;
  min-height:24px;
}
#${ROOT_ID} .sk-cta__options{
  min-width:0;
  color:#9ca3af;
  font-size:.95rem;
  line-height:1.4;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
#${ROOT_ID} .sk-cta__options.is-empty{color:#c5c5c5}
#${ROOT_ID} .sk-cta__price{
  display:inline-flex;
  align-items:center;
  gap:0.28em;
  flex:0 0 auto;
  color:#111;
  font-size:1.15rem;
  font-weight:700;
  letter-spacing:.01em;
  white-space:nowrap;
}
#${ROOT_ID} .sk-cta__price svg,
#${ROOT_ID} .sk-cta__price .sk-cta__sar{
  width:0.92em;
  height:0.92em;
  flex:0 0 auto;
  display:block;
  fill:currentColor;
}
#${ROOT_ID} .sk-cta__price i{
  font-style:normal;
  line-height:1;
}
@media (max-width:767px){
  #${ROOT_ID}{display:flex}
  #${SLOT_ID}{display:block}
  .sticky-product-bar.${BAR_CLASS}{
    display:flex!important;
    visibility:visible!important;
    opacity:1!important;
    flex-direction:column;
    gap:12px;
    width:100%;
    padding:12px 16px 14px!important;
    margin:0!important;
    border-radius:0!important;
    background:#fff!important;
    box-shadow:none;
    position:relative!important;
    inset:auto!important;
    top:auto!important;
    right:auto!important;
    bottom:auto!important;
    left:auto!important;
    z-index:auto;
  }
  .sticky-product-bar.${BAR_CLASS} > .container,
  .sticky-product-bar.${BAR_CLASS} > div:not(#${ROOT_ID}){
    display:flex!important;
    flex-direction:column!important;
    align-items:stretch!important;
    justify-content:flex-end!important;
    gap:0!important;
    width:100%!important;
    max-width:none!important;
    padding:0!important;
    margin:0!important;
  }
  .sticky-product-bar.${BAR_CLASS} .price,
  .sticky-product-bar.${BAR_CLASS} .total-price,
  .sticky-product-bar.${BAR_CLASS} .out-of-stock,
  .sticky-product-bar.${BAR_CLASS} .sk-cta-hide-original,
  .sticky-product-bar.${BAR_CLASS} .sticky-product-bar__quantity,
  .sticky-product-bar.${BAR_CLASS} salla-quantity-input,
  .sticky-product-bar.${BAR_CLASS} salla-mini-checkout-widget,
  .sticky-product-bar.${BAR_CLASS} salla-quick-buy,
  .sticky-product-bar.${BAR_CLASS} apple-pay-button,
  .sticky-product-bar.${BAR_CLASS} .s-add-product-button-mini-checkout,
  .sticky-product-bar.${BAR_CLASS} .s-mini-checkout{
    display:none!important;
  }
  .sticky-product-bar.${BAR_CLASS} salla-add-product-button,
  .sticky-product-bar.${BAR_CLASS} .sticky-product-bar__btn,
  .sticky-product-bar.${BAR_CLASS} .s-add-product-button-main,
  .sticky-product-bar.${BAR_CLASS} salla-add-product-button .s-button-wrap{
    display:block!important;
    visibility:visible!important;
    opacity:1!important;
    width:100%!important;
    min-width:0!important;
    max-width:none!important;
    flex:none!important;
    gap:0!important;
  }
  .sticky-product-bar.${BAR_CLASS} salla-add-product-button .s-button-element,
  .sticky-product-bar.${BAR_CLASS} salla-button{
    display:flex!important;
    visibility:visible!important;
    opacity:1!important;
    align-items:center;
    justify-content:center;
    width:100%!important;
    min-height:56px!important;
    height:auto!important;
    border:0!important;
    border-radius:16px!important;
    background:#111!important;
    color:#fff!important;
    font-size:1.05rem!important;
    font-weight:600!important;
    box-shadow:none!important;
  }
  .sticky-product-bar.${BAR_CLASS} salla-add-product-button .s-button-disabled,
  .sticky-product-bar.${BAR_CLASS} salla-add-product-button button:disabled{
    background:#efefef!important;
    color:#9ca3af!important;
  }
  body.is-sticky-product-bar .sticky-product-bar.${BAR_CLASS}:not(.is-floating){
    position:relative!important;
    inset:auto!important;
    top:auto!important;
    right:auto!important;
    bottom:auto!important;
    left:auto!important;
    width:100%!important;
    z-index:auto!important;
  }
  .sticky-product-bar.${BAR_CLASS}.is-floating,
  body.is-sticky-product-bar .sticky-product-bar.${BAR_CLASS}.is-floating,
  body.sk-cta-floating .sticky-product-bar.${BAR_CLASS}{
    position:fixed!important;
    left:0!important;
    right:0!important;
    bottom:var(--sk-cta-bottom, 64px)!important;
    top:auto!important;
    width:100%!important;
    max-width:none!important;
    margin:0!important;
    border-radius:0!important;
    z-index:30!important;
    box-shadow:0 -10px 28px rgba(0,0,0,.06);
  }
}
@media (min-width:768px){
  #${ROOT_ID}{display:none!important}
  #${SLOT_ID}{display:none!important}
  #${END_ID}.sk-cta--in-product{
    max-width:none;
    width:100%;
    margin:20px 0 4px;
    padding:0;
  }
  #${END_ID}.sk-cta--in-product .sk-cta__end-pad{padding:0}
  #${END_ID}.sk-cta--page-end{
    max-width:1280px;
    margin:40px auto 56px;
    padding:0 24px;
    box-sizing:border-box;
  }
  #${END_ID} .sk-cta__wa{padding:16px 18px}
  #${END_ID} .sk-cta__wa-title{font-size:1.1rem}
}
.sticky-product-bar.${BAR_CLASS}.is-floating,
body.sk-cta-floating .sticky-product-bar.${BAR_CLASS}{
  display:flex!important;
  visibility:visible!important;
  opacity:1!important;
  position:fixed!important;
  left:0!important;
  right:0!important;
  bottom:var(--sk-cta-bottom, 64px)!important;
  top:auto!important;
  width:100%!important;
  max-width:none!important;
  margin:0!important;
  border-radius:0!important;
  z-index:30!important;
  box-shadow:0 -10px 28px rgba(0,0,0,.06);
}
    `;
    document.head.appendChild(style);
  }

  function buildWhatsApp() {
    return (
      '<a class="sk-cta__wa" target="_blank" rel="noopener noreferrer">' +
      '<span class="sk-cta__wa-copy">' +
      '<p class="sk-cta__wa-title">' +
      escapeHtml(t(CONFIG.i18n.stillNotSure)) +
      '</p>' +
      '<p class="sk-cta__wa-sub">' +
      escapeHtml(t(CONFIG.i18n.askWhatsapp)) +
      '</p>' +
      '</span>' +
      chevronSvg() +
      '</a>'
    );
  }

  function buildSummary() {
    return (
      '<div class="sk-cta__summary" aria-live="polite">' +
      '<span class="sk-cta__options is-empty"></span>' +
      '<span class="sk-cta__price"></span>' +
      '</div>'
    );
  }

  function buildRoot() {
    const root = document.createElement('div');
    root.id = ROOT_ID;
    root.setAttribute('dir', DIR);
    root.innerHTML = buildSummary();
    return root;
  }

  function buildEndHost() {
    const host = document.createElement('div');
    host.id = END_ID;
    host.setAttribute('dir', DIR);
    host.innerHTML =
      '<div class="sk-cta__end-pad">' +
      buildWhatsApp() +
      '</div>' +
      '<div id="' + SLOT_ID + '" class="sk-cta__end-slot"></div>';
    return host;
  }

  function stickyBar() {
    return document.querySelector('.sticky-product-bar');
  }

  function hideOriginalInfo(bar) {
    const selectors = [
      '.sticky-product-bar__quantity',
      'salla-quantity-input',
      'salla-mini-checkout-widget',
      'salla-quick-buy',
      'apple-pay-button',
      '.s-add-product-button-mini-checkout',
      '.s-mini-checkout',
    ];
    selectors.forEach(function (sel) {
      bar.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('sk-cta-hide-original');
      });
    });
    const nodes = bar.querySelectorAll('div');
    for (let i = 0; i < nodes.length; i++) {
      const cls = String(nodes[i].className || '');
      if (cls.indexOf('mob:!hidden') !== -1) {
        nodes[i].classList.add('sk-cta-hide-original');
      }
    }
  }

  function ensureHome(bar) {
    let home = document.getElementById(HOME_ID);
    if (!home) {
      home = document.createElement('div');
      home.id = HOME_ID;
      home.className = 'sk-cta-home';
      if (bar.parentNode) bar.parentNode.insertBefore(home, bar);
    }
    return home;
  }

  function restoreBarHome(bar, home) {
    if (!bar || !home || !home.parentNode) return;
    if (bar.parentNode === home) {
      home.parentNode.insertBefore(bar, home);
      return;
    }
    if (bar.previousElementSibling === home) return;
    if (home.nextSibling) home.parentNode.insertBefore(bar, home.nextSibling);
    else home.parentNode.appendChild(bar);
  }

  function placeBar(bar) {
    const home = ensureHome(bar);
    const slot = document.getElementById(SLOT_ID);
    if (!isCompactViewport()) {
      restoreBarHome(bar, home);
      if (slot) slot.style.height = '';
      home.style.height = '';
      bar.classList.remove('is-floating', 'is-docked');
      document.body.classList.remove('sk-cta-floating', 'sk-cta-docked');
    }
    return home;
  }

  function findGiftBlock() {
    return document.querySelector(
      'form.product-form salla-gifting, salla-gifting, .gift-sharing, [class*="gift-sharing"]'
    );
  }

  function placeBeforeFooter(host) {
    host.classList.add('sk-cta--page-end');
    host.classList.remove('sk-cta--in-product');
    const footer = document.querySelector(
      'footer.store-footer, .store-footer, footer, .site-footer, #footer'
    );
    if (footer && footer.parentNode) {
      if (host.nextElementSibling !== footer) {
        footer.parentNode.insertBefore(host, footer);
      }
      return;
    }
    const appInner = document.querySelector('.app-inner');
    if (appInner) {
      if (host.parentNode !== appInner || appInner.lastElementChild !== host) {
        appInner.appendChild(host);
      }
      return;
    }
    if (host.parentNode !== document.body) document.body.appendChild(host);
  }

  function placeEndHost(host) {
    if (!host) return;
    if (!isCompactViewport()) {
      const gift = findGiftBlock();
      if (gift && gift.parentNode) {
        host.classList.add('sk-cta--in-product');
        host.classList.remove('sk-cta--page-end');
        if (host.nextElementSibling !== gift) {
          gift.parentNode.insertBefore(host, gift);
        }
        return;
      }
      const bar = stickyBar();
      const slot = document.getElementById(SLOT_ID);
      if (bar && bar.parentNode && bar.parentNode !== slot) {
        host.classList.add('sk-cta--in-product');
        host.classList.remove('sk-cta--page-end');
        if (host.previousElementSibling !== bar) {
          bar.parentNode.insertBefore(host, bar.nextSibling);
        }
        return;
      }
    }
    placeBeforeFooter(host);
  }

  function headerOffset() {
    const header = document.querySelector('.bottom-header');
    if (!header) return 0;
    const style = window.getComputedStyle(header);
    if (style.display === 'none' || style.visibility === 'hidden') return 0;
    const height = Math.round(header.getBoundingClientRect().height);
    return height > 0 ? height : 64;
  }

  function isCompactViewport() {
    if (window.innerWidth <= 767) return true;
    if (typeof window.matchMedia === 'function' && window.matchMedia(COMPACT_MQ).matches) {
      return true;
    }
    const header = document.querySelector('.bottom-header');
    if (!header) return false;
    const style = window.getComputedStyle(header);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    return header.getBoundingClientRect().height > 0 && window.innerWidth < 1024;
  }

  function syncScrollPad(height) {
    const next = height > 0 ? Math.round(height) : 0;
    let pad = document.getElementById(PAD_ID);
    if (!next) {
      if (pad && pad.parentNode) pad.parentNode.removeChild(pad);
      return;
    }
    if (!pad) {
      pad = document.createElement('div');
      pad.id = PAD_ID;
      pad.setAttribute('aria-hidden', 'true');
    }
    const host = document.querySelector('.app-inner') || document.body;
    if (pad.parentNode !== host || host.lastElementChild !== pad) host.appendChild(pad);
    const px = next + 'px';
    if (pad.style.height !== px) pad.style.height = px;
  }

  function setBarMode(bar, slot, mode, slotHeight) {
    bar.classList.toggle('is-floating', mode === 'floating');
    bar.classList.remove('is-docked');
    document.body.classList.toggle('sk-cta-floating', mode === 'floating');
    document.body.classList.remove('sk-cta-docked');
    if (slot) slot.style.height = slotHeight ? slotHeight + 'px' : '';
  }

  let barMode = 'inflow';
  let stickObserver = null;

  function syncBarMode() {
    const bar = stickyBar();
    const home = document.getElementById(HOME_ID);
    const slot = document.getElementById(SLOT_ID);
    if (!bar || !home || !bar.classList.contains(BAR_CLASS)) return;

    const compact = isCompactViewport();
    const headerH = compact ? headerOffset() || 64 : headerOffset();
    document.documentElement.style.setProperty('--sk-cta-bottom', headerH + 'px');

    if (!compact) {
      barMode = 'inflow';
      restoreBarHome(bar, home);
      home.style.height = '';
      syncScrollPad(0);
      setBarMode(bar, slot, 'inflow', 0);
      return;
    }

    const y = window.pageYOffset || document.documentElement.scrollTop || 0;
    const startOffset = Math.min(120, Math.max(64, Math.round(window.innerHeight * 0.12)));
    const slider = document.querySelector(
      'salla-slider.details-slider, .details-slider, .image-slider'
    );
    const sliderGone = slider && slider.getBoundingClientRect().bottom < 96;
    const homeTop = home.getBoundingClientRect().top;
    const trigger = bar.parentNode === slot ? home : bar;
    const ctaGone = trigger.getBoundingClientRect().bottom < 8 || homeTop < 8;
    const pastHome = y > startOffset || sliderGone || ctaGone;
    const barH = Math.max(
      Math.ceil(bar.getBoundingClientRect().height) || 0,
      bar.offsetHeight || 0,
      88
    );

    // Stay fixed after the original button scrolls away. Docking the bar into
    // the page-end slot changes document height and flips the mode back, which
    // makes the button shake between fixed and in-flow at the bottom.
    if (pastHome) {
      restoreBarHome(bar, home);
      home.style.height = barH + 'px';
      if (slot) slot.style.height = '';
      syncScrollPad(barH);
      setBarMode(bar, slot, 'floating', 0);
      barMode = 'floating';
      return;
    }

    restoreBarHome(bar, home);
    home.style.height = '';
    if (slot) slot.style.height = '';
    syncScrollPad(0);
    setBarMode(bar, slot, 'inflow', 0);
    barMode = 'inflow';
  }

  let pagePadObserver = null;
  let ticking = false;

  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      syncBarMode();
    });
  }

  function onViewportChange() {
    placeEndHost(document.getElementById(END_ID));
    const bar = stickyBar();
    if (bar) placeBar(bar);
    syncBarMode();
  }

  function watchBar(bar) {
    syncBarMode();
    if (pagePadObserver) pagePadObserver.disconnect();
    if (typeof ResizeObserver === 'function') {
      pagePadObserver = new ResizeObserver(function () {
        syncBarMode();
      });
      pagePadObserver.observe(bar);
      const end = document.getElementById(END_ID);
      if (end) pagePadObserver.observe(end);
      const header = document.querySelector('.bottom-header');
      if (header) pagePadObserver.observe(header);
    }
    if (stickObserver) stickObserver.disconnect();
    if (typeof IntersectionObserver === 'function') {
      stickObserver = new IntersectionObserver(
        function () {
          syncBarMode();
        },
        { threshold: [0, 0.01, 1] }
      );
      const home = document.getElementById(HOME_ID);
      const slot = document.getElementById(SLOT_ID);
      if (home) stickObserver.observe(home);
      if (slot) stickObserver.observe(slot);
      stickObserver.observe(bar);
    }
  }

  function mount() {
    const bar = stickyBar();
    if (!bar) return false;

    injectStyles();
    bar.classList.add(BAR_CLASS);
    hideOriginalInfo(bar);

    let root = document.getElementById(ROOT_ID);
    if (!root) {
      root = buildRoot();
      bar.insertBefore(root, bar.firstChild);
    } else if (root.querySelector('.sk-cta__wa')) {
      const summary = root.querySelector('.sk-cta__summary');
      root.innerHTML = summary ? summary.outerHTML : buildSummary();
    }

    let host = document.getElementById(END_ID);
    if (!host) host = buildEndHost();
    placeEndHost(host);
    placeBar(bar);

    bindEvents(bar);
    render();
    watchBar(bar);
    window.requestAnimationFrame(onViewportChange);
    [300, 1000, 2500].forEach(function (delay) {
      window.setTimeout(onViewportChange, delay);
    });
    return true;
  }

  function unwrapBar() {
    const home = document.getElementById(HOME_ID);
    const bar = stickyBar();
    if (bar && home && home.parentNode) {
      home.parentNode.insertBefore(bar, home);
    }
    if (home && home.parentNode) home.parentNode.removeChild(home);
  }

  function unmount() {
    const root = document.getElementById(ROOT_ID);
    if (root && root.parentNode) root.parentNode.removeChild(root);
    const host = document.getElementById(END_ID);
    if (host && host.parentNode) host.parentNode.removeChild(host);
    const bar = stickyBar();
    if (bar) {
      bar.classList.remove(BAR_CLASS, 'is-floating', 'is-docked');
    }
    unwrapBar();
    if (pagePadObserver) {
      pagePadObserver.disconnect();
      pagePadObserver = null;
    }
    if (stickObserver) {
      stickObserver.disconnect();
      stickObserver = null;
    }
    window.removeEventListener('resize', onViewportChange);
    window.removeEventListener('scroll', onScrollOrResize);
    document.removeEventListener('scroll', onScrollOrResize, true);
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', onScrollOrResize);
      window.visualViewport.removeEventListener('scroll', onScrollOrResize);
    }
    const pad = document.getElementById(PAD_ID);
    if (pad && pad.parentNode) pad.parentNode.removeChild(pad);
    document.documentElement.style.removeProperty('--sk-cta-page-pad');
    document.documentElement.style.removeProperty('--sk-cta-bottom');
    document.documentElement.style.removeProperty('--sk-cta-dock-top');
    document.body.classList.remove('sk-cta-has-offset', 'sk-cta-floating', 'sk-cta-docked');
    const style = document.getElementById(STYLE_ID);
    if (style && style.parentNode) style.parentNode.removeChild(style);
  }

  function render() {
    const root = document.getElementById(ROOT_ID);
    const host = document.getElementById(END_ID);
    if (!root && !host) return;

    if (root) root.setAttribute('dir', DIR);
    if (host) host.setAttribute('dir', DIR);

    const picked = selectedOptions();
    const label = formatSelectedLabel(picked);
    const optionsEl = root && root.querySelector('.sk-cta__options');
    const priceEl = root && root.querySelector('.sk-cta__price');
    const wa = host && host.querySelector('.sk-cta__wa');

    if (optionsEl) {
      optionsEl.textContent = label || t(CONFIG.i18n.chooseOptions);
      optionsEl.classList.toggle('is-empty', !label);
    }
    if (priceEl && !priceEl.dataset.locked) {
      const pieces = readPricePieces();
      if (pieces) paintPrice(priceEl, ensureRiyal(pieces));
    }
    if (wa) {
      const href = whatsappHref(label);
      wa.setAttribute('href', href);
      wa.setAttribute(
        'aria-label',
        t(CONFIG.i18n.stillNotSure) + ' — ' + t(CONFIG.i18n.askWhatsapp)
      );
      if (!whatsappNumber()) {
        wa.setAttribute('aria-disabled', 'true');
      } else {
        wa.removeAttribute('aria-disabled');
      }
    }
  }

  function setPrice(text) {
    const priceEl = document.querySelector('#' + ROOT_ID + ' .sk-cta__price');
    if (!priceEl) return;
    let pieces = null;
    const raw = String(text == null ? '' : text);
    if (/</.test(raw)) {
      const tmp = document.createElement('div');
      tmp.innerHTML = raw;
      pieces = pricePiecesFrom(tmp);
    } else if (raw) {
      pieces = [{ text: plainPriceText(raw) }];
    }
    if (!pieces || !isCleanPrice(piecesText(pieces))) return;
    paintPrice(priceEl, ensureRiyal(pieces));
    priceEl.dataset.locked = '1';
    window.setTimeout(function () {
      delete priceEl.dataset.locked;
    }, 800);
  }

  let bound = false;

  function bindEvents(bar) {
    if (bound) return;
    bound = true;

    const form = document.querySelector('form.product-form');
    if (form) {
      form.addEventListener('change', render);
      form.addEventListener('input', render);
    }

    window.addEventListener('resize', onViewportChange);
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    document.addEventListener('scroll', onScrollOrResize, { passive: true, capture: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onScrollOrResize);
      window.visualViewport.addEventListener('scroll', onScrollOrResize, { passive: true });
    }
    if (typeof window.matchMedia === 'function') {
      const mq = window.matchMedia(COMPACT_MQ);
      if (mq.addEventListener) mq.addEventListener('change', onViewportChange);
      else if (mq.addListener) mq.addListener(onViewportChange);
    }

    const host = document.getElementById(END_ID);
    if (host) {
      host.addEventListener('click', function (event) {
        const link = event.target.closest('.sk-cta__wa');
        if (!link) return;
        if (!whatsappNumber() || link.getAttribute('href') === '#') {
          event.preventDefault();
        }
      });
    }

    const optionsEl = document.querySelector('salla-product-options');
    if (optionsEl) {
      optionsEl.addEventListener('change', render);
      optionsEl.addEventListener('salla-product-options:change', render);
    }

    try {
      if (
        window.salla &&
        salla.product &&
        salla.product.event &&
        typeof salla.product.event.onPriceUpdated === 'function'
      ) {
        salla.product.event.onPriceUpdated(function (payload) {
          const formatted = priceFromEvent(payload);
          if (formatted) setPrice(formatted);
          render();
        });
      }
    } catch (e) {
      /* ignore */
    }

    const priceTargets = bar.querySelectorAll('.total-price, .price');
    if (priceTargets.length && window.MutationObserver) {
      const priceObserver = new MutationObserver(function () {
        render();
      });
      priceTargets.forEach(function (el) {
        priceObserver.observe(el, { childList: true, characterData: true, subtree: true });
      });
    }
  }

  function boot() {
    refreshLang();
    if (!isProductPage()) {
      unmount();
      return;
    }
    if (mount()) return;

    let tries = 0;
    const timer = window.setInterval(function () {
      tries += 1;
      if (mount() || tries > 40) window.clearInterval(timer);
    }, 150);
  }

  let lastUrl = window.location.href;
  let bootTimer = null;

  function scheduleBoot() {
    clearTimeout(bootTimer);
    bootTimer = setTimeout(boot, 50);
  }

  function start() {
    scheduleBoot();
    if (window.salla && typeof salla.onReady === 'function') {
      salla.onReady().then(scheduleBoot);
    }
    const observer = new MutationObserver(function () {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        bound = false;
        barMode = 'inflow';
        scheduleBoot();
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
