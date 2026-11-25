(() => {
  'use strict';

  function initialize() {
    const root = document.getElementById('selected-projects');
    if (!root) return;

    const initialized = new WeakSet();
    const videos = new Set();
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection;

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
    root.querySelectorAll(selector).forEach(mount);

    new MutationObserver(records => {
      records.forEach(record => {
        record.addedNodes.forEach(node => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
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
