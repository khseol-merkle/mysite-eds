function getVideoEmbedUrl(url) {
  try {
    const u = new URL(url);
    // YouTube
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      const id = u.hostname.includes('youtu.be')
        ? u.pathname.slice(1)
        : u.searchParams.get('v');
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
    }
    // Vimeo
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
  } catch { /* not a valid URL */ }
  return null;
}

function trapFocus(overlay) {
  const focusable = overlay.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  overlay.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

function closeModal(overlay, trigger) {
  overlay.classList.remove('open');
  document.body.style.overflow = '';

  // stop video playback
  const iframe = overlay.querySelector('iframe');
  if (iframe) iframe.removeAttribute('src');

  if (trigger) trigger.focus();
}

function openModal(overlay) {
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // lazy-load video embed
  const videoContainer = overlay.querySelector('.modal-video-container');
  if (videoContainer && !videoContainer.querySelector('iframe')) {
    const { embedUrl } = videoContainer.dataset;
    if (embedUrl) {
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
      iframe.setAttribute('title', 'Video');
      videoContainer.append(iframe);
    }
  } else if (videoContainer) {
    const iframe = videoContainer.querySelector('iframe');
    if (iframe && !iframe.src) {
      iframe.src = videoContainer.dataset.embedUrl;
    }
  }

  // focus close button
  const closeBtn = overlay.querySelector('.modal-close');
  if (closeBtn) closeBtn.focus();
}

export default function decorate(block) {
  // determine modal id from block index
  const allModals = [...document.querySelectorAll('.modal')];
  const index = allModals.indexOf(block.closest('.modal') || block);
  const modalId = index > 0 ? `modal-${index + 1}` : 'modal';

  // build dialog content
  const content = document.createElement('div');
  content.className = 'modal-content';

  // check for video links and convert
  let videoContainer = null;
  const links = block.querySelectorAll('a[href]');
  links.forEach((a) => {
    const embedUrl = getVideoEmbedUrl(a.href);
    if (embedUrl) {
      videoContainer = document.createElement('div');
      videoContainer.className = 'modal-video-container';
      videoContainer.dataset.embedUrl = embedUrl;
      a.closest('div')?.remove();
    }
  });

  // move remaining block children into content
  while (block.firstElementChild) {
    content.append(block.firstElementChild);
  }

  // close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.setAttribute('aria-label', 'Close modal');
  closeBtn.innerHTML = '&#x2715;';

  // dialog
  const dialog = document.createElement('div');
  dialog.className = 'modal-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.id = modalId;

  // find a heading for aria-label
  const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    dialog.setAttribute('aria-label', heading.textContent.trim());
  } else {
    dialog.setAttribute('aria-label', 'Modal');
  }

  dialog.append(closeBtn);
  if (videoContainer) dialog.append(videoContainer);
  dialog.append(content);

  // overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.append(dialog);

  // append overlay to body
  document.body.append(overlay);

  // event: close button
  let activeTrigger = null;
  closeBtn.addEventListener('click', () => closeModal(overlay, activeTrigger));

  // event: overlay click (outside dialog)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay, activeTrigger);
  });

  // event: escape key
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal(overlay, activeTrigger);
  });

  // focus trap
  trapFocus(overlay);

  // use event delegation on document to catch clicks on trigger links
  // this ensures clicks work even if triggers are added after the modal decorates
  const hash = `#${modalId}`;
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest(`a[href="${hash}"], a[href$="${hash}"]`);
    if (trigger) {
      e.preventDefault();
      e.stopPropagation();
      activeTrigger = trigger;
      openModal(overlay);
    }
  });
}
