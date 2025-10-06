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
});
