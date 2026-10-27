(() => {
  const home = document.querySelector('main.home:not(.project)');
  const button = home?.querySelector('.projects-toggle');
  const intro = home?.querySelector('.intro');
  const panel = document.getElementById('work-list');
  if (!home || !button || !intro || !panel) return;
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
    if (!animate) return;
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
