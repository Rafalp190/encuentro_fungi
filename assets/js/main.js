// Handles nav toggle and shared interactive behaviors
window.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navList = document.querySelector('[data-nav]');
  const pageId = document.body.dataset.page;

  if (navList && pageId) {
    navList.querySelectorAll('a[data-page]').forEach((link) => {
      const isCurrent = link.dataset.page === pageId;
      link.classList.toggle('is-current', isCurrent);
      if (isCurrent) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navList.classList.contains('is-open')) {
        navList.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (pageId === 'gallery') {
    initGalleryPage();
  }

  async function initGalleryPage() {
    const filterContainer = document.querySelector('[data-gallery-filters]');
    const grid = document.querySelector('[data-gallery-grid]');
    const status = document.querySelector('[data-gallery-status]');
    const emptyMessage = document.querySelector('[data-gallery-empty]');
    const modal = document.querySelector('[data-gallery-modal]');

    if (!filterContainer || !grid || !status || !emptyMessage || !modal) {
      return;
    }

    const modalImage = modal.querySelector('[data-gallery-modal-image]');
    const modalCaption = modal.querySelector('[data-gallery-modal-caption]');
    const modalDownload = modal.querySelector('[data-gallery-modal-download]');
    const closeButton = modal.querySelector('.gallery-modal__close');
    const dismissTriggers = modal.querySelectorAll('[data-gallery-dismiss]');

    let cards = [];
    let activeFilter = 'all';
    let previousFocus = null;
    let escapeHandlerBound = null;

    setStatus('Cargando galería…');

    let payload = window.GALLERY_DATA;
    if (!payload) {
      try {
        const response = await fetch('assets/data/gallery.json', { cache: 'no-cache' });
        if (!response.ok) {
          throw new Error(`Respuesta inesperada: ${response.status}`);
        }
        payload = await response.json();
      } catch (error) {
        console.error('No se pudo cargar la galería', error);
      }
    }

    if (!payload) {
      setStatus('No se pudo cargar la galería. Intenta nuevamente más tarde.');
      return;
    }

    const categories = Array.isArray(payload.categories) ? payload.categories : [];
    const filters = [{ id: 'all', label: 'Todos los momentos' }, ...categories.map(({ id, label }) => ({ id, label }))];
    renderFilters(filters);

    const images = categories.flatMap((category) => {
      const pictures = Array.isArray(category.images) ? category.images : [];
      return pictures.map((image) => ({
        ...image,
        categoryId: category.id,
        categoryLabel: category.label,
      }));
    });

    cards = renderGallery(images);
    applyFilter(activeFilter);
    setStatus('');

    filterContainer.addEventListener('click', (event) => {
      const button = event.target.closest('[data-filter]');
      if (!button) {
        return;
      }

      const nextFilter = button.dataset.filter;
      if (!nextFilter || nextFilter === activeFilter) {
        return;
      }

      setActiveFilter(nextFilter);
      applyFilter(nextFilter);
    });

    grid.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-gallery-open]');
      if (!trigger) {
        return;
      }

      const imageSrc = trigger.dataset.galleryOpen;
      const imageLabel = trigger.dataset.galleryLabel || '';
      if (!imageSrc) {
        return;
      }

      openModal({ src: imageSrc, label: imageLabel });
    });

    dismissTriggers.forEach((trigger) => {
      trigger.addEventListener('click', closeModal);
    });

    function renderFilters(filters) {
      filterContainer.innerHTML = '';
      filters.forEach((filter, index) => {
        const button = document.createElement('button');
        button.className = 'filter-button';
        button.type = 'button';
        button.textContent = filter.label;
        button.dataset.filter = filter.id;

        const isActive = index === 0;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));

        filterContainer.appendChild(button);
      });
    }

    function renderGallery(images) {
      grid.innerHTML = '';
      const createdCards = images.map((image) => {
        const card = document.createElement('article');
        card.className = 'gallery-card';
        card.dataset.category = image.categoryId;

        const button = document.createElement('button');
        button.className = 'gallery-card__trigger';
        button.type = 'button';
        button.dataset.galleryOpen = image.src;
        button.dataset.galleryLabel = image.label;

        const picture = document.createElement('img');
        picture.className = 'gallery-thumb';
        picture.src = image.src;
        picture.alt = image.label;
        picture.loading = 'lazy';

        button.appendChild(picture);

        const caption = document.createElement('div');
        caption.className = 'gallery-caption';
        caption.textContent = image.label;

        card.appendChild(button);
        card.appendChild(caption);
        grid.appendChild(card);
        return card;
      });

      if (createdCards.length === 0) {
        emptyMessage.hidden = false;
        emptyMessage.textContent = 'Todavía no hay imágenes disponibles.';
      } else {
        emptyMessage.hidden = true;
      }

      return createdCards;
    }

    function setStatus(message) {
      if (!message) {
        status.textContent = '';
        status.hidden = true;
      } else {
        status.hidden = false;
        status.textContent = message;
      }
    }

    function setActiveFilter(nextFilter) {
      activeFilter = nextFilter;
      filterContainer.querySelectorAll('[data-filter]').forEach((button) => {
        const isActive = button.dataset.filter === nextFilter;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
    }

    function applyFilter(filterId) {
      let visibleCount = 0;
      cards.forEach((card) => {
        const matches = filterId === 'all' || card.dataset.category === filterId;
        card.hidden = !matches;
        card.classList.toggle('is-hidden', !matches);
        if (matches) {
          visibleCount += 1;
        }
      });

      if (visibleCount === 0) {
        emptyMessage.hidden = false;
        emptyMessage.textContent = filterId === 'all'
          ? 'Todavía no hay imágenes disponibles.'
          : 'No hay imágenes en esta colección todavía.';
      } else {
        emptyMessage.hidden = true;
      }
    }

    function openModal(image) {
      if (!modalImage || !modalCaption || !modalDownload) {
        return;
      }

      modal.hidden = false;
      modal.classList.add('is-visible');
      document.body.classList.add('is-locked');

      modalImage.src = image.src;
      modalImage.alt = image.label;
      modalCaption.textContent = image.label;
      modalDownload.href = image.src;
      modalDownload.setAttribute('download', image.label);

      previousFocus = document.activeElement;
      const focusTarget = closeButton || modalDownload;
      if (focusTarget) {
        focusTarget.focus();
      }

      escapeHandlerBound = (event) => {
        if (event.key === 'Escape') {
          closeModal();
        }
      };

      document.addEventListener('keydown', escapeHandlerBound);
    }

    function closeModal() {
      if (!modal.classList.contains('is-visible')) {
        return;
      }

      modal.classList.remove('is-visible');
      modal.hidden = true;
      document.body.classList.remove('is-locked');

      if (modalImage) {
        modalImage.src = '';
        modalImage.alt = '';
      }

      if (modalCaption) {
        modalCaption.textContent = '';
      }

      if (modalDownload) {
        modalDownload.removeAttribute('href');
        modalDownload.removeAttribute('download');
      }

      if (escapeHandlerBound) {
        document.removeEventListener('keydown', escapeHandlerBound);
        escapeHandlerBound = null;
      }

      if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus();
      }
    }
  }
});
