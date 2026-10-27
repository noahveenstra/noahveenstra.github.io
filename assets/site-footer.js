(() => {
 const footer = document.querySelector('.site-footer');
 if (!footer || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 footer.classList.add('site-footer--motion');
 let queued = false;
 function update() {
   const rect = footer.getBoundingClientRect();
   const distance = Math.max(1, innerHeight * .72);
   const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / distance));
   footer.style.setProperty('--footer-progress', (progress * 116 - 16) + '%');
   queued = false;
 }
 function schedule() { if (!queued) { queued = true; requestAnimationFrame(update); } }
 addEventListener('scroll', schedule, {passive:true});
 addEventListener('resize', schedule, {passive:true});
 update();
})();
