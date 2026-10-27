(() => {
  const footer = document.querySelector('.site-footer');
  const title = footer?.querySelector('.site-footer__headline');
  const words = title?.querySelector('.site-footer__words');
  if (!footer || !title || !words) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches || !CSS.supports('background-clip', 'text')) return;
  const lens = document.createElement('span');
  lens.className = 'site-footer__lens'; lens.textContent = words.textContent; lens.setAttribute('aria-hidden', 'true'); title.append(lens);
  const text = words.textContent;
  const wordSpans = text.trim().split(/\s+/).map(word => {
    const span = document.createElement('span'); span.className = 'site-footer__word'; span.textContent = word; return span;
  });
  words.replaceChildren(...wordSpans.flatMap((span,i) => i ? [document.createTextNode(' '),span] : [span]));
  footer.classList.add('site-footer--reveal');
  let frame = 0, inside = false, visible = false, introStart = 0, played = false;
  let x = 0, y = 0, radius = 0, targetX = 0, targetY = 0, targetRadius = 0;
  function wake() { if (!frame && visible && !reduce.matches) frame = requestAnimationFrame(draw); }
  function draw(now) {
    frame = 0;
    if (introStart && !inside) {
      const progress = Math.min(1, (now - introStart) / 2000);
      targetX = title.clientWidth * (.1 + .8 * progress); targetY = title.clientHeight * .6;
      targetRadius = Math.sin(progress * Math.PI) * Math.min(145, title.clientWidth * .24);
      if (progress === 1) { introStart = 0; targetRadius = 0; }
    }
    x += (targetX - x) * .13; y += (targetY - y) * .13; radius += (targetRadius - radius) * .13;
    lens.style.setProperty('--lens-x', x + 'px'); lens.style.setProperty('--lens-y', (y - 8) + 'px'); lens.style.setProperty('--lens-r', radius + 'px');
    if (introStart || Math.abs(x-targetX)+Math.abs(y-targetY)+Math.abs(radius-targetRadius) > .15) wake();
  }
  title.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const rect = title.getBoundingClientRect(); targetX = event.clientX - rect.left; targetY = event.clientY - rect.top;
    if (!inside) { x = targetX; y = targetY; }
    inside = true; introStart = 0; targetRadius = Math.min(145, rect.width * .24); wake();
  });
  title.addEventListener('pointerleave', () => { inside = false; targetRadius = 0; wake(); });
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (!visible) { cancelAnimationFrame(frame); frame = 0; inside = false; introStart = 0; targetRadius = 0; radius = 0; lens.style.setProperty('--lens-r','0px'); return; }
    if (!played) { wordSpans.forEach((word,i) => word.animate([{opacity:.35},{opacity:1}], {duration:300,delay:i*60,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'})); played = true; introStart = performance.now(); x = title.clientWidth * .1; y = title.clientHeight * .6; }
    wake();
  }, {threshold:.3});
  observer.observe(title);
  reduce.addEventListener('change', () => { if (reduce.matches) { cancelAnimationFrame(frame); frame = 0; } else wake(); });
})();
