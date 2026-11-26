(() => {
  'use strict';

  function initialize() {
    const root = document.getElementById('selected-projects');
    if (!root) return;

    const initialized = new WeakSet();
    const videos = new Set();
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection;
    const carousels = new WeakSet();

    function mountCarousel(carousel) {
      if (carousels.has(carousel)) return;
      const slides = Array.from(carousel.querySelectorAll('[data-media-slide]'));
      const controls = carousel.querySelector('[data-carousel-controls]');
      if (!slides.length || !controls) return;
      const previous = controls.querySelector('[data-carousel-previous]');
      const next = controls.querySelector('[data-carousel-next]');
      const counter = controls.querySelector('[data-carousel-counter]');
      if (!previous || !next || !counter) return;
      carousels.add(carousel);
      let index = 0;
      function select(requested) {
        index = (requested + slides.length) % slides.length;
        slides.forEach((slide, position) => {
          if (position !== index) slide.querySelectorAll('video').forEach(video => video.pause());
          slide.hidden = position !== index;
        });
        counter.textContent = `Slide ${index + 1} of ${slides.length}`;
      }
      previous.addEventListener('click', () => select(index - 1));
      next.addEventListener('click', () => select(index + 1));
      // Keep arrow keys available for native video seeking outside these controls.
      controls.addEventListener('keydown', event => {
        const destinations = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: slides.length - 1 };
        if (!(event.key in destinations)) return;
        event.preventDefault();
        select(destinations[event.key]);
      });
      select(0);
      controls.hidden = slides.length < 2;
      carousel.setAttribute('data-carousel-ready', '');
    }

    // One shared native modal; ordinary image links remain the no-JS fallback.
    let lightbox;
    let returnFocus;
    function enlarge(link) {
      if (typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return false;
      if (!lightbox) {
        lightbox = document.createElement('dialog');
        lightbox.className = 'research-lightbox';
        lightbox.setAttribute('aria-labelledby', 'research-lightbox-title');
        lightbox.innerHTML = `
          <div class="research-lightbox-toolbar">
            <span class="research-lightbox-title" id="research-lightbox-title">Research figure</span>
            <button type="button" data-lightbox-zoom aria-pressed="false">Actual size</button>
            <button type="button" data-lightbox-close autofocus>Close</button>
          </div>
          <div class="research-lightbox-view" tabindex="0" aria-label="Research figure viewing area"><img alt="" /></div>
          <p class="research-lightbox-caption"></p>
          <p data-lightbox-error hidden role="status">The enlarged figure could not be loaded. <a>Open image file</a>.</p>`;
        document.body.append(lightbox);
        const view = lightbox.querySelector('.research-lightbox-view');
        const zoom = lightbox.querySelector('[data-lightbox-zoom]');
        zoom.addEventListener('click', () => {
          const zoomed = view.toggleAttribute('data-zoomed');
          zoom.setAttribute('aria-pressed', String(zoomed));
          zoom.textContent = zoomed ? 'Fit to screen' : 'Actual size';
        });
        lightbox.querySelector('[data-lightbox-close]').addEventListener('click', () => lightbox.close());
        lightbox.querySelector('img').addEventListener('error', () => {
          lightbox.querySelector('img').hidden = true;
          lightbox.querySelector('[data-lightbox-error]').hidden = false;
        });
        lightbox.addEventListener('close', () => {
          const target = returnFocus?.closest('[hidden]')
            ? root.querySelector('.project-filter[aria-pressed="true"]') : returnFocus;
          target?.focus({ preventScroll: true });
        });
      }
      const source = link.querySelector('img');
      const image = lightbox.querySelector('img');
      const view = lightbox.querySelector('.research-lightbox-view');
      const zoom = lightbox.querySelector('[data-lightbox-zoom]');
      view.removeAttribute('data-zoomed');
      zoom.setAttribute('aria-pressed', 'false');
      zoom.textContent = 'Actual size';
      image.hidden = false;
      image.alt = source?.alt || 'Research figure';
      image.src = link.href;
      lightbox.querySelector('[data-lightbox-error]').hidden = true;
      lightbox.querySelector('[data-lightbox-error] a').href = link.href;
      lightbox.querySelector('.research-lightbox-caption').textContent = link.closest('figure')?.querySelector('figcaption')?.textContent || image.alt;
      returnFocus = link;
      lightbox.showModal();
      view.scrollTo(0, 0);
      return true;
    }
    root.addEventListener('click', event => {
      const link = event.target.closest('a[data-research-enlarge]');
      if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (enlarge(link)) event.preventDefault();
    });

    function visible(video) {
      if (document.hidden || video.closest('[hidden]')) return false;
      const box = video.getBoundingClientRect();
      return box.width > 0 && box.height > 0 && box.bottom > 0 &&
        box.top < window.innerHeight && box.right > 0 && box.left < window.innerWidth;
    }

    function previewSettings(video) {
      if (!video.hasAttribute('data-preview')) return;
      video.defaultMuted = true;
      video.muted = true;
      video.loop = !motion.matches && !connection?.saveData;
    }

    function fallback(media) {
      const figure = media.closest('.project-media');
      if (!figure || media.hidden) return;
      const focused = document.activeElement === media;
      if (media.tagName === 'VIDEO') media.pause();
      media.hidden = true;

      let message = figure.querySelector('[data-media-fallback]');
      if (!message) {
        message = document.createElement('p');
        message.className = 'project-media-fallback';
        message.setAttribute('data-media-fallback', '');
        message.textContent = 'This media could not be displayed. The project description and related resources remain available.';
        figure.append(message);
      }
      message.setAttribute('role', 'status');
      message.hidden = false;

      if (media.tagName === 'VIDEO' && media.poster) {
        const poster = document.createElement('img');
        poster.src = media.poster;
        poster.alt = media.dataset.posterAlt || `Video poster: ${media.getAttribute('aria-label') || 'research demonstration'}`;
        poster.loading = 'lazy';
        poster.decoding = 'async';
        if (media.width && media.height) {
          poster.width = media.width;
          poster.height = media.height;
        }
        poster.addEventListener('error', () => poster.remove(), { once: true });
        figure.insertBefore(poster, message);
      }

      if (focused) {
        const link = figure.querySelector('[data-external-video]');
        if (link) link.focus({ preventScroll: true });
        else {
          message.tabIndex = -1;
          message.focus({ preventScroll: true });
        }
      }
    }

    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) entry.target.pause();
        });
      }, { threshold: 0 })
      : null;

    function mount(media) {
      if (initialized.has(media)) return;
      initialized.add(media);
      if (media.tagName === 'IMG') {
        media.loading = 'lazy';
        media.decoding = 'async';
        media.addEventListener('error', () => fallback(media));
        if (media.complete && media.currentSrc && !media.naturalWidth) fallback(media);
        return;
      }

      videos.add(media);
      media.controls = true;
      media.playsInline = true;
      media.preload = 'none';
      media.autoplay = false;
      media.removeAttribute('autoplay');
      if (!media.hasAttribute('aria-label') && !media.hasAttribute('aria-labelledby')) {
        const title = media.closest('.project-card')?.querySelector('.project-title');
        media.setAttribute('aria-label', `${title?.textContent.trim() || 'Research'} video`);
      }
      previewSettings(media);
      media.addEventListener('play', () => {
        if (!visible(media)) media.pause();
      });
      media.addEventListener('error', () => fallback(media));

      const sources = Array.from(media.querySelectorAll('source'));
      const failed = new Set();
      media.addEventListener('loadstart', () => failed.clear());
      sources.forEach(source => {
        source.addEventListener('error', () => {
          failed.add(source);
          if (failed.size === sources.length) fallback(media);
        });
      });
      if (media.error) fallback(media);
      observer?.observe(media);
    }

    const selector = '.project-media video[data-research-video], .project-media img[data-research-figure]';
    root.querySelectorAll('[data-research-carousel]').forEach(mountCarousel);
    root.querySelectorAll(selector).forEach(mount);
    if (typeof HTMLDialogElement !== 'undefined' && HTMLDialogElement.prototype.showModal) {
      root.querySelectorAll('[data-research-enlarge]').forEach(link => link.setAttribute('aria-haspopup', 'dialog'));
    }

    new MutationObserver(records => {
      records.forEach(record => {
        record.addedNodes.forEach(node => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          if (node.matches('[data-research-carousel]')) mountCarousel(node);
          node.querySelectorAll('[data-research-carousel]').forEach(mountCarousel);
          if (node.matches(selector)) mount(node);
          node.querySelectorAll(selector).forEach(mount);
        });
      });
      videos.forEach(video => {
        if (!root.contains(video)) {
          video.pause();
          observer?.unobserve(video);
          videos.delete(video);
        } else if (!visible(video)) video.pause();
      });
    }).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) videos.forEach(video => video.pause());
    });
    function preferenceChanged() {
      videos.forEach(video => {
        previewSettings(video);
        if (video.hasAttribute('data-preview') && (motion.matches || connection?.saveData)) video.pause();
      });
    }
    motion.addEventListener('change', preferenceChanged);
    connection?.addEventListener('change', preferenceChanged);
    // Playback is always initiated by the visitor, never by this enhancement.
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
