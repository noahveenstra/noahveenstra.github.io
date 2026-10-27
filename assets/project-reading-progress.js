(() => {
  const footer = document.querySelector(".site-footer, footer");
  if (!footer || document.querySelector(".project-reading-progress")) return;

  const progress = document.createElement("div");
  progress.className = "project-reading-progress";
  progress.setAttribute("aria-hidden", "true");
  const fill = document.createElement("span");
  fill.className = "project-reading-progress__fill";
  progress.append(fill);
  const header = document.querySelector(".pager");
  (header || document.body).append(progress);

  let frame = 0;
  function update() {
    frame = 0;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const footerBottom = footer.getBoundingClientRect().bottom + window.scrollY;
    const endScroll = Math.max(1, footerBottom - viewportHeight);
    const atFooterEnd = window.scrollY + viewportHeight >= footerBottom - 1;
    const fraction = atFooterEnd
      ? 1
      : Math.max(0, Math.min(1, window.scrollY / endScroll));
    fill.style.transform = "scaleX(" + fraction + ")";
  }
  function scheduleUpdate() {
    if (!frame) frame = window.requestAnimationFrame(update);
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.addEventListener("orientationchange", scheduleUpdate, { passive: true });
  window.addEventListener("load", scheduleUpdate, { once: true });
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(document.documentElement);
    observer.observe(document.body);
    observer.observe(footer);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleUpdate);
  }
  update();
})();
