(() => {
  'use strict';

  function initialize() {
    const researchMenus = document.querySelectorAll('[data-research-menu]');

    function targetFor(hash) {
      if (!hash || hash === '#') return null;
      try {
        return document.getElementById(decodeURIComponent(hash.slice(1)));
      } catch {
        return null;
      }
    }

    function reveal(target) {
      let changed = false;
      for (let node = target; node; node = node.parentElement) {
        if (node.tagName === 'DETAILS' && !node.open) {
          node.open = true;
          changed = true;
        }
      }
      if (target.closest('#research')) {
        researchMenus.forEach(menu => {
          if (!menu.open) {
            menu.open = true;
            changed = true;
          }
        });
      }
      return changed;
    }

    function revealLocation() {
      const target = targetFor(location.hash);
      if (target && reveal(target)) {
        // Opening disclosures can change layout after the browser's first scroll.
        target.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    }

    document.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
          event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href]');
      if (!link || link.hasAttribute('download') || link.target === '_blank') return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname ||
          url.search !== location.search) return;
      const target = targetFor(url.hash);
      // Keep native anchor/history behavior, including repeated same-hash clicks.
      if (target) reveal(target);
    });

    window.addEventListener('hashchange', revealLocation);
    window.addEventListener('popstate', revealLocation);
    revealLocation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else initialize();
})();
