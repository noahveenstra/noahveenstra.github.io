(() => {
  const home = document.querySelector('main.home:not(.project)');
  const button = home?.querySelector('.projects-toggle');
  const intro = home?.querySelector('.intro');
  const panel = document.getElementById('work-list');
  if (!home || !button || !intro || !panel) return;

  const sharedProjectTitles = new Set([
    "pursuit intelligence",
    "saint city chapel",
    "instagram posting ui",
    "apple music",
    "disney world and live activities",
    "creating a responsive website for a local chiropractor's office"
  ]);
  const normalizeTitle = value => value
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  home.addEventListener("click", event => {
    const link = event.target.closest('a[href^="/work/"]');
    if (!link) return;

    const headings = home.querySelectorAll(".piece__title, .featured-pursuit__title");
    headings.forEach(heading => heading.style.removeProperty("view-transition-name"));

    const card = link.closest(".piece, .featured-pursuit");
    const heading = card?.querySelector(".piece__title, .featured-pursuit__title");
    if (!heading || !sharedProjectTitles.has(normalizeTitle(heading.textContent))) return;
    heading.style.viewTransitionName = "portfolio-project-title";
  });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const motion = 'cubic-bezier(.22,1,.36,1)';
  let animations = [];
  function setOpen(open, animate = true) {
    animations.forEach(animation => animation.cancel());
    animations = [];
    const before = intro.getBoundingClientRect();
    home.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Hide Projects' : 'Show Projects');
    panel.inert = !open;
    panel.setAttribute('aria-hidden', String(!open));
    const after = intro.getBoundingClientRect();
    if (animate) {
      if (!reduce.matches) animations.push(intro.animate([
        {transform: 'translateY(' + (before.top-after.top) + 'px)'},
        {transform: 'translateY(0)'}
      ], {duration: 500, easing:motion}));
      if (open) {
        animations.push(...[...panel.querySelectorAll('.piece, .work__label')].map((item, i) => item.animate([
          {opacity: reduce.matches ? .4 : 0, transform: reduce.matches ? 'none' : 'translateY(24px)'},
          {opacity: 1, transform: 'none'}
        ], {duration: reduce.matches ? 200 : 500, delay: reduce.matches ? 0 : 100 + Math.min(i,5)*60, easing:motion, fill:'backwards'})));
      }
    }
    if (open) {
      const target = panel.querySelector('.work__label') || panel;
      target.scrollIntoView({
        behavior: animate && !reduce.matches ? 'smooth' : 'auto',
        block: 'start'
      });
    }
  }
  setOpen(location.hash === '#work', false);
  document.documentElement.classList.remove('projects-open');
  button.addEventListener('click', () => {
    const open = !home.classList.contains('is-open');
    setOpen(open);
    history.pushState({projects:open}, '', open ? '#work' : location.pathname + location.search);
  });
  addEventListener('popstate', () => setOpen(location.hash === '#work'));
  addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !home.classList.contains('is-open')) return;
    setOpen(false);
    history.pushState({projects:false}, '', location.pathname + location.search);
    button.focus({preventScroll:true});
  });
})();
