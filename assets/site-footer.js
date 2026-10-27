(() => {
  const footer = document.querySelector('.site-footer');
  if (!footer || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  footer.classList.add('site-footer--ready');
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      footer.classList.add('is-visible');
      observer.disconnect();
    }
  }, { threshold: 0.1 });
  observer.observe(footer);
})();
