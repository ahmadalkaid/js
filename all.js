/**
 * Alshiaka — Salla storefront entry point
 * Small page-aware loader; module settings travel with each module.
 * This URL remains fixed in Salla across all future publishes.
 */
window.__SHEYAKA_MANIFEST__ = {
  "product-colors": {
    "file": "modules/product-colors.44ac0510b4283b4c.js"
  },
  "product-options": {
    "file": "modules/product-options.857a0d3213d39438.js"
  },
  "build-your-look": {
    "file": "modules/build-your-look.77f5382b52beac09.js",
    "showOnCategoryIds": [
      "1617996248"
    ]
  },
  "category-filters": {
    "file": "modules/category-filters.a4493dd6f6aca6af.js"
  },
  "mobile-header": {
    "file": "modules/mobile-header.04d0c57b4d070c1f.js"
  },
  "nearest-branch": {
    "file": "modules/nearest-branch.e2190d7809a3a2b6.js",
    "showOn": "home",
    "branchesPage": "1146232250"
  },
  "product-whatsapp-cta": {
    "file": "modules/product-whatsapp-cta.2249869cfc8896f9.js"
  },
  "bundle-widget": {
    "file": "modules/bundle-widget.808bb94bc8567a60.js"
  },
  "product-reviews": {
    "file": "modules/product-reviews.b267127424afaa3d.js"
  },
  "product-faqs": {
    "file": "modules/product-faqs.9ca45aac0ec6bf21.js"
  }
};
/**
 * Alshiaka storefront loader (classic JavaScript, no framework).
 *
 * This file is included in scripts/all.js at publish time. The admin dashboard
 * provides window.__SHEYAKA_CONFIGS__ and window.__SHEYAKA_MANIFEST__ beforehand.
 * No category IDs or product option values are hardcoded in the dispatcher.
 *
 * Modules are plain scripts, loaded only on relevant pages. The module filenames
 * include a content hash, so unchanged modules remain cached across publishes.
 */
(function startAlshiaka() {
  'use strict';

  if (window.__SHEYAKA_LOADER__) return;

  const entry = document.currentScript;
  const baseUrl = new URL('.', entry && entry.src ? entry.src : document.baseURI);
  const manifest = window.__SHEYAKA_MANIFEST__ || {};
  const loaded = new Set();
  const scheduled = new Set();
  const metrics = { page: '', modules: [], startedAt: performance.now() };
  window.__SHEYAKA_PERF__ = metrics;
  window.__SHEYAKA_LOADER__ = true;

  function sallaPage() {
    try {
      return window.salla?.config?.get('page') || window.sallainfo?.page || {};
    } catch (_) {
      return window.sallainfo?.page || {};
    }
  }

  function pageType() {
    const path = location.pathname.replace(/\/+$/, '') || '/';
    const info = sallaPage();
    const name = String(info.slug || info.type || info.route || '').toLowerCase();

    // Route URLs have the highest priority: "product.index" can represent a
    // Salla *listing* page, so it must not be treated as a product detail page.
    if (/\/c\d+(?:\/|$)/.test(path)) return 'category';
    if (/\/p\d+(?:\/|$)/.test(path)) return 'product';

    if (/categor(?:y|ies)/.test(name) ||
        (name === 'product.index' && document.querySelector('salla-products-list'))) {
      return 'category';
    }
    if (/product[.\/_-]single/.test(name) ||
        document.querySelector('salla-product-options') ||
        (/product/.test(name) && name !== 'product.index')) {
      return 'product';
    }
    if (info.id && document.querySelector('salla-products-list')) return 'category';
    if (path === '/' || /^\/(?:ar|en)$/.test(path) || name === 'index' || name === 'home' || name === 'home.index') return 'home';
    return 'other';
  }

  function categoryId() {
    const match = location.pathname.match(/\/c(\d+)/);
    if (match) return match[1];
    const info = sallaPage();
    return info.id == null ? '' : String(info.id);
  }

  function shouldLoad(slug, type) {
    const config = manifest[slug] || {};
    switch (slug) {
      case 'mobile-header':
        // Legacy module name: this implements BOTH desktop and mobile headers.
        // It was previously excluded on desktop, leaving Salla's mobile fallback
        // visible and removing the full search / category navigation.
        // The module applies its own responsive styles and handles resizing.
        return true;
      case 'nearest-branch':
        return config.showOn === 'all' || type === 'home' ||
          (config.branchesPage && location.pathname.includes('page-' + config.branchesPage));
      case 'category-filters':
        return type === 'category';
      case 'build-your-look': {
        if (type !== 'category') return false;
        const ids = config.showOnCategoryIds || [];
        return ids.length > 0 && ids.map(String).includes(categoryId());
      }
      case 'bundle-widget':
      case 'product-colors':
      case 'product-options':
      case 'product-whatsapp-cta':
      case 'product-reviews':
      case 'product-faqs':
        return type === 'product';
      default:
        return false;
    }
  }

  function load(slug) {
    if (loaded.has(slug) || !manifest[slug]?.file) return;
    loaded.add(slug);
    const script = document.createElement('script');
    // Classic scripts work across origins without module-CORS configuration.
    script.async = false;
    script.src = new URL(manifest[slug].file, baseUrl).href;
    script.dataset.sheyakaModule = slug;
    script.addEventListener('error', () => {
      loaded.delete(slug);
      console.error('[Alshiaka] Unable to load module:', slug);
    }, { once: true });
    document.head.appendChild(script);
    metrics.modules.push(slug);
  }

  function lazyLoad(slug) {
    if (loaded.has(slug) || scheduled.has(slug)) return;
    scheduled.add(slug);
    const callback = () => {
      scheduled.delete(slug);
      if (shouldLoad(slug, pageType())) load(slug);
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(callback, { timeout: 1800 });
    } else {
      setTimeout(callback, 450);
    }
  }

  function run() {
    const type = pageType();
    metrics.page = type;

    // Site chrome is critical. Load it before category/product enhancements so
    // the full desktop header does not wait behind larger feature scripts.
    if (shouldLoad('mobile-header', type)) load('mobile-header');

    for (const slug of Object.keys(manifest)) {
      if (slug === 'mobile-header' || !shouldLoad(slug, type)) continue;
      if (['nearest-branch', 'product-reviews', 'product-faqs'].includes(slug)) lazyLoad(slug);
      else load(slug);
    }
  }

  // No polling. Boot once on DOM readiness and when the Salla SDK is ready.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
  if (typeof window.salla?.onReady === 'function') {
    window.salla.onReady().then(run).catch(() => undefined);
  }

  // The shared header module handles screen-size changes internally.
  // Salla themes sometimes update routes without reloading the document.
  window.addEventListener('popstate', run);
  window.addEventListener('hashchange', run);
  if (typeof window.salla?.event?.on === 'function') {
    window.salla.event.on('page::loaded', run);
  }
})();

